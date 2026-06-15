from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.embeddings import embed_query
from app.models import Chunk


async def search(db: AsyncSession, document_id: int, query: str, k: int = 4) -> list[str]:
    """Cosine-distance nearest-neighbour search in Postgres."""
    qvec = embed_query(query)
    stmt = (
        select(Chunk.content)
        .where(Chunk.document_id == document_id)
        .order_by(Chunk.embedding.cosine_distance(qvec))   # pgvector operator
        .limit(k)
    )
    rows = await db.execute(stmt)
    return [r[0] for r in rows.all()]
