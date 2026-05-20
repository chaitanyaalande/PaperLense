import cv2
import pytesseract
import easyocr
import io
import numpy as np
from PIL import Image

# Initialize EasyOCR reader (loads model into memory once)
# 'en' for English. Add more languages if needed.
reader = easyocr.Reader(['en'], gpu=False)

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Convert bytes to a format suitable for OCR (grayscale, noise reduction).
    """
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply thresholding or other preprocessing if needed
    # For now, simple grayscale is often enough for modern OCR engines
    return gray

def extract_text(image_bytes: bytes) -> str:
    """
    Extract text using Tesseract, falling back to EasyOCR.
    """
    try:
        # Preprocess
        processed_img = preprocess_image(image_bytes)
        
        # 1. Try Tesseract
        # Preserve original casing (default behavior of image_to_string)
        text = pytesseract.image_to_string(processed_img)
        
        # Check if result is "weak" (empty or very short)
        if len(text.strip()) > 5:
            return text.strip()
            
        # 2. Fallback to EasyOCR
        print("Tesseract result weak, falling back to EasyOCR...")
        # EasyOCR works on the original image bytes or numpy array
        # It's robust to rotation and complex backgrounds
        results = reader.readtext(processed_img, detail=0)
        text = " ".join(results)
        
        return text.strip()
        
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""
