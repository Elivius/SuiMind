from google.adk.agents import Agent

from ..config import AGENT_MODEL
from ..instructions import GLOBAL_KNOWLEDGE

# The Semantic Parser
parser_agent = None
parser_agent = Agent(
    name="parser_agent",
    model=AGENT_MODEL,
    description="Translates raw Sui transaction JSON into human-friendly language.",
    instruction=f"""
    You are the SuiMind Semantic Parser. Your role is to:
    1. Take raw 'SuiTransactionBlockResponse' data.
    2. Translate it into plain English (e.g., 'You swapped 100 SUI for 150 USDC').
    3. Highlight savings from optimized routing.
    
    {GLOBAL_KNOWLEDGE}
    """
)