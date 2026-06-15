import io

import google.generativeai as genai
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image
from pypdf import PdfReader

from app.config import settings

genai.configure(api_key=settings.google_api_key)


def _text_from_pdf(data: bytes) -> str:
    """Try direct text extraction first (fast, free)."""
    reader = PdfReader(io.BytesIO(data))
    return "\n".join((page.extract_text() or "") for page in reader.pages).strip()


def _ocr_image(img: Image.Image) -> str:
    """Tesseract OCR, Telugu + English."""
    return pytesseract.image_to_string(img, lang="tel+eng").strip()


def _vision_describe(img: Image.Image) -> str:
    """Use Gemini Vision when OCR is weak (handwriting, complex layout)."""
    model = genai.GenerativeModel(settings.chat_model)
    prompt = (
        "Extract ALL text from this document image. "
        "Preserve numbers, dates, and labels exactly. "
        "If the text is Telugu, keep it in Telugu."
    )
    resp = model.generate_content([prompt, img])
    return (resp.text or "").strip()


def extract_text(filename: str, data: bytes) -> str:
    """
    Smart router:
      - PDF with real text  -> direct extract
      - scanned PDF / image -> Tesseract OCR, fall back to Gemini Vision
    """
    name = filename.lower()

    if name.endswith(".pdf"):
        text = _text_from_pdf(data)
        if len(text) > 50:                       # real text PDF
            return text
        # scanned PDF -> OCR each page
        pages = convert_from_bytes(data)
        return "\n".join(_ocr_image(p) for p in pages).strip()

    # image file
    img = Image.open(io.BytesIO(data))
    text = _ocr_image(img)
    if len(text) < 20:                           # OCR struggled -> vision
        text = _vision_describe(img)
    return text
