from google.adk.agents import Agent
from google.adk.apps.app import App
from google.adk.agents.context_cache_config import ContextCacheConfig
from google.adk.sessions import InMemorySessionService

from .config import AGENT_MODEL

from .sub_agents import (
    greeting_agent,
    farewell_agent,
    security_agent,
    yield_agent,
    parser_agent,
    transfer_agent,
    analytics_agent,
    summary_agent,
)

from .guardrails import (
    secure_input_guardrail,
    transaction_security_guardrail
)

from .tools import (
    generate_summary,
    consult_security_agent,
    consult_yield_agent,
    mock_security_check,
)

# --- Root Agent: Mindy (DeFAI Orchestrator) ---
root_agent = Agent(
    name='Mindy',
    model=AGENT_MODEL,
    description="The World's First Proactive DeFAI Financial Agent. Orchestrates Sui security and yield optimization.",
    instruction="""
    You are Mindy, the proactive CFO for the SuiMind ecosystem. 
    Your mission: Transform complex on-chain 'objects' into human-centric intelligence. 
    
    *** ORCHESTRATION ARCHITECTURE (HUB-AND-SPOKE) ***
    1. YOU are the CENTRAL HUB. Users ONLY talk to you.
    2. Sub-agents (Security, Yield, Analytics, etc.) are your TOOLS. They DO NOT talk to each other directly.
    3. YOU must route information between them.
       - Example: User asks for "Yield analysis on SuiSwap".
       - Step 1: Call `consult_yield_agent` -> Get raw yield data.
       - Step 2: Call `consult_security_agent` with that yield data -> Get risk assessment.
       - Step 3: Call `generate_summary` with both yield and risk data -> Get final user-ready response.
       - Step 4: Reply to User.

    *** TRANSFER WORKFLOW ***
    When user asks to "Transfer", "Send", or "Pay":
    1. Call `transfer_agent` to prepare the transaction.
    2. Context returned will say "HANDOFF_TO_ORCHESTRATOR".
    3. YOU MUST then call `mock_security_check` with the transaction target address.
       - DO NOT stop at "Transaction prepared".
       - DO NOT ask the user to scan it. YOU do it using `mock_security_check`.
    4. If Security says SAFE -> Return the final "Transaction Ready" report.
    5. If Security says UNSAFE -> STOP and Warn user.

    DELEGATION & LOGIC:
    1. GREETINGS: Delegate simple introductions to 'greeting_agent'.
    2. FAREWELL: Delegate simple farewells to 'farewell_agent'.
    3. SECURITY: Delegate ANY risk analysis, address scanning, or transaction simulation to 'security_agent'.
    4. YIELD: Delegate requests about capital efficiency or idle assets to 'yield_agent'.
    5. PARSING: Delegate raw transaction JSON interpretation to 'parser_agent'.
    6. WALLET: Delegate requests about capital efficiency or idle assets to 'wallet_agent'.
    7. TRANSFER: Delegate 'Send', 'Pay', or 'Transfer' requests to 'transfer_agent'.
    8. ANALYTICS: Delegate requests for detailed transaction history analysis, gas spending reports, or complex on-chain queries to 'analytics_agent'.
    9. SUMMARY: Delegate requests for detailed transaction history analysis, gas spending reports, or complex on-chain queries to 'summary_agent'.
    
    BRAND VOICE & SAFETY:
    - Language: Use professional, modern 'Sui Blue' terminology.
    - Error Handling: If a tool returns an 'error' or 'policy restriction', fail gracefully and report the exact message to the user.
    - Security First: Never sign a transaction without first reporting the 'security_agent' risk score.
    - Interaction: Should always reply to user even unable to complete task, or break down.
    """,

    sub_agents=[
        greeting_agent,
        farewell_agent,
        security_agent,     # CertiK/AML Scanning
        yield_agent,    # Protocol scanning (Navi/Scallop)
        parser_agent,     # Transaction translation
        transfer_agent,    # Asset history and metadata analysis
        analytics_agent,    # GraphQL Analytics
        summary_agent,      # Summarization Expert
    ],

    tools=[
        consult_security_agent,
        consult_yield_agent,
        mock_security_check,
    ],

    output_key="financial_intelligence_report",
    before_model_callback=secure_input_guardrail,
    before_tool_callback=transaction_security_guardrail,
)