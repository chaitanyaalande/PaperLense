import cv2
import pytesseract
import joblib

MODEL_PATH = "model/document_classifier.pkl"
VECTORIZER_PATH = "model/tfidf_vectorizer.pkl"

def extract_text(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return pytesseract.image_to_string(gray)

# Load model
model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# Test image
image_path = "sample.jpg"   # change this

text = extract_text(image_path)

X = vectorizer.transform([text])
prediction = model.predict(X)[0]
confidence = model.predict_proba(X).max()

print("\n===== RESULT =====")
print("Predicted Document Type:", prediction)
print(f"Confidence: {confidence*100:.2f}%")
