from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm # For multi-model support

# The Yield Optimizer
yield_agent = None
yield_agent = Agent(
    name="yield_optimizer",
    model=LiteLlm(model="groq/qwen/qwen3-32b"),
    description="Scans Sui protocols (Navi, Scallop) for the best yield opportunities.",
    instruction="""
    You are the SuiMind Yield Optimizer. Your role is to:
    1. Identify idle assets in the user's wallet.
    2. Suggest high-yield shifts in real-time.
    3. Monitor rates across Navi and Scallop protocols.
    """
)