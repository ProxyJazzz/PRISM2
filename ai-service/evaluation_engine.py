"""
Proposal Evaluation Index (PEI)

This module converts deterministic evaluation signals into a
single interpretable score to assist proposal screening.

The PEI is NOT used to make final funding decisions.
It is intended as a decision-support signal for reviewers.
"""

from typing import Dict, Any

def compute_proposal_index(scores: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes a deterministic proposal evaluation index based on evaluation signals.
    """
    # Step 1: Compute base score using dynamic averaging
    signals = [
        scores.get("novelty_score"),
        scores.get("methodology_score"),
        scores.get("feasibility_score"),
        scores.get("completeness_score")
    ]
    
    valid_signals = [s for s in signals if s is not None and isinstance(s, (int, float))]
    
    total_signals = 4
    evaluation_confidence = round(len(valid_signals) / total_signals, 2)
    
    if valid_signals:
        base_score = sum(valid_signals) / len(valid_signals)
    else:
        base_score = 0.0
        
    initial_base_score = base_score
        
    # Step 2: Apply risk awareness bonus
    risk_density_score = scores.get("risk_density_score", 0.0)
    risk_bonus = 0.0
    if risk_density_score > 0:
        risk_bonus = 0.05 * min(risk_density_score, 1.0)
        base_score = base_score + risk_bonus
        
    # Step 3: Apply redundancy penalty
    highest_similarity = scores.get("highest_similarity", 0.0)
    redundancy_penalty_applied = False
    if highest_similarity > 0.95:
        # Penalize extremely similar proposals to discourage duplicate submissions
        base_score = base_score * 0.6
        redundancy_penalty_applied = True
        
    # Step 4: Clamp score
    base_score = max(0.0, min(base_score, 1.0))
    
    # Step 5: Convert to 0-100 scale
    final_score = round(base_score * 100)
    
    # Assign proposal category
    if final_score >= 85:
        category = "Strong Proposal"
    elif final_score >= 70:
        category = "Promising Proposal"
    elif final_score >= 50:
        category = "Moderate Proposal"
    elif final_score >= 30:
        category = "Weak Proposal"
    else:
        category = "Very Weak Proposal"
        
    return {
        "final_score": final_score,
        "category": category,
        "evaluation_confidence": evaluation_confidence,
        "score_breakdown": {
            "base_score": round(initial_base_score, 3),
            "risk_bonus": round(risk_bonus, 3),
            "redundancy_penalty_applied": redundancy_penalty_applied
        }
    }
