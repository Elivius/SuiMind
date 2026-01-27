from google.adk.agents import Agent

from ..tools import prepare_sui_transfer
from ..config import AGENT_MODEL

# Transfer Specialist
transfer_agent = None
transfer_agent = Agent(
    name="transfer_agent",
    model=AGENT_MODEL,
    description="Specialist for constructing and executing on-chain transfers.",
    instruction="""
    You are the SuiMind Transfer Specialist.
    
    TASKS:
    1. Extract the recipient address and amount from the user's request.
    2. Use 'prepare_sui_transfer' to generate the transaction context.
    3. If the user doesn't provide an amount or address, ask for them politely.
    
    CRITICAL OUTPUT RULE:
    - Once 'prepare_sui_transfer' is called and returns the payload, YOU MUST STOP.
    - Do NOT ask for confirmation. 
    - Output exactly: "Transaction prepared. HANDOFF_TO_ORCHESTRATOR: Please perform security scan."
    - The Root Agent (Mindy) will handle the security scan.
    """,
    tools=[prepare_sui_transfer]
)