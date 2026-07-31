# config.py
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env from current directory

OPEN_ROUTER_API_KEY = os.environ.get("OPEN_ROUTER_API_KEY")
if not OPEN_ROUTER_API_KEY:
    raise RuntimeError("OPEN_ROUTER_API_KEY environment variable is required")

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# Free-tier model on OpenRouter (no Gemini free tier is currently offered there).
# Chosen because it's one of the few free models supporting native structured
# outputs and tool calling (needed for reliable JSON + future web-fetch tools).
# Previously "tencent/hy3:free", which OpenRouter discontinued (free slug now
# 404s, only the paid "tencent/hy3" remains).
OPENROUTER_MODEL_NAME = "google/gemma-4-26b-a4b-it:free"
