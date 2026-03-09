"""
/analyze-proposal route — accepts a PDF upload and returns full AI evaluation.
"""

import os
import time
from fastapi import APIRouter, UploadFile, File, HTTPException

from services.evaluation_pipeline import run_evaluation

router = APIRouter()


@router.post("/analyze-proposal")
async def analyze_proposal(file: UploadFile = File(...)):
    """
    Accepts a PDF proposal upload.
    Runs the full AI evaluation pipeline using the .pkl model.
    Returns detailed scoring and explanation.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    start_time = time.time()
    file_path = f"temp_{file.filename}"

    try:
        # Save file temporarily
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        # Run full evaluation pipeline
        result = run_evaluation(file_path)

        # Add metadata
        result["file_name"] = file.filename
        result["processing_time_ms"] = round((time.time() - start_time) * 1000, 2)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
