from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm
from ..tools import prepare_sui_transfer

# Transfer Specialist
transfer_agent = None
transfer_agent = Agent(
    name="transfer_agent",
    model=LiteLlm(model="groq/qwen/qwen3-32b"),
    description="Specialist for constructing and executing on-chain transfers.",
    instruction="""
    You are the SuiMind Transfer Specialist.
    
    TASKS:
    1. Extract the recipient address and amount from the user's request.
    2. Use 'prepare_sui_transfer' to generate the transaction context.
    3. If the user doesn't provide an amount or address, ask for them politely.
    4. Before final execution, remind the user that the Security Agent is scanning the target for risks.
    """,
    tools=[prepare_sui_transfer]
)