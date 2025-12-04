# config.py
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env from current directory

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY environment variable is required")

# You already verified this model works in test_gemini.py
GEMINI_MODEL_NAME = "gemini-2.5-flash"
