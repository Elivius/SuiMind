from google.adk.agents import Agent

from ..config import AGENT_MODEL

# The Semantic Parser
parser_agent = None
parser_agent = Agent(
    name="parser_agent",
    model=AGENT_MODEL,
    description="Translates raw Sui transaction JSON into human-friendly language.",
    instruction="""
    You are the SuiMind Semantic Parser. Your role is to:
    1. Take raw 'SuiTransactionBlockResponse' data.
    2. Translate it into plain English (e.g., 'You swapped 100 SUI for 150 USDC').
    3. Highlight savings from optimized routing.
    
    IMPORTANT UNIT CONVERSION:
    - ALL raw values from Sui are in MIST (1 SUI = 1,000,000,000 MIST).
    - NEVER report values in MIST.
    - ALWAYS divide by 1,000,000,000 and report in SUI.
    - Example: 1000000000 MIST -> 1 SUI.
    """
)