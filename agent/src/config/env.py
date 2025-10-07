import os

from dotenv import load_dotenv

load_dotenv()


LOGGING_LEVEL = os.getenv("LOGGING_LEVEL", "info")

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:3000")

OPENROUTER_MODELS_LIST = os.getenv(
    "OPENROUTER_MODELS_LIST",
    "openai/gpt-4.1,anthropic/claude-3-haiku",
)
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_ENDPOINT = os.getenv("OPENROUTER_ENDPOINT", "https://openrouter.ai/api/v1")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL_NAME = os.getenv("OPENAI_MODEL_NAME", "gpt-4.1-2025-04-14")

AGENT_MODEL_TEMPERATURE = float(os.getenv("AGENT_MODEL_TEMPERATURE", "0.3"))
AGENT_EMBEDDING_THRESHOLD = float(os.getenv("AGENT_EMBEDDING_THRESHOLD", "0.75"))

COLORLOG_AVAILABLE = os.getenv("COLORLOG_AVAILABLE", "true").lower() in (
    "true",
    "1",
    "yes",
)

ENABLE_GOOGLE_SHEETS = os.getenv("ENABLE_GOOGLE_SHEETS", "false").lower() in (
    "true",
    "1",
    "yes",
)
GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID", "")
