"""
Explanation Engine — generates human-readable evaluation explanations.

Uses Gemini API when available, otherwise falls back to template-based generation.
"""

import os
import json
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


def generate_explanation(
    scores: Dict[str, int],
    overall_score: float,
    features: Dict[str, Any],
    domain: str = "General",
) -> str:
    """
    Generate a human-readable explanation for the evaluation result.
    Tries Gemini first; falls back to template-based explanation.
    """
    # Try AI-generated explanation
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        try:
            return _gemini_explanation(scores, overall_score, features, domain)
        except Exception as e:
            logger.warning(f"Gemini explanation failed, using template: {e}")

    return _template_explanation(scores, overall_score, features, domain)


def _gemini_explanation(
    scores: Dict[str, int],
    overall_score: float,
    features: Dict[str, Any],
    domain: str,
) -> str:
    """Generate explanation using Gemini API."""
    import google.generativeai as genai

    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""You are an expert research proposal evaluator. Generate a concise evaluation explanation for a {domain} research proposal. 

Explain the overall outcome in 150-200 words, and provide 1-2 sentence explanations for *why* the proposal received its specific score for EACH of the individual parameters.

Evaluation Scores:
- Novelty: {scores.get('novelty', 0)}%
- Methodology: {scores.get('methodology', 0)}%  
- Feasibility: {scores.get('feasibility', 0)}%
- Completeness: {scores.get('completeness', 0)}%
- Budget Validity: {scores.get('budget', 0)}%
- Overall Score: {overall_score}%

Proposal Features:
- Word Count: {features.get('word_count', 'N/A')}
- Methodology Keyword Density: {features.get('methodology_density', 'N/A')}
- Technical Terms Found: {features.get('technical_terms', 'N/A')}

RULES:
- Start the overall summary with a clear assessment (e.g. "This proposal is strong...")
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
    "budget": "Explanation for the budget score..."
  }}
}}
"""

    response = model.generate_content(prompt)
    raw = response.text.strip()
    if raw.startswith("```json"):
        raw = raw[7:]
    if raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]
    try:
        return json.loads(raw.strip())
    except Exception:
        return { "overall": raw.strip(), "parameters": {} }


def _template_explanation(
    scores: Dict[str, int],
    overall_score: float,
    features: Dict[str, Any],
    domain: str,
) -> Dict[str, Any]:
    """Generate template-based explanation when Gemini is unavailable, mapped to the JSON schema."""

    # Determine overall assessment
    if overall_score >= 80:
        assessment = "strong"
        verdict = "The proposal is well-structured and demonstrates high potential for impactful research outcomes."
    elif overall_score >= 60:
        assessment = "promising"
        verdict = "The proposal shows promise but has areas that could be strengthened for a more compelling submission."
    elif overall_score >= 40:
        assessment = "moderate"
        verdict = "The proposal requires significant revisions to meet competitive evaluation standards."
    else:
        assessment = "weak"
        verdict = "The proposal needs substantial rework across multiple dimensions before it can be considered viable."

    parts = [f"This {domain} research proposal received an overall score of {overall_score}%, indicating a {assessment} submission."]

    # Strengths
    strengths = [k for k, v in scores.items() if v >= 70]
    if strengths:
        strength_text = ", ".join(s.replace("_", " ").title() for s in strengths)
        parts.append(f"The proposal demonstrates strong performance in {strength_text}.")

    # Weaknesses
    weaknesses = [k for k, v in scores.items() if v < 50]
    if weaknesses:
        weak_text = ", ".join(w.replace("_", " ").title() for w in weaknesses)
        parts.append(f"Areas requiring improvement include {weak_text}.")

    # Specific insights
    novelty = scores.get("novelty", 0)
    if novelty < 50:
        parts.append("The novelty score indicates significant overlap with existing research in the database, suggesting the need for a more distinctive research angle.")
    elif novelty >= 80:
        parts.append("The proposal exhibits high novelty, indicating a unique research direction not heavily represented in existing literature.")

    methodology = scores.get("methodology", 0)
    if methodology < 50:
        parts.append("The methodology section lacks sufficient detail or established research methods.")

    budget = scores.get("budget", 0)
    if budget < 50:
        parts.append("No clear budget or financial plan was detected, which impacts feasibility assessment.")

    parts.append(verdict)

    return { 
        "overall": " ".join(parts), 
        "parameters": {
            "novelty": "Novelty score reflects overlap with existing database proposals.",
            "methodology": "Methodology evaluates technical depth and keyword density.",
            "feasibility": "Feasibility measures practical deliverability and technical terms.",
            "completeness": "Completeness assesses word count and overall structure.",
            "budget": "Budget validity reflects the presence of financial planning details."
        }
    }
