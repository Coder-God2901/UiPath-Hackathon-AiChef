import pytesseract
from PIL import Image
from pdf2image import convert_from_path
import shutil
import os

# Hardcode the correct path to tesseract.exe to bypass PATH issues.
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

POPPLER_PATH = r"C:\Users\KIIT\Downloads\Release-25.07.0-0\poppler-25.07.0\Library\bin"  # Adjust to your Poppler path

def extract_text_from_bill(filepath):
    print(f"Processing file: {filepath}")
    if filepath.endswith(".pdf"):
        pages = convert_from_path(filepath, poppler_path=POPPLER_PATH)
        text = ""
        for page in pages:
            text += pytesseract.image_to_string(page)
        return text
    else:
        img = Image.open(filepath)
        return pytesseract.image_to_string(img)