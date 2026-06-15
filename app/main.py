from fastapi import Depends, FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.agent import run_agent
from app.database import get_db, init_db
from app.ingest import ingest_file
from app.models import Chunk, Document
from app.schemas import ChatRequest, ChatResponse, DocumentInfo, UploadResponse
from app.voice import speak, transcribe

app = FastAPI(title="DocuMind", description="Agentic Document Intelligence Platform")

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def _startup():
    await init_db()


@app.post("/upload", response_model=UploadResponse)
async def upload(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    data = await file.read()
    doc = await ingest_file(db, file.filename, data)
    return UploadResponse(document_id=doc.id, filename=doc.filename)


@app.get("/documents", response_model=list[DocumentInfo])
async def list_documents(db: AsyncSession = Depends(get_db)):
    """List all uploaded documents."""
    rows = await db.execute(
        select(Document).order_by(Document.created_at.desc())
    )
    docs = rows.scalars().all()
    return [
        DocumentInfo(
            id=d.id,
            filename=d.filename,
            created_at=d.created_at.isoformat() if d.created_at else "",
        )
        for d in docs
    ]


async def _full_text(db: AsyncSession, document_id: int) -> str:
    rows = await db.execute(select(Chunk.content).where(Chunk.document_id == document_id))
    return "\n".join(r[0] for r in rows.all())


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    full_text = await _full_text(db, req.document_id)
    # If user explicitly chose a language, prepend instruction
    lang_hint = ""
    if req.language == "te":
        lang_hint = "[Respond in Telugu] "
    elif req.language == "en":
        lang_hint = "[Respond in English] "
    answer = await run_agent(db, req.document_id, full_text, lang_hint + req.question)
    return ChatResponse(answer=answer)


@app.post("/voice")
async def voice(
    document_id: int = Form(...),
    audio: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    # save the uploaded audio
    tmp = f"audio_out/in_{audio.filename}"
    with open(tmp, "wb") as f:
        f.write(await audio.read())

    question, lang = transcribe(tmp)
    full_text = await _full_text(db, document_id)
    answer = await run_agent(db, document_id, full_text, question)
    mp3 = speak(answer, lang=lang)
    return FileResponse(mp3, media_type="audio/mpeg")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "DocuMind"}
