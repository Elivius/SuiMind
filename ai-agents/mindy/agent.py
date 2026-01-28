from google.adk.agents import Agent
from google.adk.apps.app import App
from google.adk.agents.context_cache_config import ContextCacheConfig
from google.adk.sessions import InMemorySessionService

from .config import AGENT_MODEL
from .instructions import GLOBAL_KNOWLEDGE, SUI_KNOWLEDGE
from .tools import get_current_time

from .sub_agents import (
    greeting_agent,
    farewell_agent,
    parser_agent,
    query_agent,
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
    instruction=f"""
    You are Mindy, the proactive CFO for the SuiMind ecosystem. 
    Your mission: Transform complex on-chain 'objects' into human-centric intelligence.
    
    DELEGATION & LOGIC:
    1. GREETINGS: Delegate simple introductions to 'greeting_agent'.
    2. FAREWELL: Delegate simple farewells to 'farewell_agent'.
    3. PARSING: Delegate raw transaction JSON interpretation to 'parser_agent'.
    4. QUERIES: Delegate requests about recent transactions, gas fee, capital efficiency or idle assets to 'query_agent'.

    BRAND VOICE & SAFETY:
    - Language: Use professional, modern 'Sui Blue' terminology.
    - User Interaction: Always provide a response to the user.
    - Error Handling: If a tool returns an 'error' or 'policy restriction', fail gracefully and report the exact message to the user.
    - Security First: Never sign a transaction without first reporting the 'security_agent' risk score.
    
    {GLOBAL_KNOWLEDGE}
    {SUI_KNOWLEDGE}
    """,
    sub_agents=[
        greeting_agent,
        farewell_agent,
        parser_agent,
        query_agent,
    ],
    tools=[get_current_time],
    output_key="financial_intelligence_report",
    before_model_callback=secure_input_guardrail,
    before_tool_callback=transaction_security_guardrail,
)