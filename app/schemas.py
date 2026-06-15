from pydantic import BaseModel


class UploadResponse(BaseModel):
    document_id: int
    filename: str


class ChatRequest(BaseModel):
    document_id: int
    question: str
    language: str = "auto"  # "auto", "en", "te"


class ChatResponse(BaseModel):
    answer: str


class DocumentInfo(BaseModel):
    id: int
    filename: str
    created_at: str
