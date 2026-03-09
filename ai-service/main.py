from fastapi import FastAPI, UploadFile, File, HTTPException
from contextlib import asynccontextmanager
import time
import logging
from typing import Dict, Any
from dotenv import load_dotenv
from pydantic import BaseModel

from extraction import extract_text_from_pdf, clean_text, get_page_count
from llm_service import extract_structured_sections, get_gemini_model
from embedding_service import generate_embedding, build_embedding_input
from utils.hash_service import compute_document_hash
from db_service import find_similar_proposals, store_proposal, check_duplicate_hash
from scoring_engine import compute_scores
from explanation_service import generate_evaluation_summary
from validation_service import validate_document_type
from evaluation_engine import compute_proposal_index
from document_classifier import classify_document_type

# New Phase-2 PKL model imports
from services.model_loader import load_model
from routes.analyze import router as analyze_router

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the .pkl model once at startup."""
    logger.info("Loading PKL scoring model...")
    load_model()
    logger.info("PKL model ready.")
    yield


app = FastAPI(
    title="PRISM — AI Proposal Scoring Engine",
    description="AI-powered proposal evaluation with PKL model inference",
    version="2.0.0",
    lifespan=lifespan,
)

# Register the new /analyze-proposal endpoint
app.include_router(analyze_router)

@app.post("/analyze", response_model=Dict[str, Any])
async def analyze_proposal(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Analyzes an uploaded PDF proposal file by deterministically extracting and cleaning its text.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")
    
    start_time = time.time()
    file_path = f"temp_{file.filename}"
    
    try:
        # Save file temporarily
        with open(file_path, "wb") as f:
            f.write(await file.read())
            
        print(f"File {file.filename} saved to {file_path}")
        
        # 1. Get Page Count
        num_pages = get_page_count(file_path)
            
        # 2. Extract Text Deteministically
        raw_text = extract_text_from_pdf(file_path)
        
        # 3. Clean the text
        cleanstr = clean_text(raw_text)
        
        # 3.5 Exact duplicate check before expensive operations
        document_hash = compute_document_hash(cleanstr)
        duplicate_result = check_duplicate_hash(document_hash)
        
        if duplicate_result:
            return {
                "duplicate_detected": True,
                "existing_proposal_id": duplicate_result[0],
                "existing_file": duplicate_result[1],
                "message": "This document already exists in the database."
            }
        
        # Phase 4.6 Document Classification
        document_classification = classify_document_type(cleanstr)
        doc_type = document_classification.get("document_type")
        
        # Init base variables
        structured_data = {}
        similar_proposals = []
        evaluation_scores = None
        evaluation_summary = None
        proposal_evaluation = None
        current_id = None
        validation_result = None
        
        if doc_type in ["Research Proposal", "Research Paper", "Technical Report"]:
            # 4. Extract structured sections via LLM
            structured_data = extract_structured_sections(cleanstr)
            
            # 5. Extract specific sections to generate an embedding for similarity
            objectives = structured_data.get("objectives", "")
            methodology = structured_data.get("methodology", "")
            
            embedding_input = build_embedding_input(
                objectives=objectives,
                methodology=methodology,
                raw_text=cleanstr
            )
            
            if embedding_input:
                new_embedding = generate_embedding(embedding_input)
                
                # Compute top-5 similarity from PostgreSQL DB before inserting
                similar_proposals = find_similar_proposals(new_embedding, limit=5)
                
                # Phase 4.5 Document Validation Layer
                validation_result = validate_document_type(raw_text, structured_data)

                # 7. Hybrid Scoring & Explainability Layer (Only for Research Proposals)
                if validation_result.get("validation_passed") is True and doc_type == "Research Proposal":
                    evaluation_scores = compute_scores(structured_data, similar_proposals)
                    proposal_evaluation = compute_proposal_index(evaluation_scores)
                    evaluation_summary = generate_evaluation_summary(evaluation_scores, proposal_evaluation)

                # Persist proposal using database
                current_id = store_proposal(
                    file_name=file.filename,
                    pages=num_pages,
                    text_length=len(cleanstr),
                    structured_data=structured_data,
                    raw_text=raw_text,
                    embedding=new_embedding,
                    document_hash=document_hash
                )
        
        # Calculate processing time
        processing_timems = (time.time() - start_time) * 1000
        
        response = {
            "status": "processed",
            "file_name": file.filename,
            "proposal_id": current_id,
            "pages": num_pages,
            "text_length": len(cleanstr),
            "document_classification": document_classification,
            "structured_data": structured_data,
            "similar_proposals": similar_proposals,
            "validation_result": validation_result,
            "evaluation_scores": evaluation_scores,
            "proposal_evaluation": proposal_evaluation,
            "evaluation_summary": evaluation_summary,
            "preview": cleanstr[:300] if cleanstr else "",
            "processing_time_ms": round(float(processing_timems), 2)
        }
        
        if doc_type != "Research Proposal":
            response["message"] = f"Document classified as {doc_type}. Proposal scoring skipped."
        elif isinstance(validation_result, dict) and not validation_result.get("validation_passed", True):
             response["message"] = "Document does not meet research proposal criteria."
             
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temporary file locally
        import os
        if os.path.exists(file_path):
            os.remove(file_path)

class ChatRequest(BaseModel):
    message: str
    context: str

class MetricExplanationRequest(BaseModel):
    metric: str
    score: float
    context: str

@app.post("/chat")
async def chat_with_proposal(request: ChatRequest):
    """
    Handles chat interaction for a specific proposal.
    """
    try:
        model = get_gemini_model()
        prompt = f"You are a helpful AI assistant explaining an R&D proposal to a user.\n\nProposal Context:\n{request.context}\n\nUser Question:\n{request.message}\n\nAnswer the user's question clearly and concisely based on the proposal context."
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/metric-explanation")
async def get_metric_explanation(request: MetricExplanationRequest):
    """
    Generates a detailed metric-level explanation.
    """
    try:
        model = get_gemini_model()
        prompt = f"""
You are an expert AI proposal reviewer. Given the following proposal context, explain why the proposal received a score of {request.score}% for the '{request.metric}' metric.

Proposal Context:
{request.context}

Identify exactly what elements reduced the score (weaknesses) and provide concrete suggestions for what improvements could increase it.

Maintain a formal institutional tone.
RETURN STRICTLY VALID JSON ONLY, with NO markdown code blocks.
Use the exact schema:
{{
  "metric": "{request.metric}",
  "score": {request.score},
  "explanation": "A detailed 2-3 sentence explanation here...",
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": ["improvement 1", "improvement 2"]
}}
"""
        response = model.generate_content(prompt)
        import json
        raw = response.text.strip()
        if raw.startswith("```json"):
            raw = raw[7:]
        if raw.startswith("```"):
            raw = raw[3:]
        if raw.endswith("```"):
            raw = raw[:-3]
        return json.loads(raw.strip())
    except Exception as e:
        logger.error(f"Metric explanation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
