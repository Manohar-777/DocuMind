from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent

from app.config import settings
from app.tools import TOOLS, set_context

_model = ChatGoogleGenerativeAI(
    model=settings.chat_model,
    google_api_key=settings.google_api_key,
    temperature=0.2,
)

SYSTEM = (
    "You are DocuMind, a document-intelligence assistant. "
    "Use the tools to inspect the uploaded document before answering. "
    "For broad requests use 'summarize'; for specific facts use 'search_document'; "
    "for structured data use 'extract_fields'. "
    "Always answer in the SAME language the user asked in (Telugu or English). "
    "Be concise and cite what you found."
)

# create_react_agent gives us a ready tool-calling loop (plan -> call tool -> observe -> repeat)
agent = create_react_agent(_model, TOOLS, prompt=SYSTEM)


async def run_agent(db, document_id: int, full_text: str, question: str) -> str:
    set_context(db, document_id, full_text)      # make tools aware of the current doc
    result = await agent.ainvoke({"messages": [("user", question)]})
    return result["messages"][-1].content
