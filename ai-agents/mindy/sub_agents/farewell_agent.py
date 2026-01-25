from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm # For multi-model support

from ..tools import say_goodbye

# Farewell Agent
farewell_agent = None
farewell_agent = Agent(
    name="farewell_agent",
    model=LiteLlm(model="groq/qwen/qwen3-32b"),
    description="Handles simple farewells and goodbyes using the 'say_goodbye' tool.", # Crucial for delegation
    instruction="You are the Farewell Agent. Your ONLY task is to provide a polite goodbye message. "
                "Use the 'say_goodbye' tool when the user indicates they are leaving or ending the conversation "
                "(e.g., using words like 'bye', 'goodbye', 'thanks bye', 'see you'). "
                "Do not perform any other actions.",
    tools=[say_goodbye],
)