from google.adk.agents import Agent
from google.adk.apps.app import App
from google.adk.agents.context_cache_config import ContextCacheConfig
from google.adk.models.lite_llm import LiteLlm # For multi-model support
from google.adk.sessions import InMemorySessionService

from .sub_agents import (
    greeting_agent,
    farewell_agent,
    security_agent,
    yield_agent,
    parser_agent,
    wallet_agent,
    transfer_agent,
)
from .guardrails import (
    secure_input_guardrail,
    transaction_security_guardrail
)

# --- Root Agent: Mindy (DeFAI Orchestrator) ---
root_agent = Agent(
    name='Mindy',
    model=LiteLlm(model="groq/qwen/qwen3-32b"),
    description="The World's First Proactive DeFAI Financial Agent. Orchestrates Sui security and yield optimization.",
    instruction="""
    You are Mindy, the proactive CFO for the SuiMind ecosystem. 
    Your mission: Transform complex on-chain 'objects' into human-centric intelligence. 
    
    DELEGATION & LOGIC:
    1. GREETINGS: Delegate simple introductions to 'greeting_agent'.
    2. SECURITY: Delegate ANY risk analysis, address scanning, or transaction simulation to 'security_agent'. [cite: 24, 28]
    3. YIELD: Delegate requests about capital efficiency or idle assets to 'yield_optimizer'. [cite: 16, 26]
    4. PARSING: Delegate raw transaction JSON interpretation to 'semantic_parser'. [cite: 19]
    5. WALLET: Delegate requests about capital efficiency or idle assets to 'wallet_agent'. [cite: 19]
    6. TRANSFER: Delegate 'Send', 'Pay', or 'Transfer' requests to 'transfer_agent'. [cite: 19]

    BRAND VOICE & SAFETY:
    - Language: Use professional, modern 'Sui Blue' terminology. [cite: 33]
    - Error Handling: If a tool returns an 'error' or 'policy restriction', fail gracefully and report the exact message to the user.
    - Security First: Never sign a transaction without first reporting the 'security_agent' risk score. [cite: 43, 45]
    """,
    sub_agents=[
        greeting_agent,
        farewell_agent,
        security_agent,     # CertiK/AML Scanning [cite: 6, 28]
        yield_agent,    # Protocol scanning (Navi/Scallop) [cite: 26]
        parser_agent,     # Transaction translation [cite: 19]
        wallet_agent,    # Asset history and metadata analysis [cite: 19]
        transfer_agent,    # Asset history and metadata analysis [cite: 19]
    ],
    output_key="financial_intelligence_report",
    before_model_callback=secure_input_guardrail,
    before_tool_callback=transaction_security_guardrail,
)