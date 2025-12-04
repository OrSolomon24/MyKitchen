# ai_client.py
from langchain_google_genai import ChatGoogleGenerativeAI

from config import GEMINI_API_KEY, GEMINI_MODEL_NAME

# Single, reusable Gemini client (DRY)
model = ChatGoogleGenerativeAI(
    model=GEMINI_MODEL_NAME,
    google_api_key=GEMINI_API_KEY,
    temperature=0.1,
)


def invoke_gemini(prompt: str) -> str:
    """
    Send a prompt to Gemini and return the raw text output.
    """
    resp = model.invoke(prompt)
    content = resp.content

    if isinstance(content, list):
        text = "".join(getattr(block, "text", str(block)) for block in content)
    else:
        text = str(content)

    return text
