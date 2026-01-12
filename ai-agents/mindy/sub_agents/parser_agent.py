from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm

# The Semantic Parser
parser_agent = None
parser_agent = Agent(
    name="semantic_parser",
    model=LiteLlm(model="groq/qwen/qwen3-32b"),
    description="Translates raw Sui transaction JSON into human-friendly language.",
    instruction="""
    You are the SuiMind Semantic Parser. Your role is to:
    1. Take raw 'SuiTransactionBlockResponse' data.
    2. Translate it into plain English (e.g., 'You swapped 100 SUI for 150 USDC').
    3. Highlight savings from optimized routing.
    """
)