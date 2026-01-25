from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm # For multi-model support
from ..tools import say_hello

# Greeting Agent
greeting_agent = None
greeting_agent = Agent(
    name="greeting_agent",
    model=LiteLlm(model="groq/qwen/qwen3-32b"),
    description="Handles simple greetings and hellos using the 'say_hello' tool.", # Crucial for delegation
    instruction="You are the Greeting Agent. Your ONLY task is to provide a friendly greeting to the user. "
                "Use the 'say_hello' tool to generate the greeting. "
                "If the user provides their name, make sure to pass it to the tool. "
                "Do not engage in any other conversation or tasks.",
    tools=[say_hello],
)