from typing import List, Dict, Any

def compute_scores(structured_data: Dict[str, Any], similar_proposals: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes deterministic evaluation signals based on extracted proposal data and similar historical proposals.
    """
    
    # 1. Novelty Score
    max_similarity = 0.0
    if similar_proposals:
        max_similarity = max(p.get("similarity", 0.0) for p in similar_proposals)
    novelty_score = round(1.0 - max_similarity, 3)
    
    # 2. Redundancy Flag
    redundancy_flag = bool(max_similarity > 0.90)
    
    # 3. Risk Density Score
    risk_factors = structured_data.get("risk_factors", [])
    if risk_factors == "Not Found" or not isinstance(risk_factors, list):
        risk_score = 0.0
    else:
        # Check against "Not Found" string if it ended up in a list
        if len(risk_factors) == 1 and risk_factors[0] == "Not Found":
            risk_score = 0.0
        else:
            risk_score = round(min(len(risk_factors) / 10.0, 1.0), 3)
            
    # 4. Methodology Completeness Score
    methodology = structured_data.get("methodology", "Not Found")
    if methodology == "Not Found":
        methodology_score = 0.0
    else:
        words = methodology.split()
        length_factor = min(len(words) / 500.0, 1.0)
        
        keywords = ["analysis", "evaluation", "experiment", "model", "data"]
        methodology_lower = methodology.lower()
        keyword_count = sum(1 for kw in keywords if kw in methodology_lower)
        keyword_factor = min(keyword_count / len(keywords), 1.0)
        
        methodology_score = round((0.6 * length_factor) + (0.4 * keyword_factor), 3)
        
    # 5. Feasibility Score
    budget_summary = structured_data.get("budget_summary", "Not Found")
    timeline = structured_data.get("timeline", "Not Found")
    
    budget_flag = 1.0 if budget_summary != "Not Found" else 0.0
    timeline_flag = 1.0 if timeline != "Not Found" else 0.0
    
    feasibility_score = round((budget_flag + timeline_flag) / 2.0, 3)
    
    # 6. Completeness Score
    present_count = 0
    if structured_data.get("objectives", "Not Found") != "Not Found": present_count += 1
    if methodology != "Not Found": present_count += 1
    if budget_flag > 0: present_count += 1
    if timeline_flag > 0: present_count += 1
    
    completeness_score = round(present_count / 4.0, 3)
    
    return {
        "novelty_score": novelty_score,
        "redundancy_flag": redundancy_flag,
        "risk_density_score": risk_score,
        "methodology_score": methodology_score,
        "feasibility_score": feasibility_score,
        "completeness_score": completeness_score,
        "highest_similarity": max_similarity
    }
