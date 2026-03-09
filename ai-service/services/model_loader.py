"""
Model Loader — loads the .pkl model once at startup and provides global access.
"""

import os
import pickle
import logging
from typing import Any

logger = logging.getLogger(__name__)

_model: Any = None

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "proposal_model.pkl")


def load_model(path: str | None = None) -> None:
    """Load the pickle model into memory. Called once at application startup."""
    global _model
    target = path or MODEL_PATH
    target = os.path.abspath(target)

    if not os.path.isfile(target):
        raise FileNotFoundError(f"Model file not found at {target}")

    with open(target, "rb") as f:
        _model = pickle.load(f)

    logger.info(f"PKL model loaded from {target}")


def get_model() -> Any:
    """Return the loaded model. Raises if not yet loaded."""
    if _model is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")
    return _model
