"""
Feature Engineering — converts raw proposal text into a numerical feature vector
compatible with the .pkl model.

Feature vector (5 elements):
  [0] word_count        — normalized word count (/ 5000, capped 1.0)
  [1] methodology_density — ratio of methodology keywords to total words
  [2] budget_indicator   — 1.0 if budget-related language detected, else 0.0
  [3] technical_term_count — normalized technical term count (/ 100, capped 1.0)
  [4] novelty_indicator  — 1.0 - max_similarity (passed externally; defaults 1.0)
"""

import re
import logging
from typing import List

logger = logging.getLogger(__name__)

METHODOLOGY_KEYWORDS = [
    "methodology", "method", "approach", "framework", "experiment",
    "evaluation", "analysis", "model", "algorithm", "data collection",
    "sampling", "hypothesis", "procedure", "protocol", "simulation",
    "survey", "regression", "classification", "quantitative", "qualitative",
]

BUDGET_KEYWORDS = [
    "budget", "cost", "funding", "expenditure", "financial",
    "allocation", "grant", "investment", "$", "usd", "inr", "eur",
]

TECHNICAL_TERMS = [
    "neural network", "deep learning", "machine learning", "optimization",
    "convolutional", "transformer", "embedding", "gradient", "inference",
    "supervised", "unsupervised", "reinforcement", "generative", "adversarial",
    "recurrent", "attention", "encoder", "decoder", "tokenization",
    "backpropagation", "regularization", "hyperparameter", "epoch",
    "precision", "recall", "f1-score", "accuracy", "latency",
    "throughput", "scalability", "distributed", "parallel", "cluster",
    "api", "microservice", "containerization", "docker", "kubernetes",
    "blockchain", "cryptography", "encryption", "authentication",
    "database", "indexing", "query", "sql", "nosql",
    "sensor", "iot", "actuator", "robotics", "autonomous",
    "spectroscopy", "chromatography", "pcr", "sequencing", "genome",
    "clinical trial", "biomarker", "pharmacokinetics", "in vitro",
    "finite element", "cfd", "simulation", "stochastic", "bayesian",
    "regression", "correlation", "variance", "statistical significance",
    "algorithm", "heuristic", "metaheuristic", "genetic algorithm",
]


def extract_features(text: str, max_similarity: float = 0.0) -> List[float]:
    """
    Convert proposal text into a 5-element feature vector.

    Args:
        text: cleaned proposal text
        max_similarity: highest cosine similarity with existing proposals (0-1)

    Returns:
        List of 5 floats ready for model.predict()
    """
    if not text:
        return [0.0, 0.0, 0.0, 0.0, 1.0]

    words = text.split()
    word_count = len(words)
    text_lower = text.lower()

    # Feature 0 — normalized word count
    f_word_count = min(word_count / 5000.0, 1.0)

    # Feature 1 — methodology keyword density
    methodology_hits = sum(
        1 for kw in METHODOLOGY_KEYWORDS if kw in text_lower
    )
    f_methodology_density = methodology_hits / max(word_count, 1) if word_count else 0.0
    # Scale to a meaningful range (typical density < 0.01, boost by 10x for model)
    f_methodology_density = min(f_methodology_density * 10.0, 0.25)

    # Feature 2 — budget indicator
    f_budget_indicator = 1.0 if any(kw in text_lower for kw in BUDGET_KEYWORDS) else 0.0

    # Feature 3 — technical term count (normalized)
    tech_hits = sum(1 for term in TECHNICAL_TERMS if term in text_lower)
    f_technical_term_count = min(tech_hits / 100.0, 1.0)

    # Feature 4 — novelty indicator
    f_novelty_indicator = round(1.0 - max_similarity, 4)

    features = [
        round(f_word_count, 4),
        round(f_methodology_density, 4),
        round(f_budget_indicator, 4),
        round(f_technical_term_count, 4),
        round(f_novelty_indicator, 4),
    ]

    logger.info(f"Extracted features: {features}")
    return features
