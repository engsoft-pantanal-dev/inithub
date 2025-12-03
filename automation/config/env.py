import os
from dotenv import load_dotenv

load_dotenv()

# Application URLs
INITHUB_URL = os.getenv("INITHUB_URL", "http://localhost:5173/")

# Browser Configuration
HEADLESS_MODE = os.getenv("HEADLESS_MODE", "false").lower() in ("true", "1", "yes")

# LLM Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_ENDPOINT = os.getenv("OPENROUTER_ENDPOINT", "https://openrouter.ai/api/v1")
OPENROUTER_MODEL_NAME = os.getenv("OPENROUTER_MODEL_NAME", "gpt-4o-mini")
AGENT_MODEL_TEMPERATURE = float(os.getenv("AGENT_MODEL_TEMPERATURE", "0.7"))

# Automation Configuration
MAX_INTERACTIONS = int(os.getenv("MAX_INTERACTIONS", "10"))
DEFAULT_TIMEOUT = int(os.getenv("DEFAULT_TIMEOUT", "15"))
MESSAGE_DELAY = float(os.getenv("MESSAGE_DELAY", "1.0"))
RESPONSE_WAIT_TIME = float(os.getenv("RESPONSE_WAIT_TIME", "20.0"))

# Login Credentials
DEFAULT_EMAIL = os.getenv("DEFAULT_EMAIL", "admin@inithub.com")
DEFAULT_PASSWORD = os.getenv("DEFAULT_PASSWORD", "umaSenhaPadrao123")
