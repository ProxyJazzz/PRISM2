from typing import Dict, Any

def classify_document_type(text: str) -> Dict[str, Any]:
    """
    Classifies the document type based on keyword occurrences.
    """
    if not text:
        return {
            "document_type": "Other",
            "confidence": 0.0,
            "keyword_scores": {
                "Research Proposal": 0,
                "Research Paper": 0,
                "Technical Report": 0,
                "Policy Document": 0
            }
        }

    text_lower = text.lower()
    
    keywords = {
        "Research Proposal": [
            "proposal", "project timeline", "milestones", "budget", 
            "deliverables", "funding request", "research plan"
        ],
        "Research Paper": [
            "abstract", "introduction", "methodology", "results", 
            "experiments", "conclusion", "references"
        ],
        "Technical Report": [
            "system architecture", "implementation", "performance evaluation", 
            "technical specification", "benchmark"
        ],
        "Policy Document": [
            "policy", "regulation", "government", "financial support", 
            "guidelines", "compliance"
        ]
    }
    
    keyword_scores: Dict[str, int] = {category: 0 for category in keywords}
    total_scores: int = 0
    
    for category, category_keywords in keywords.items():
        for keyword in category_keywords:
            count = text_lower.count(keyword.lower())
            keyword_scores[category] += count
            total_scores += count
            
    if total_scores == 0:
        return {
            "document_type": "Other",
            "confidence": 0.0,
            "keyword_scores": keyword_scores
        }
        
    max_category = max(keyword_scores, key=keyword_scores.get)
    max_score = keyword_scores[max_category]
    confidence = max_score / total_scores if total_scores > 0 else 0.0
    
    # Optional round confidence
    confidence = round(confidence, 2)
    
    return {
        "document_type": max_category,
        "confidence": confidence,
        "keyword_scores": keyword_scores
    }
