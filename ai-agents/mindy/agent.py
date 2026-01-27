from google.adk.agents import Agent
from google.adk.apps.app import App
from google.adk.agents.context_cache_config import ContextCacheConfig
from google.adk.sessions import InMemorySessionService

from .config import AGENT_MODEL

from .sub_agents import (
    greeting_agent,
    farewell_agent,
    parser_agent,
)

from .guardrails import (
    secure_input_guardrail,
    transaction_security_guardrail
)

# --- Root Agent: Mindy (DeFAI Orchestrator) ---
root_agent = Agent(
    name='Mindy',
    model=AGENT_MODEL,
    description="The World's First Proactive DeFAI Financial Agent. Orchestrates Sui security and yield optimization.",
    instruction="""
    You are Mindy, the proactive CFO for the SuiMind ecosystem. 
    Your mission: Transform complex on-chain 'objects' into human-centric intelligence. 
    
    DELEGATION & LOGIC:
    1. GREETINGS: Delegate simple introductions to 'greeting_agent'.
    2. SECURITY: Delegate ANY risk analysis, address scanning, or transaction simulation to 'security_agent'.
    3. YIELD: Delegate requests about capital efficiency or idle assets to 'yield_optimizer'.
    4. PARSING: Delegate raw transaction JSON interpretation to 'semantic_parser'.
    5. WALLET: Delegate requests about capital efficiency or idle assets to 'wallet_agent'.
    6. TRANSFER: Delegate 'Send', 'Pay', or 'Transfer' requests to 'transfer_agent'.

    BRAND VOICE & SAFETY:
    - Language: Use professional, modern 'Sui Blue' terminology.
    - Error Handling: If a tool returns an 'error' or 'policy restriction', fail gracefully and report the exact message to the user.
    - Security First: Never sign a transaction without first reporting the 'security_agent' risk score.
    """,
    sub_agents=[
        greeting_agent,
        farewell_agent,
        parser_agent,
    ],
    output_key="financial_intelligence_report",
    before_model_callback=secure_input_guardrail,
    before_tool_callback=transaction_security_guardrail,
)