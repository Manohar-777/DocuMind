# DocuMind 🧠📄

**Agentic Document Intelligence Platform**

DocuMind is a production-grade AI platform that transforms documents (PDFs, scans, or photos) into searchable, interactive knowledge bases. It features a multi-step agent built using **LangGraph** and **Gemini**, capable of summarizing, extracting fields, performing semantic searches, and interacting via voice in both English and Telugu.

The frontend is styled using a custom dual-identity design system: **Neural Midnight** (a rich cyber-neon dark mode) and **Warm Sunset** (a highly readable, warm-toned high-contrast light mode).

---

## 🚀 Key Features

* **Multi-Format Processing**: Direct text extraction from standard PDFs; automatic routing to Tesseract OCR and Gemini Vision for scanned documents, handwriting, or images.
* **Telugu & English Voice Agent**: Ask questions by voice, transcribing input with Faster-Whisper, reasoning with the agent, and generating text-to-speech feedback via gTTS in Telugu or English.
* **Interactive Chat Dashboard**: Dynamic chat with quick action chips (Summarize, Extract Fields, Search), typing indicators, and message history.
* **Document Management**: Easily upload, list, and switch between active documents with real-time semantic query routing.
* **Custom Dual-Identity UI**:
  * **Neural Midnight (Dark)**: Deep navy, glowing indigo/cyan neon buttons, neural dot grid, glassmorphism cards.
  * **Warm Sunset (Light)**: Highly legible ivory cream background, high-contrast text, coral/amber/teal accents, soft warm shadows.
* **Langfuse Observability**: Fully instrumented trace logging for all agent and LLM operations.
* **API Health check**: Real-time status dot indicating backend API availability.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Lucide Icons |
| **Backend API** | FastAPI, Uvicorn |
| **Orchestration & Agent** | LangGraph, LangChain, Google Gemini API |
| **OCR & Vision** | Tesseract OCR (Telugu + English), Gemini Vision |
| **Speech / Voice** | Faster-Whisper (`small` model), gTTS |
| **Database & Search** | PostgreSQL with `pgvector` (vector embeddings) |
| **Caching / Session** | Redis |
| **Observability** | Langfuse |

---

## 📂 Project Structure

```text
documind/
├── app/                  # FastAPI Backend code
│   ├── agent.py          # LangGraph reactive agent definition
│   ├── config.py         # Configuration settings & environment parsing
│   ├── database.py       # database connection and pgvector init
│   ├── embeddings.py     # Gemini embedding integration
│   ├── ingest.py         # Document chunking and embedding pipelines
│   ├── main.py           # FastAPI application routes (CORS, upload, chat, voice)
│   ├── models.py         # SQLAlchemy models (Document, Chunk)
│   ├── ocr.py            # Intelligent Tesseract & Gemini Vision routing
│   ├── retriever.py      # Nearest-neighbor pgvector search queries
│   ├── schemas.py        # Pydantic schemas
│   ├── tools.py          # Agent tools (search, summarize, extract_fields)
│   ├── tracing.py        # Langfuse tracing client
│   └── voice.py          # Whisper speech transcription & gTTS speech generation
├── frontend-react/       # React + Vite frontend application
│   ├── src/
│   │   ├── components/   # ChatPanel, DocumentList, MessageBubble, SettingsPanel, UploadZone
│   │   ├── App.jsx       # Main App container driving theme states, settings, and layout
│   │   ├── index.css     # CSS variable tokens and theme identities
│   │   └── api.js        # API client requests for upload, chat, and voice
│   └── vite.config.js    # Vite config
├── Dockerfile            # Container definition
├── docker-compose.yml    # Database & Redis dependency definitions
├── requirements.txt      # Python dependencies
└── README.md             # Project documentation
```

---

## 🔧 Installation & Setup

### Prerequisites

Ensure you have the following installed:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for PostgreSQL + Redis)
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Python 3.11](https://www.python.org/downloads/)
* Tesseract OCR installed on your system (if running local backend bare-metal). For Windows: Install Tesseract and ensure the executable path is added to your System PATH variables.

---

### Step 1: Set Up Backend Services (Docker)

Spin up the pgvector database and Redis services using Docker Compose:

```bash
docker-compose up -d
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root `documind/` directory matching `.env.example`:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
DATABASE_URL=postgresql+asyncpg://documind:documind@localhost:5432/documind
REDIS_URL=redis://localhost:6379/0

# Optional Langfuse tracing config
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_HOST=https://cloud.langfuse.com

# Defaults
CHAT_MODEL=gemini-1.5-flash
EMBED_MODEL=models/embedding-001
EMBED_DIM=768
```

### Step 3: Run the FastAPI Backend

1. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows PowerShell:
   .venv\Scripts\Activate.ps1
   # macOS/Linux:
   source .venv/bin/activate
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the dev server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

The API will be running at `http://localhost:8000`. You can inspect the Swagger docs at `http://localhost:8000/docs`.

---

### Step 4: Run the React Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend-react
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The application UI will be available at `http://localhost:5173`.

---

## 🎨 Dual-Identity Custom CSS Variables

The styles are powered by Tailwind CSS classes and root CSS custom variables located in `frontend-react/src/index.css`. The toggle class `theme-dark` or `theme-light` changes custom variable sets for:
* `--bg-main` / `--bg-card`
* `--text-primary` / `--text-secondary`
* `--border-primary`
* `--accent-primary` / `--accent-secondary`
* `--grid-dot` / `--separator-grad`

This ensures that the Light Mode isn't just inverted colors, but rather a completely stylized **Warm Sunset** design with soft shadows and organic colors.
