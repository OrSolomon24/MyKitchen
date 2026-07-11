# ai_client.py
import warnings

from langchain_openai import ChatOpenAI

from config import OPEN_ROUTER_API_KEY, OPENROUTER_BASE_URL, OPENROUTER_MODEL_NAME
from schemas import RecipeExtraction

# We only ever call .invoke() (never .stream()), so this warning doesn't apply.
warnings.filterwarnings(
    "ignore",
    message="Streaming with Pydantic response_format not yet supported.",
    category=UserWarning,
)

# Single, reusable OpenRouter client (DRY)
model = ChatOpenAI(
    model=OPENROUTER_MODEL_NAME,
    api_key=OPEN_ROUTER_API_KEY,
    base_url=OPENROUTER_BASE_URL,
    temperature=0.1,
    timeout=30,
)

# Native structured-output mode (response_format) enforces the RecipeExtraction
# schema instead of relying on the model to format raw JSON correctly.
# (method="function_calling" was tried first but this model doesn't reliably
# emit tool calls via OpenRouter, silently returning None.)
structured_model = model.with_structured_output(RecipeExtraction, method="json_schema")


def invoke_model(prompt: str) -> RecipeExtraction:
    """
    Send a prompt to the model and return a validated RecipeExtraction.
    """
    return structured_model.invoke(prompt)
