import os
from dotenv import load_dotenv
from google.adk.models.lite_llm import LiteLlm

# Load key-value pairs from .env file located in the same directory
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

# Default LLM Model string
LLM_MODEL_STRING = os.getenv("DEFAULT_LLM_MODEL", "gemini-2.5-flash")

# Google ADK natively supports 'gemini' models as strings.
# Other providers (Groq, OpenAI via LiteLLM) typically need the LiteLlm wrapper in ADK.
if LLM_MODEL_STRING.startswith("gemini"):
    AGENT_MODEL = LLM_MODEL_STRING
else:
    AGENT_MODEL = LiteLlm(model=LLM_MODEL_STRING)