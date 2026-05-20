import cv2
import pytesseract
import easyocr
import numpy as np
import re

# Update path if needed
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

easy_reader = easyocr.Reader(['en'], gpu=False)


# ---------------- IMAGE PREPROCESSING ---------------- #

def preprocess_image(image_path):
    img = cv2.imread(image_path)

    if img is None:
        raise ValueError("Image not found")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Resize (important for small text)
    gray = cv2.resize(gray, None, fx=1.6, fy=1.6, interpolation=cv2.INTER_CUBIC)

    # Increase contrast
    gray = cv2.normalize(gray, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)

    # Denoise
    gray = cv2.fastNlMeansDenoising(gray, None, 30, 7, 21)

    # Adaptive threshold
    thresh = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31, 11
    )

    # Morphological close (JOIN BROKEN LETTERS)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    return thresh


# ---------------- OCR METHODS ---------------- #

def tesseract_ocr(image):
    configs = [
        "--oem 3 --psm 4",
        "--oem 3 --psm 6",
        "--oem 3 --psm 11"
    ]

    best_text = ""
    for cfg in configs:
        text = pytesseract.image_to_string(image, config=cfg, lang="eng")
        if len(text.strip()) > len(best_text.strip()):
            best_text = text

    return best_text.strip()


def easyocr_ocr(image_path):
    results = easy_reader.readtext(image_path, detail=0, paragraph=True)
    return " ".join(results).strip()


# ---------------- TEXT CLEANING (VERY IMPORTANT) ---------------- #

def clean_ocr_text(text):
    text = text.lower()
    text = text.replace("\n", " ")
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    # Remove very short junk words
    words = [w for w in text.split() if len(w) > 2]
    return " ".join(words)


# ---------------- QUALITY SCORING ---------------- #

def text_quality_score(text):
    words = text.split()
    if len(words) == 0:
        return 0

    avg_len = sum(len(w) for w in words) / len(words)
    return len(words) * avg_len


# ---------------- FINAL OCR PIPELINE ---------------- #

def extract_text(image_path):
    processed = preprocess_image(image_path)

    tess_text = clean_ocr_text(tesseract_ocr(processed))
    easy_text = clean_ocr_text(easyocr_ocr(image_path))

    tess_score = text_quality_score(tess_text)
    easy_score = text_quality_score(easy_text)

    if easy_score > tess_score:
        return easy_text, "easyocr"

    return tess_text, "tesseract"


# ---------------- TEST ---------------- #

if __name__ == "__main__":
    img = "sample.jpg"
    text, engine = extract_text(img)

    print("\n===== OCR ENGINE =====")
    print(engine)

    print("\n===== OCR TEXT (PREVIEW) =====")
    print(text[:1000])
