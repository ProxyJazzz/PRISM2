from typing import Dict, Any

def validate_document_type(raw_text: str, structured_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Deterministically validates whether the uploaded document is likely a research proposal
    based on keyword frequency and structural LLM outputs, without invoking another LLM call.
    """
    
    # 1. Keyword-based detection
    keywords = [
        "research", "objective", "methodology", "experiment",
        "study", "analysis", "hypothesis", "proposal", "evaluation"
    ]
    
    text_lower = raw_text.lower() if raw_text else ""
    keyword_hits = sum(1 for word in keywords if word in text_lower)
    
    # 2. Structured section validation
    structured_hits = 0
    if structured_data.get("objectives", "Not Found") != "Not Found":
        structured_hits += 1
    if structured_data.get("methodology", "Not Found") != "Not Found":
        structured_hits += 1
        
    # 3. Decision Logic
    is_valid = True
    document_type = "Research Proposal"
    
    if keyword_hits < 2 and structured_hits == 0:
        is_valid = False
        document_type = "Non-Proposal"
        
    return {
        "document_type": document_type,
        "validation_passed": is_valid,
        "keyword_hits": keyword_hits,
        "structured_hits": structured_hits
    }
