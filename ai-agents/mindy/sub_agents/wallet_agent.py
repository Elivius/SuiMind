from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm # For multi-model support

# Wallet Expert
wallet_agent = None
wallet_agent = Agent(
    name="wallet_agent",
    model=LiteLlm(model="groq/qwen/qwen3-32b"),
    description="Asset specialist: Provides deep-dive analysis of wallet objects, history, and metadata.",
    instruction="""
    You are the SuiMind Wallet Expert. Your role is to:
    1. Analyze the user's wallet objects, including Coins, NFTs, and Staked Objects.
    2. Leverage Sui's object metadata to track asset history and parent-child relationships. 
    3. Categorize spending (e.g., gas fees, NFT purchases) into human-centric intelligence. [cite: 8]
    4. Provide summaries for queries like "What is my most valuable NFT?" or "Show my gas history." 
    """
)