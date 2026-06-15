from sqlalchemy.ext.asyncio import AsyncSession

from app.embeddings import embed_texts
from app.models import Chunk, Document
from app.ocr import extract_text


def _chunk(text: str, size: int = 1000, overlap: int = 150) -> list[str]:
    """Simple sliding-window chunker."""
    words = text.split()
    chunks, start = [], 0
    while start < len(words):
        end = start + size
        chunks.append(" ".join(words[start:end]))
        start = end - overlap
    return [c for c in chunks if c.strip()]


async def ingest_file(db: AsyncSession, filename: str, data: bytes) -> Document:
    text = extract_text(filename, data)
    if not text:
        raise ValueError("No text could be extracted from this file.")

    doc = Document(filename=filename)
    db.add(doc)
    await db.flush()                              # get doc.id

    pieces = _chunk(text)
    vectors = embed_texts(pieces)
    for content, vec in zip(pieces, vectors):
        db.add(Chunk(document_id=doc.id, content=content, embedding=vec))

    await db.commit()
    await db.refresh(doc)
    return doc
