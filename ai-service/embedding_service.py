import logging
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List

logger = logging.getLogger(__name__)

# Load the model once globally when the module is imported
try:
    logger.info("Loading SentenceTransformer model 'all-MiniLM-L6-v2'...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load embedding model: {e}")
    model = None


def generate_embedding(text: str) -> List[float]:
    """
    Generates a normalized embedding vector for the given text using the global model.
    Returns the vector as a standard Python List[float] ready for pgvector insertion.
    """
    if model is None:
        raise RuntimeError("Embedding model is not loaded.")
        
    if not text or not text.strip():
        # Return a zero vector if the text is empty
        return np.zeros(384).tolist()
        
    # Generate the embedding ndarray
    embedding = model.encode(text)
    
    # Cast explicitly to float python types down the array for PostgreSQL compatibility
    return embedding.tolist()


def build_embedding_input(objectives: str, methodology: str, raw_text: str) -> str:
    """
    Constructs a stable embedding input string from the document content.
    If LLM sections are available, they are prioritized. Otherwise falls back to raw text preview.
    """
    # Take the first 2000 characters of raw_text as raw_preview
    raw_preview = raw_text[:2000] if raw_text else ""
    
    # If both objectives and methodology are successfully extracted and not "Not Found"
    if (objectives and objectives != "Not Found") and (methodology and methodology != "Not Found"):
        # Construct embedding text with sections
        embedding_text = f"Objectives: {objectives}\n\nMethodology: {methodology}\n\nContext:\n{raw_preview}"
        return embedding_text
    
    # Otherwise use only raw_preview
    return raw_preview
