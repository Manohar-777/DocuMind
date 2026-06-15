from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.config import settings

_embedder = GoogleGenerativeAIEmbeddings(
    model=settings.embed_model,
    google_api_key=settings.google_api_key,
)


def embed_texts(texts: list[str]) -> list[list[float]]:
    return _embedder.embed_documents(texts)


def embed_query(text: str) -> list[float]:
    return _embedder.embed_query(text)
