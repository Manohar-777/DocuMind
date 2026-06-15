import google.generativeai as genai
from langchain_core.tools import tool

from app.config import settings
from app.retriever import search

genai.configure(api_key=settings.google_api_key)
_llm = genai.GenerativeModel(settings.chat_model)

# request-scoped context the tools need (set per /chat call)
_ctx: dict = {"db": None, "document_id": None, "full_text": ""}


def set_context(db, document_id, full_text):
    _ctx.update(db=db, document_id=document_id, full_text=full_text)


@tool
async def search_document(query: str) -> str:
    """Find the most relevant passages in the document for a specific question."""
    passages = await search(_ctx["db"], _ctx["document_id"], query)
    return "\n---\n".join(passages) if passages else "No relevant passage found."


@tool
def summarize() -> str:
    """Produce a concise summary of the whole document."""
    prompt = (
        "Summarize this document in 5-7 bullet points. "
        "Reply in the same language as the document.\n\n"
        f"{_ctx['full_text'][:12000]}"
    )
    return (_llm.generate_content(prompt).text or "").strip()


@tool
def extract_fields() -> str:
    """Extract key structured fields (dates, names, amounts, IDs) as JSON."""
    prompt = (
        "Extract the key fields from this document as JSON "
        "(e.g. names, dates, amounts, invoice/id numbers, totals). "
        "Only output JSON.\n\n"
        f"{_ctx['full_text'][:12000]}"
    )
    return (_llm.generate_content(prompt).text or "").strip()


TOOLS = [search_document, summarize, extract_fields]
