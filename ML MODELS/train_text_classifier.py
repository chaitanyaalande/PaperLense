import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# =========================
# CONFIG
# =========================
DATASET_PATH = "dataset/documents.csv"   # <-- must exist
MODEL_PATH = "document_classifier.pkl"
VECTORIZER_PATH = "tfidf_vectorizer.pkl"

# =========================
# LOAD DATASET
# =========================
if not os.path.exists(DATASET_PATH):
    raise FileNotFoundError(f"Dataset not found: {DATASET_PATH}")

df = pd.read_csv(DATASET_PATH)

# Expected columns: text,label
if "text" not in df.columns or "label" not in df.columns:
    raise ValueError("CSV must contain 'text' and 'label' columns")

# Clean text
df["text"] = df["text"].astype(str).str.lower()
df["text"] = df["text"].str.replace(r"\s+", " ", regex=True)

X = df["text"]
y = df["label"]

print(f"📄 Total samples: {len(df)}")
print("📂 Classes:", df["label"].value_counts().to_dict())

# =========================
# TRAIN / TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# =========================
# TF-IDF VECTORIZATION
# =========================
vectorizer = TfidfVectorizer(
    ngram_range=(1, 2),
    max_features=5000,
    stop_words="english"
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# =========================
# MODEL
# =========================
model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced",
    n_jobs=-1
)

model.fit(X_train_vec, y_train)

# =========================
# EVALUATION
# =========================
y_pred = model.predict(X_test_vec)

accuracy = accuracy_score(y_test, y_pred)

print("\n===== MODEL EVALUATION =====")
print(f"Accuracy: {accuracy:.4f}\n")
print("Classification Report:")
print(classification_report(y_test, y_pred, zero_division=0))

# =========================
# SAVE MODEL + VECTORIZER
# =========================
joblib.dump(model, MODEL_PATH)
joblib.dump(vectorizer, VECTORIZER_PATH)

print("\n✅ Model saved to:", MODEL_PATH)
print("✅ Vectorizer saved to:", VECTORIZER_PATH)
print("🎉 Training complete")
