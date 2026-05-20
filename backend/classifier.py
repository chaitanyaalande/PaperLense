import joblib
import os
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Path to models (ensure these exist)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "model.joblib")
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "models", "vectorizer.joblib")

class Classifier:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self._load_models()

    def _load_models(self):
        if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                self.vectorizer = joblib.load(VECTORIZER_PATH)
                print("Models loaded successfully.")
            except Exception as e:
                print(f"Error loading models: {e}")
        else:
            print(f"Models not found at {MODEL_PATH} or {VECTORIZER_PATH}")

    def classify_document(self, text: str):
        """
        Returns (document_type, confidence_score)
        """
        if not self.model or not self.vectorizer:
            return "Unknown", 0.0
        
        if not text or not text.strip():
            return "Unknown", 0.0

        try:
            # Transform text
            text_vec = self.vectorizer.transform([text])
            
            # Predict
            prediction = self.model.predict(text_vec)[0]
            
            # Get probability/confidence
            # model.predict_proba returns array of probs for each class
            # we want the max probability
            probas = self.model.predict_proba(text_vec)
            confidence = float(np.max(probas))
            
            return prediction, confidence
            
        except Exception as e:
            print(f"Classification error: {e}")
            return "Error", 0.0

# Singleton instance
classifier = Classifier()
