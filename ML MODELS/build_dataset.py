import os
import csv
import cv2
import pytesseract

DATASET_DIR = "dataset/train"
OUTPUT_CSV = "dataset/documents.csv"

def extract_text(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return ""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray)
    return text.strip()

rows = []

for label in os.listdir(DATASET_DIR):
    label_path = os.path.join(DATASET_DIR, label)
    if not os.path.isdir(label_path):
        continue

    for file in os.listdir(label_path):
        if file.lower().endswith((".jpg", ".jpeg", ".png")):
            img_path = os.path.join(label_path, file)
            text = extract_text(img_path)

            if len(text) < 30:   # skip useless OCR
                continue

            rows.append([text, label])

with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["text", "label"])
    writer.writerows(rows)

print(f"Saved {len(rows)} documents to {OUTPUT_CSV}")
