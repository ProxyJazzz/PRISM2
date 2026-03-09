import hashlib

def compute_document_hash(raw_text: str) -> str:
    """
    Computes a SHA-256 hash for the given raw text to detect exact duplicates.
    """
    if not raw_text:
        raw_text = ""
        
    hash_object = hashlib.sha256(raw_text.encode("utf-8"))
    return hash_object.hexdigest()
