# R&D Proposal Screening System - AI Service

## Overview
This service is the core Artificial Intelligence engine of the R&D Proposal Screening System. Designed to stream-line and enhance the review process, it is built on FastAPI and orchestrates the entire end-to-end pipeline: from ingesting PDF proposals to extracting data, computing semantic similarities, scoring the proposal, and generating a professional summary.

## Architecture & Layers

The system's modular architecture is divided into distinct execution layers, orchestrated in sequence:

### 1. API & Orchestration Layer (`main.py`)
- **Purpose**: Acts as the central entry point and controller of the application.
- **Details**: Built with FastAPI. It exposes the primary `/analyze` endpoint which accepts file uploads, calls the respective service functions, manages temporary local storage, and compiles the final structured JSON response indicating processing time, evaluation scores, and summaries.

### 2. Document Processing & Extraction Layer (`extraction.py`)
- **Purpose**: Handles the initial deterministic text processing of physical documents.
- **Details**: Uses `PyMuPDF` to reliably extract text content and page counts from uploaded PDF files. Once extracted, the text is passed through a cleaning function to strip irregular formatting, preparing it for downstream AI analysis.

### 3. LLM Structuring Layer (`llm_service.py`)
- **Purpose**: Extracts targeted, granular information from unstructured text.
- **Details**: Integrates with the Google Gemini API (`google-generativeai`). It uses structured prompting to parse out specific sections (like Objectives, Methodology, Expected Outcomes) into a structured JSON/dictionary format.

### 4. Embedding Generation Layer (`embedding_service.py`)
- **Purpose**: Creates semantic representations of the actual project goals.
- **Details**: Uses `sentence-transformers` locally to generate dense vector embeddings from key proposal segments (primarily combining "Objectives" and "Methodology"). These vectors serve as the foundation for the similarity engine.

### 5. Database & Similarity Search Layer (`db_service.py`, `database.py`)
- **Purpose**: Persists historical proposal data and identifies redundant research.
- **Details**: Connects to a PostgreSQL instance enhanced with the `pgvector` extension. 
   - `find_similar_proposals()` runs semantic vector similarity searches to identify the top 5 most related historical projects. 
   - `store_proposal()` stores the raw text, the LLM-structured sections, metadata, and the newly generated vector embeddings for future comparisons.

### 6. Document Validation Layer (`validation_service.py`)
- **Purpose**: Protects the system from evaluating garbage data or irrelevant documents.
- **Details**: Acts as an early-stage gatekeeper. It evaluates the raw text and structured data to verify that the uploaded document is genuinely a research proposal before passing it to the resource-intensive scoring operations.

### 7. Hybrid Scoring Layer (`scoring_engine.py`)
- **Purpose**: Quantitatively evaluates the proposal on key R&D metrics.
- **Details**: Computes deterministic and heuristic scores across critical dimensions such as:
   - **Novelty / Redundancy**: Assessed based on results returned from the database similarity search.
   - **Methodology Completeness & Risk Density**: Assessed from structural properties and content analysis.
   - **Feasibility**: Provides a grounded, rule-based approach to judging the project's viability.

### 8. Explainability Layer (`explanation_service.py`)
- **Purpose**: Bridges the gap between raw numeric scores and human reviewers.
- **Details**: Sends the discrete metrics calculated by the `scoring_engine.py` to the LLM to generate a concise, highly professional evaluation summary. The explanation is strictly constrained to the computed scores, ensuring the AI output is grounded, explainable, and trustworthy.

## Technology Stack Highlight
- **Routing**: `fastapi`, `uvicorn`, `python-multipart`
- **PDF Ingestion**: `pymupdf`
- **Generative AI (LLM)**: `google-generativeai`
- **Vector Embeddings**: `sentence-transformers`
- **Database Backend**: PostgreSQL + `pgvector` via `psycopg2-binary`
- **Utilities**: `scikit-learn`, `python-dotenv`

## API Integration & Backend Connectivity

To integrate this AI service with your primary backend application (e.g., Node.js, Django, Next.js), you can communicate over HTTP using its REST endpoints.

### 1. Running the API Server

Start the FastAPI server locally from the `ai-service` directory:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*(The API will be available at `http://localhost:8000` and interactive API docs at `http://localhost:8000/docs`)*

### 2. Available Endpoint

#### `POST /analyze`
The core endpoint that orchestrates the entire pipeline: text extraction, LLM structuring, vector embedding generation, DB similarity checking, deterministic scoring, and final LLM evaluation.

**Request Format:** `multipart/form-data`
- `file`: The PDF document you want to analyze.

**Example Integration using Node.js / Express (Axios):**
```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function analyzeProposal(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post('http://localhost:8000/analyze', form, {
      headers: {
        ...form.getHeaders()
      }
    });
    // Contains scoring, structured data, and classification logic
    console.log("Analysis Result:", response.data); 
    return response.data;
  } catch (error) {
    console.error("AI Service Error:", error.message);
  }
}
```

**Example Integration using Python (Requests):**
```python
import requests

url = "http://localhost:8000/analyze"
with open("proposal.pdf", "rb") as f:
    response = requests.post(url, files={"file": f})
    
print("Result:", response.json())
```

**Example using cURL (Terminal):**
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@proposal.pdf"
```

### 3. Response Structure
A successful call returns a comprehensive JSON object tailored for your main backend, containing:
- `status`: Processing status (e.g., "processed")
- `proposal_id`: Internal Database ID for the proposal.
- `document_classification`: Object tracking document type and properties.
- `evaluation_scores`: Breakdown of deterministic dimensional scores (Novelty, Risk, Feasibility).
- `proposal_evaluation`: A single aggregated Proposal Evaluation Index (PEI) score.
- `evaluation_summary`: LLM-generated concise review summarizing and justifying the scores.
- `similar_proposals`: Top 5 semantically similar historical projects retrieved from the DB vector search.
- `duplicate_detected`: Boolean indicator to quickly bypass analysis if exact hash match is found.