from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
import json
from datetime import datetime
from starlette.staticfiles import StaticFiles
from dotenv import load_dotenv

load_dotenv()

from ocr_engine import extract_text
from classifier import classifier
from database import connect_db
from auth import router as auth_router, get_current_user

app = FastAPI(title="PaperLense API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:8080", "http://127.0.0.1:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

BASE_DOCS_DIR = os.path.join(os.path.dirname(__file__), "classified_docs")

def get_user_dir(user_id: str) -> str:
    """Each user gets their own folder: classified_docs/{user_id}/"""
    user_dir = os.path.join(BASE_DOCS_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)
    return user_dir

class ScanResponse(BaseModel):
    text: str
    document_type: str
    confidence: float

@app.get("/")
def read_root():
    return {"message": "PaperLense API running!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/scan", response_model=ScanResponse)
async def scan_document(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    try:
        contents = await file.read()
        extracted_text = extract_text(contents)
        doc_type, confidence = classifier.classify_document(extracted_text)
        return {"text": extracted_text, "document_type": doc_type, "confidence": confidence}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.post("/save-document")
async def save_document(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    text: str = Form(""),
    confidence: float = Form(0.0),
    original_filename: str = Form(""),
    current_user=Depends(get_current_user)
):
    try:
        user_id = str(current_user["_id"])
        user_dir = get_user_dir(user_id)
        category_dir = os.path.join(user_dir, document_type)
        os.makedirs(category_dir, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_name = (original_filename or file.filename).replace(" ", "_")
        filename = f"{timestamp}_{safe_name}"
        file_path = os.path.join(category_dir, filename)

        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        metadata = {
            "filename": filename,
            "original_name": original_filename or file.filename,
            "document_type": document_type,
            "text": text,
            "confidence": confidence,
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "user_id": user_id
        }
        meta_path = os.path.join(category_dir, f"{timestamp}_metadata.json")
        with open(meta_path, "w") as mf:
            json.dump(metadata, mf, indent=2)

        return {"message": "Document saved successfully", "filename": filename, "category": document_type}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Save failed: {str(e)}")

@app.get("/categories")
def get_categories(current_user=Depends(get_current_user)):
    user_dir = get_user_dir(str(current_user["_id"]))
    if not os.path.exists(user_dir):
        return {}

    categories = {}
    for cat in os.listdir(user_dir):
        cat_path = os.path.join(user_dir, cat)
        if os.path.isdir(cat_path):
            files = [f for f in os.listdir(cat_path) if not f.endswith("_metadata.json")]
            categories[cat] = len(files)
    return categories

@app.get("/documents")
def get_all_documents(current_user=Depends(get_current_user)):
    user_dir = get_user_dir(str(current_user["_id"]))
    if not os.path.exists(user_dir):
        return []

    docs = []
    user_id = str(current_user["_id"])
    for cat in os.listdir(user_dir):
        cat_path = os.path.join(user_dir, cat)
        if os.path.isdir(cat_path):
            files = [f for f in os.listdir(cat_path) if not f.endswith("_metadata.json")]
            for f in files:
                timestamp = f.split("_", 1)[0]
                metadata_path = os.path.join(cat_path, f"{timestamp}_metadata.json")
                doc_info = {
                    "id": f,
                    "name": f,
                    "category": cat,
                    "preview": "No text extracted",
                    "accuracy": 0.0,
                    "date": "Unknown",
                    "url": f"/files/{user_id}/{cat}/{f}",
                    "thumbnail": f"/files/{user_id}/{cat}/{f}"
                }
                if os.path.exists(metadata_path):
                    with open(metadata_path, "r") as mf:
                        try:
                            meta = json.load(mf)
                            text = meta.get("text", "")
                            doc_info["preview"] = text[:150] + "..." if len(text) > 150 else text
                            doc_info["accuracy"] = round(meta.get("confidence", 0) * 100, 1)
                            doc_info["date"] = meta.get("date", "Unknown")
                        except json.JSONDecodeError:
                            pass
                docs.append(doc_info)

    docs.sort(key=lambda x: x["id"], reverse=True)
    return docs

@app.get("/documents/{category}")
def get_documents(category: str, current_user=Depends(get_current_user)):
    user_id = str(current_user["_id"])
    cat_path = os.path.join(get_user_dir(user_id), category)
    if not os.path.exists(cat_path):
        return []

    docs = []
    files = [f for f in os.listdir(cat_path) if not f.endswith("_metadata.json")]
    files.sort(reverse=True)

    for f in files:
        timestamp = f.split("_", 1)[0]
        metadata_path = os.path.join(cat_path, f"{timestamp}_metadata.json")
        doc_info = {
            "id": f,
            "name": f,
            "preview": "No text extracted",
            "accuracy": 0.0,
            "date": "Unknown",
            "url": f"/files/{user_id}/{category}/{f}"
        }
        if os.path.exists(metadata_path):
            with open(metadata_path, "r") as mf:
                try:
                    meta = json.load(mf)
                    text = meta.get("text", "")
                    doc_info["preview"] = text[:100] + "..." if len(text) > 100 else text
                    doc_info["accuracy"] = round(meta.get("confidence", 0) * 100, 1)
                    doc_info["date"] = meta.get("date", "Unknown")
                except json.JSONDecodeError:
                    pass
        docs.append(doc_info)

    return docs

@app.delete("/documents/{category}/{filename}")
def delete_document(category: str, filename: str, current_user=Depends(get_current_user)):
    user_id = str(current_user["_id"])
    cat_path = os.path.join(get_user_dir(user_id), category)
    file_path = os.path.join(cat_path, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    os.remove(file_path)
    timestamp = filename.split("_", 1)[0]
    meta_path = os.path.join(cat_path, f"{timestamp}_metadata.json")
    if os.path.exists(meta_path):
        os.remove(meta_path)

    return {"message": "Document deleted successfully"}

app.mount("/files", StaticFiles(directory=BASE_DOCS_DIR), name="files")

if __name__ == "__main__":
    os.makedirs(BASE_DOCS_DIR, exist_ok=True)
    connect_db()
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
