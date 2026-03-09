"""
Evaluation Pipeline — orchestrates the full AI evaluation workflow.

Steps:
  1. Extract proposal text from PDF
  2. Generate numerical features
  3. Run .pkl model inference
  4. Compute detailed score metrics
  5. Generate human-readable explanation
  6. Return structured analysis response
"""

import logging
from typing import Dict, Any

from services.text_extraction import extract_text, get_page_count
from services.feature_engineering import extract_features
from services.scoring_engine import predict_score, compute_detailed_scores
from services.explanation_engine import generate_explanation
from evaluation_engine import compute_proposal_index

logger = logging.getLogger(__name__)

# Simple keyword-based domain classifier
DOMAIN_KEYWORDS = {
    "Machine Learning": ["machine learning", "deep learning", "neural network", "classification", "regression", "training data"],
    "Natural Language Processing": ["nlp", "natural language", "text mining", "sentiment", "tokenization", "language model"],
    "Computer Vision": ["image recognition", "object detection", "convolutional", "segmentation", "visual"],
    "Cybersecurity": ["security", "encryption", "vulnerability", "intrusion", "malware", "cyber"],
    "Biotechnology": ["gene", "protein", "dna", "biomarker", "clinical trial", "pharmaceutical"],
    "Renewable Energy": ["solar", "wind energy", "renewable", "sustainable", "carbon", "emission"],
    "Robotics": ["robot", "autonomous", "actuator", "kinematics", "manipulation"],
    "Data Science": ["data analysis", "big data", "analytics", "visualization", "statistics"],
}


def classify_domain(text: str) -> str:
    """Simple keyword-based domain classification."""
    text_lower = text.lower()
    scores = {}
    for domain, keywords in DOMAIN_KEYWORDS.items():
        scores[domain] = sum(1 for kw in keywords if kw in text_lower)
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "General Research"


def run_evaluation(file_path: str) -> Dict[str, Any]:
    """
    Full evaluation pipeline for a single proposal PDF.

    Args:
        file_path: path to the saved PDF on disk

    Returns:
        Structured evaluation result dictionary
    """
    logger.info(f"Starting evaluation pipeline for {file_path}")

    # Step 1 — Extract text
    text = extract_text(file_path)
    pages = get_page_count(file_path)
    word_count = len(text.split()) if text else 0

    if not text or word_count < 50:
        return {
            "status": "error",
            "message": "Insufficient text extracted from PDF. The document may be scanned or empty.",
        }

    # Classify domain
    domain = classify_domain(text)

    # Step 2 — Generate features
    # For now max_similarity defaults to 0.0 (no DB lookup in this pipeline)
    # The main.py /analyze endpoint can pass in real similarity if available
    features = extract_features(text, max_similarity=0.0)

    # Step 3 — PKL model inference
    raw_result = predict_score(features)
    raw_score = raw_result["score"]
    confidence = raw_result["confidence"]

    # Step 4 — Detailed score breakdown
    detailed = compute_detailed_scores(features, raw_score)
    scores = detailed["scores"]
    
    # Compute PEI (Proposal Evaluation Index) over the detailed scores
    pei_input = {
        "novelty_score": scores.get("novelty", 0) / 100.0,
        "methodology_score": scores.get("methodology", 0) / 100.0,
        "feasibility_score": scores.get("feasibility", 0) / 100.0,
        "completeness_score": scores.get("completeness", 0) / 100.0,
        "risk_density_score": 0.0,
        "highest_similarity": 1.0 - features[4]
    }
    
    pei_result = compute_proposal_index(pei_input)
    overall_score = pei_result["final_score"]

    # Step 5 — Explanation
    feature_info = {
        "word_count": word_count,
        "methodology_density": round(features[1], 4),
        "technical_terms": int(features[3] * 100),
    }
    explanation = generate_explanation(scores, overall_score, feature_info, domain)

    # Step 6 — Risk level
    if overall_score >= 70:
        risk_level = "Low"
    elif overall_score >= 45:
        risk_level = "Medium"
    else:
        risk_level = "High"

    # Category
    if overall_score >= 85:
        category = "Strong Proposal"
    elif overall_score >= 70:
        category = "Promising Proposal"
    elif overall_score >= 50:
        category = "Moderate Proposal"
    elif overall_score >= 30:
        category = "Weak Proposal"
    else:
        category = "Very Weak Proposal"

    result = {
        "status": "evaluated",
        "domain": domain,
        "scores": scores,
        "overall_score": overall_score,
        "category": category,
        "risk_level": risk_level,
        "confidence": confidence,
        "features": feature_info,
        "explanation": explanation,
        "pages": pages,
        "word_count": word_count,
        "preview": text[:500],
    }

    logger.info(f"Evaluation complete: score={overall_score}, category={category}")
    return result
