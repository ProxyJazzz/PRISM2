"""
Scoring Engine — uses the .pkl model to generate analytical scores.

The model predicts an overall quality score, which is then decomposed
into component scores (novelty, methodology, feasibility, completeness, budget)
using the feature vector and model prediction as anchoring signals.
"""

import logging
import numpy as np
from typing import Dict, Any, List

from services.model_loader import get_model

logger = logging.getLogger(__name__)


def predict_score(features: List[float]) -> Dict[str, Any]:
    """
    Run inference on the feature vector and return raw prediction + confidence.
    """
    model = get_model()
    X = np.array([features])

    prediction = float(model.predict(X)[0])
    prediction = max(0.0, min(prediction, 100.0))

    # Confidence from tree variance (RandomForest)
    try:
        tree_predictions = np.array([t.predict(X)[0] for t in model.estimators_])
        std = float(np.std(tree_predictions))
        confidence = round(max(0.0, 1.0 - (std / 50.0)), 3)
    except Exception:
        confidence = 0.8

    return {
        "score": round(prediction, 2),
        "confidence": confidence,
    }


def compute_detailed_scores(features: List[float], raw_prediction: float) -> Dict[str, Any]:
    """
    Decompose the overall score into analytical component scores.

    The component scores are derived from:
      - The feature values themselves (direct signals)
      - The model prediction (anchoring overall quality)

    Feature mapping:
      [0] word_count        → completeness
      [1] methodology_density → methodology
      [2] budget_indicator   → budget
      [3] technical_term_count → feasibility
      [4] novelty_indicator  → novelty
    """
    f_word = features[0]
    f_methodology = features[1]
    f_budget = features[2]
    f_technical = features[3]
    f_novelty = features[4]

    # Anchor each component around the model's overall prediction
    anchor = raw_prediction

    def _component(feature_value: float, weight: float = 0.4) -> int:
        """Blend feature signal with anchor score."""
        raw = (weight * feature_value * 100) + ((1 - weight) * anchor)
        return int(max(0, min(100, round(raw))))

    novelty = _component(f_novelty, weight=0.5)
    methodology = _component(f_methodology * 4, weight=0.45)  # density is small, scale up
    feasibility = _component(f_technical, weight=0.4)
    completeness = _component(f_word, weight=0.35)
    budget = _component(f_budget, weight=0.5)

    scores = {
        "novelty": novelty,
        "methodology": methodology,
        "feasibility": feasibility,
        "completeness": completeness,
        "budget": budget,
    }

    overall = round(raw_prediction, 1)

    return {
        "scores": scores,
        "overall_score": overall,
    }
