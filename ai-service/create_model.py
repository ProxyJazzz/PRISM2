"""
Seed script to generate a trained proposal scoring model (.pkl).

This trains a RandomForestRegressor on synthetic proposal features and saves
it as a pickle file that the AI service loads at startup.

Features (5):
  0 - word_count (normalized: count / 5000, capped at 1.0)
  1 - methodology_density (ratio of methodology keywords to total words)
  2 - budget_indicator (1.0 if budget section found, else 0.0)
  3 - technical_term_count (normalized: count / 100, capped at 1.0)
  4 - novelty_indicator (1.0 - max_similarity_with_existing)

Target: overall_score (0-100)

Run once:
    cd ai-service && python create_model.py
"""

import os
import pickle
import numpy as np
from sklearn.ensemble import RandomForestRegressor

np.random.seed(42)
N = 500  # training samples

# Synthetic feature generation
word_count = np.random.uniform(0.1, 1.0, N)
methodology_density = np.random.uniform(0.0, 0.25, N)
budget_indicator = np.random.choice([0.0, 1.0], N, p=[0.3, 0.7])
technical_term_count = np.random.uniform(0.05, 1.0, N)
novelty_indicator = np.random.uniform(0.1, 1.0, N)

X = np.column_stack([
    word_count,
    methodology_density,
    budget_indicator,
    technical_term_count,
    novelty_indicator,
])

# Synthesize target with known weights + noise
y = (
    15 * word_count
    + 25 * methodology_density * 4  # scale density contribution
    + 10 * budget_indicator
    + 20 * technical_term_count
    + 30 * novelty_indicator
    + np.random.normal(0, 3, N)
)
y = np.clip(y, 0, 100)

# Train
model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
model.fit(X, y)

# Save
os.makedirs("models", exist_ok=True)
model_path = os.path.join("models", "proposal_model.pkl")
with open(model_path, "wb") as f:
    pickle.dump(model, f)

print(f"Model saved to {model_path}")
print(f"Feature importances: {model.feature_importances_}")
print(f"Sample prediction (all 0.5): {model.predict([[0.5, 0.12, 1.0, 0.5, 0.5]])[0]:.2f}")
