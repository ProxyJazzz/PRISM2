import os
import json
import logging
import re
import google.generativeai as genai

logger = logging.getLogger(__name__)

def get_gemini_model():
    """Configures the Gemini model using the provided API key from environment."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.warning("GEMINI_API_KEY environment variable not set. API calls will fail if not authenticated.")
    else:
        # It's safe to call configure multiple times or lazily
        genai.configure(api_key=api_key)
    
    # Use gemini-1.5-flash as requested
    return genai.GenerativeModel('gemini-2.5-flash')

def _clean_json_output(text: str) -> str:
    """Removes markdown wrappers or spurious characters from LLM JSON output."""
    text = text.strip()
    
    # Attempt to remove backticks and 'json' designator
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
        
    if text.endswith("```"):
        text = text[:-3]
        
    return text.strip()

def extract_structured_sections(text: str) -> dict:
    """
    Extracts structured sections from raw proposal text using Gemini 1.5 Flash.
    Input text is truncated to ~15,000 characters to stay well within limits context.
    
    Returns a dictionary matching the expected schema or an error schema.
    """
    if not text:
        return {"error": "No text provided"}

    # Limit to first 15,000 characters as requested
    truncated_text = text[:15000]

    prompt = """
You are an expert R&D proposal analyzer. Your task is to extract specific sections from the following proposal text.

Extract the following sections:
1. objectives
2. methodology
3. budget_summary
4. timeline
5. risk_factors

RULES:
- ONLY output valid JSON.
- DO NOT wrap the JSON in markdown code blocks (e.g. no ```json or ```).
- DO NOT format the output in any way other than JSON.
- DO NOT provide explanations, introductions, or conclusions.
- If a section is not found or is ambiguous, use "Not Found" as the value.
- "risk_factors" MUST be a strictly JSON list of strings (e.g. ["Risk A", "Risk B"]).
- Other fields must be strings.

REQUIRED SCHEMA (example):
{
  "objectives": "The main objective is to...",
  "methodology": "We will use a mixed-methods approach...",
  "budget_summary": "Total requested budget is $50,000...",
  "timeline": "Phase 1: Q1, Phase 2: Q2-Q3...",
  "risk_factors": ["Technical delay", "Recruitment issues"]
}

PROPOSAL TEXT:
\"\"\"
""" + truncated_text + "\n\"\"\"\n\nSTRICT JSON OUTPUT ONLY:"

    try:
        model = get_gemini_model()
        response = model.generate_content(prompt)
        
        raw_output = response.text
        cleaned_output = _clean_json_output(raw_output)
        
        # Parse output as JSON safely
        parsed_json = json.loads(cleaned_output)
        
        # Validate and normalize
        expected_keys = {"objectives", "methodology", "budget_summary", "timeline", "risk_factors"}
        for key in expected_keys:
            if key not in parsed_json:
                parsed_json[key] = "Not Found"
                
        if not isinstance(parsed_json.get("risk_factors"), list):
            parsed_json["risk_factors"] = [str(parsed_json.get("risk_factors", "Not Found"))]
            
        return parsed_json

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON from LLM: {e}")
        return {
            "error": "Invalid JSON returned",
            "raw_output": raw_output if 'raw_output' in locals() else "No output",
            "details": str(e)
        }
    except Exception as e:
        logger.error(f"LLM extraction failed: {e}")
        return {
            "error": "Extraction failed due to an internal error or API failure",
            "details": str(e)
        }
