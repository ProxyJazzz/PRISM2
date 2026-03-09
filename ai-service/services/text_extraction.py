"""
Text Extraction — extracts raw text from uploaded PDF files using pdfplumber.
"""

import re
import logging
from typing import Optional
from pathlib import Path

logger = logging.getLogger(__name__)


def extract_text(file_path: str) -> str:
    """
    Extract full text from a PDF using pdfplumber.
    Falls back to PyMuPDF (fitz) if pdfplumber fails.
    """
    path = Path(file_path)
    if not path.is_file() or path.suffix.lower() != ".pdf":
        raise ValueError("Provided file path must be a valid PDF document.")

    text = _extract_with_pdfplumber(file_path)

    if not text or not text.strip():
        logger.warning("pdfplumber returned empty text, falling back to PyMuPDF")
        text = _extract_with_pymupdf(file_path)

    return clean_text(text or "")


def _extract_with_pdfplumber(file_path: str) -> Optional[str]:
    try:
        import pdfplumber
        pages_text = []
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    pages_text.append(page_text)
        return "\n".join(pages_text)
    except Exception as e:
        logger.error(f"pdfplumber extraction failed: {e}")
        return None


def _extract_with_pymupdf(file_path: str) -> Optional[str]:
    try:
        import fitz
        doc = fitz.open(file_path)
        pages_text = [doc[i].get_text("text") for i in range(len(doc))]
        doc.close()
        return "\n".join(pages_text)
    except Exception as e:
        logger.error(f"PyMuPDF extraction failed: {e}")
        return None


def get_page_count(file_path: str) -> int:
    """Return the number of pages in the PDF."""
    try:
        import pdfplumber
        with pdfplumber.open(file_path) as pdf:
            return len(pdf.pages)
    except Exception:
        try:
            import fitz
            doc = fitz.open(file_path)
            count = len(doc)
            doc.close()
            return count
        except Exception as e:
            logger.error(f"Failed to get page count: {e}")
            return 0


def clean_text(text: str) -> str:
    """Normalize and clean extracted text."""
    if not text:
        return ""
    # Remove null bytes — PostgreSQL JSON rejects \x00
    text = text.replace('\x00', '')
    text = re.sub(r'[\u200b\u200c\u200d\u200e\u200f\uFEFF]', '', text)
    text = re.sub(r'[\u2028\u2029]', '\n', text)
    text = re.sub(r'-\n', '', text)
    text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)
    text = re.sub(r' +', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()
