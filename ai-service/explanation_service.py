import json
import logging
from typing import Dict, Any, Optional
import google.generativeai as genai
from llm_service import get_gemini_model  # Re-use model instance and configuration

logger = logging.getLogger(__name__)

def generate_evaluation_summary(scores: Dict[str, Any], evaluation: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Generates a professional evaluation summary using the LLM based purely on computed deterministic scores.
    """
    
    final_score = evaluation.get("final_score", 0) if evaluation else 0
    category = evaluation.get("category", "Unknown") if evaluation else "Unknown"

    prompt = f"""
Given the following evaluation metrics and final proposal score:

Novelty Score: {scores.get('novelty_score', 0)}
Methodology Score: {scores.get('methodology_score', 0)}
Feasibility Score: {scores.get('feasibility_score', 0)}
Completeness Score: {scores.get('completeness_score', 0)}
Risk Density Score: {scores.get('risk_density_score', 0)}
Highest Similarity With Existing Proposal: {scores.get('highest_similarity', 0.0)}

Final Proposal Score: {final_score}
Category: {category}

Explain the overall outcome in 150-200 words, and provide 1-2 sentence explanations for *why* the proposal received its specific score for EACH of the individual parameters.

RULES:
- Maintain formal institutional tone
- RETURN STRICTLY VALID JSON ONLY, with NO markdown code blocks. 
- Use the exact schema:
{{
  "overall": "The 150-200 word summary here...",
  "parameters": {{
    "novelty": "Explanation for the novelty score...",
    "methodology": "Explanation for the methodology score...",
    "feasibility": "Explanation for the feasibility score...",
    "completeness": "Explanation for the completeness score...",
    "budget": "Explanation for the budget/risk score..."
  }}
}}
"""

    try:
        model = get_gemini_model()
        response = model.generate_content(prompt)
        raw = response.text.strip()
        if raw.startswith("```json"):
            raw = raw[7:]
        if raw.startswith("```"):
            raw = raw[3:]
        if raw.endswith("```"):
            raw = raw[:-3]
            
        return json.loads(raw.strip())
    except Exception as e:
        logger.error(f"Failed to generate evaluation summary: {e}")
        return {
            "overall": "Explanation generation failed due to an internal error.",
            "parameters": {}
        }
