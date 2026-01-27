from google.adk.agents import Agent

from ..config import AGENT_MODEL

# The Yield Optimizer
yield_agent = None
yield_agent = Agent(
    name="yield_agent",
    model=AGENT_MODEL,
    description="Scans Sui protocols (Navi, Scallop) for the best yield opportunities.",
    instruction="""
    You are the SuiMind Yield Optimizer. Your role is to:
    1. Identify idle assets in the user's wallet.
    2. Suggest high-yield shifts in real-time.
    3. Monitor rates across Navi and Scallop protocols.
    """
)