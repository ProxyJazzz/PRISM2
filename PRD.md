# PRD - PRISM R&D Proposal Screening System

## 1. Summary
PRISM is a multi-service system that ingests R&D proposal PDFs, runs AI-assisted evaluation, stores results, and presents dashboards for reviewers. The repository includes:
- Frontend: Vite + React app with public marketing pages and a protected dashboard.
- Backend: NestJS API with JWT auth, proposal storage, and AI service integration.
- AI Service: FastAPI microservice that performs PDF extraction, classification, embedding similarity, scoring, and explanation generation.

This PRD describes the product goals, user flows, functional requirements, data model, API contracts, and non-functional requirements based on the current codebase.

## 2. Goals
- Reduce time to assess R&D proposals by automating extraction, scoring, and summarization.
- Provide transparent, explainable metrics (novelty, methodology, feasibility, completeness) with AI-generated explanations.
- Allow reviewers to manage proposal intake, view evaluation results, and audit activity.
- Detect duplicate submissions and similar proposals to reduce redundant review effort.

## 3. Non-Goals (Current Scope)
- Multi-tenant administration, role-based access controls beyond standard user auth.
- Complex workflow approvals, assignment, or escalation.
- In-app report editing or manual score overrides.
- Payment, billing, or licensing flows.

## 4. Users and Personas
- Reviewer (Primary): Evaluates proposals, views scores, reads explanations, chats with AI assistant.
- Submission Admin (Secondary): Uploads proposals, monitors evaluation pipeline.
- System Operator (Secondary): Maintains services, monitors uptime, configures environment variables and secrets.

## 5. User Journeys
### 5.1 Registration and Login
1. User registers with institution name, admin name, email, password.
2. User logs in and receives a JWT token.
3. Token is stored and used for authenticated API requests.

### 5.2 Proposal Evaluation
1. User uploads a PDF proposal on the Evaluation page.
2. Backend forwards file to AI service for analysis.
3. AI service classifies document, checks duplicates, and calculates scores.
4. Backend stores proposal metadata and AI analysis JSON.
5. User is redirected to the proposal analysis view.

### 5.3 Proposal Analysis and Review
1. User views overall score, risk level, and AI explanation.
2. User inspects detailed score breakdown.
3. User opens metric-level explanation modal.
4. User explores similarity network of related proposals.
5. User chats with the AI assistant for Q&A.
6. User downloads a plain-text report.

### 5.4 Dashboard and Audit
1. User opens dashboard to view statistics.
2. User views evaluation activity over last 7 days.
3. User views an audit-style timeline derived from proposal events.

## 6. Functional Requirements

### 6.1 Frontend - Public Pages
- Marketing pages: Home, Architecture, Security, About, Contact.
- Auth pages: Login and Register.

### 6.2 Frontend - Dashboard
- Protected routing for all dashboard routes.
- Pages:
  - Dashboard: summary stats and evaluation activity chart.
  - Evaluation: PDF upload and processing instructions.
  - Proposals: list of proposals with status and score.
  - Proposal Analysis: detailed results and AI chat.
  - Audit Logs: timeline derived from proposal events.

### 6.3 Frontend - Proposal Upload
- Drag-and-drop or file picker for PDF files.
- Show progress states: uploading, success, error.
- Enforce PDF file type.

### 6.4 Frontend - Proposal Analysis
- Show overall score with risk label.
- Show score breakdown for novelty, methodology, feasibility, completeness.
- Show AI explanation summary.
- Show similarity network graph (force-directed).
- Download report as .txt.
- Metric-level explanation modal with weaknesses and improvements.

### 6.5 Frontend - Chat
- Chat UI with assistant and user messages.
- Send proposal-specific messages to backend.
- Show loading indicators and error fallback.

### 6.6 Backend - Authentication
- Register users with password hashing (bcrypt).
- Login users with JWT token response.
- Use JWT guard for protected proposal endpoints.

### 6.7 Backend - Proposals
- Upload endpoint to accept PDF files.
- Validate PDF type.
- Forward file to AI service for analysis.
- Store proposal data and AI analysis JSON.
- Retrieve proposal list for the current user.
- Retrieve single proposal detail for the current user.
- Provide proposal analytics (total, average score, category distribution).
- Provide report download (plain text).
- Provide metric explanation and chat endpoints via AI service.

### 6.8 AI Service - Analyze Proposal
- Accept PDF file upload.
- Extract text and page count.
- Clean text and compute hash for duplicate detection.
- Classify document type.
- Extract structured sections with LLM (Gemini).
- Generate embeddings and run similarity search in pgvector.
- Validate document as a research proposal.
- Compute scoring metrics and overall evaluation.
- Generate evaluation summary with LLM.
- Persist to AI service database (historical proposals).

### 6.9 AI Service - Chat and Metric Explanation
- Provide chat response using proposal context and user message.
- Provide metric explanation JSON with weaknesses and improvements.

## 7. API Contracts (Observed)

### 7.1 Backend API (NestJS) - Base URL: http://localhost:5000
Auth:
- POST /auth/register
  - Body: { institutionName, adminName, email, password }
  - Response: { message: "User created" }
- POST /auth/login
  - Body: { email, password }
  - Response: { token: string }

Proposals (JWT required):
- POST /proposals/upload (multipart/form-data)
  - Field: file (PDF)
  - Response: { proposalId, analysis }
- GET /proposals/my
  - Response: ProposalSummary[]
- GET /proposals/analytics
  - Response: { totalProposals, averageScore, categoryDistribution }
- GET /proposals/:id
  - Response: ProposalDetail
- POST /proposals/:id/chat
  - Body: { message }
  - Response: AI chat response
- GET /proposals/:id/report
  - Response: string (plain text)
- GET /proposals/:id/explanation/:metric?score=number
  - Response: { explanation, weaknesses, improvements }

### 7.2 AI Service API (FastAPI) - Base URL: http://localhost:8000
- POST /analyze-proposal (primary)
  - Form: file (PDF)
  - Response: analysis JSON (scores, explanation, metadata)
- POST /analyze (legacy)
  - Form: file (PDF)
  - Response: analysis JSON
- POST /chat
  - Body: { message, context }
  - Response: { response }
- POST /metric-explanation
  - Body: { metric, score, context }
  - Response: { metric, score, explanation, weaknesses, improvements }

## 8. Data Model (Backend Prisma)

### 8.1 User
- id (Int, PK)
- institutionName (String)
- adminName (String)
- email (String, unique)
- passwordHash (String)
- createdAt (DateTime)

### 8.2 Proposal
- id (Int, PK)
- userId (Int, FK -> User)
- fileName (String)
- aiProposalId (Int, nullable)
- uploadDate (DateTime)
- status (String)

### 8.3 ProposalAnalysis
- id (Int, PK)
- proposalId (Int, unique FK -> Proposal)
- finalScore (Float, nullable)
- category (String, nullable)
- evaluationSummary (String, nullable)
- analysisJson (Json)
- createdAt (DateTime)

## 9. System Architecture
- Frontend (React) communicates with Backend (NestJS) via REST.
- Backend communicates with AI Service (FastAPI) via REST.
- AI Service uses PostgreSQL + pgvector for similarity search.
- Backend uses PostgreSQL via Prisma.

## 10. Key Features and Behaviors
- Duplicate detection: if hash is detected, skip full evaluation and return duplicate info.
- Document type classification: skip scoring for non-research proposals.
- Similarity network: present top-5 similar proposals by embeddings.
- Explainability: AI returns per-metric explanations and improvement suggestions.

## 11. Non-Functional Requirements
### 11.1 Performance
- Upload + analysis should return results within an acceptable time window (target: under 60 seconds for typical PDFs).
- UI should show loading indicators for all async operations.

### 11.2 Reliability
- Backend should handle AI service downtime with clear errors.
- AI service should clean up temporary files and avoid memory leaks.

### 11.3 Security
- JWT-based authentication for all proposal endpoints.
- Passwords hashed with bcrypt.
- Secrets provided via environment variables.

### 11.4 Privacy
- Proposal text and evaluation data are stored and should be access-scoped to the owning user.
- No public access to proposal metadata.

### 11.5 Observability
- Server-side logging for AI and backend actions.
- Clear error responses for failed operations.

## 12. UI/UX Requirements
- Consistent, branded visual styling (glass panels, prism accents).
- Responsive layout for dashboard and proposal analysis.
- Accessible, readable typography and clear error messaging.
- Chat and modal interactions should be clear and low friction.

## 13. Error Handling Requirements
- PDF validation with user-friendly error messaging.
- Backend returns consistent error messages for auth failures.
- AI service errors surfaced as actionable messages in UI.

## 14. Dependencies and Integrations
- Gemini API for LLM-based extraction and explanations.
- PostgreSQL with pgvector for similarity search.
- Prisma ORM for backend database operations.
- FastAPI for AI service API.

## 15. Deployment and Environments
- Frontend: Vite dev server, build for static hosting.
- Backend: NestJS server with JWT and Prisma.
- AI Service: FastAPI running on port 8000.
- Databases: separate PostgreSQL instances for backend and AI service storage.

## 16. Acceptance Criteria
- User can register, log in, and access the dashboard.
- User can upload a PDF and receive evaluation results.
- Proposal analysis page displays overall score and metric breakdown.
- Similarity network and chat assistant are functional.
- Proposal list shows evaluated and pending status.
- Audit log view displays proposal lifecycle events.

## 17. Risks and Open Questions
- The frontend uses local token presence for route protection; server-side access control must be enforced to prevent unauthorized data access.
- Secrets management and environment configuration need hardening.
- AI service response schemas differ between /analyze and /analyze-proposal; normalization is performed in backend but should be documented.
- Define the expected scoring thresholds and category taxonomy (e.g., how category is derived).

## 18. Future Enhancements
- Role-based access (reviewer vs admin) and multi-tenant orgs.
- Manual scoring overrides and review workflows.
- PDF annotations and in-app report editing.
- Advanced audit logs with backend event storage.
- Exportable reports (PDF/CSV).
