import re
import fitz  # PyMuPDF
import logging
from typing import Optional
from pathlib import Path

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_path: str) -> Optional[str]:
    """
    Deterministically extracts text from a PDF file using PyMuPDF.
    
    Args:
        file_path (str): The path to the PDF file on disk.
        
    Returns:
        Optional[str]: The concatenated raw text from the PDF, or None if extraction fails.
    """
    path = Path(file_path)
    if not path.is_file() or not path.suffix.lower() == ".pdf":
        raise ValueError("Provided file path must be a valid PDF document.")
        
    doc = None
    try:
        # Open document and read content
        doc = fitz.open(file_path)
        pages_text = []
        for page_num in range(len(doc)):
            page = doc[page_num]
            pages_text.append(page.get_text("text"))
            
        return "\n".join(pages_text)
    except Exception as e:
        logger.error(f"Failed to extract text from {file_path}: {e}")
        raise e
    finally:
        # Always make sure we release file resources
        if doc:
            doc.close()



def clean_text(text: str) -> str:
    """
    Cleans raw text data extracted from a PDF.
    """

    if not text:
        return ""

    # Remove zero-width characters
    text = re.sub(r'[\u200b\u200c\u200d\u200e\u200f\uFEFF]', '', text)
    text = re.sub(r'[\u2028\u2029]', '\n', text)

    # Fix hyphenated line breaks (e.g., differ-\nential)
    text = re.sub(r'-\n', '', text)

    # Merge single line breaks inside paragraphs
    text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)

    # Normalize multiple spaces
    text = re.sub(r' +', ' ', text)

    # Normalize excessive newlines
    text = re.sub(r'\n{3,}', '\n\n', text)

    return text.strip()

def get_page_count(file_path: str) -> int:
    """
    Determines the number of pages in the PDF file.
    """
    doc = None
    try:
        doc = fitz.open(file_path)
        return len(doc)
    except Exception as e:
        logger.error(f"Failed to open PDF for page count: {e}")
        raise e
    finally:
        if doc:
            doc.close()
