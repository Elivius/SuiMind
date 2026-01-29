import os
from dotenv import load_dotenv
from google.adk.models.lite_llm import LiteLlm

# Load key-value pairs from .env file located in the same directory
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

# Default LLM Model string
DEFAULT_LLM_MODEL = os.getenv("DEFAULT_LLM_MODEL", "gemini-2.5-flash")

# Specific Model Configurations
GEMINI_2_5_FLASH_LITE = os.getenv("GEMINI_2_5_FLASH_LITE", "gemini-2.5-flash-lite")
GEMINI_2_5_FLASH = os.getenv("GEMINI_2_5_FLASH", "gemini-2.5-flash")
GEMINI_3_FLASH_PREVIEW = os.getenv("GEMINI_3_FLASH_PREVIEW", "gemini-2.0-flash-thinking-exp-01-21")

# Backward compatibility (optional, or just for generic agent use)
if DEFAULT_LLM_MODEL.startswith("gemini"):
    AGENT_MODEL = DEFAULT_LLM_MODEL
else:
    AGENT_MODEL = LiteLlm(model=DEFAULT_LLM_MODEL)