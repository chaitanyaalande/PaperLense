import joblib
from ocr_document import extract_text

MODEL_PATH = "document_classifier.pkl"
VECTORIZER_PATH = "tfidf_vectorizer.pkl"

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)


def predict_from_image(image_path):
    text, engine = extract_text(image_path)

    print("\n=== OCR ENGINE USED ===")
    print(engine)

    print("\n=== OCR TEXT (PREVIEW) ===")
    print(text[:500])

    if len(text.split()) < 10:
        print("\n⚠️ OCR text too weak → classified as Other")
        return "Other", 0.0

    X = vectorizer.transform([text])
    probs = model.predict_proba(X)[0]

    classes = model.classes_
    best_idx = probs.argmax()

    return classes[best_idx], probs[best_idx]


if __name__ == "__main__":
    image_path = "sample4.jpeg"  # change image here
    label, confidence = predict_from_image(image_path)

    print("\n=== RESULT ===")
    print(f"Predicted Document Type: {label}")
    print(f"Confidence: {confidence*100:.2f}%")
