from google.adk.tools.tool_context import ToolContext
from google.adk.tools.base_tool import BaseTool
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.llm_request import LlmRequest
from google.adk.models.llm_response import LlmResponse
from google.genai import types # For creating message Content/Parts
from typing import Optional, Dict, Any # For type hints

def _capture_sui_address(callback_context: CallbackContext, message_text: str) -> None:
    """
    Captures SUI addresses from the user message and stores them in the session state.
    """
    print(f"--- Callback: _capture_sui_address running for text: '{message_text[:100]}...' ---")
    import re

    # Check if address is already known
    if "sui_address" not in callback_context.state:
        # Regex for Sui address (starts with 0x and has 64 hex chars) - allowing loosely for 60+ chars
        match = re.search(r'0x[a-fA-F0-9]{64}', message_text)
        if match:
            address = match.group(0)
            callback_context.state["sui_address"] = address
            print(f"--- Callback: Detected and saved Sui Address: {address} ---")
        else:
            # Default for agents to assume if unknown
            callback_context.state["sui_address"] = "UNKNOWN_ADDRESS"
            print(f"--- Callback: No Sui Address found in message. Defaulting to 'UNKNOWN_ADDRESS'. ---")
    else:
        print(f"--- Callback: Using existing Sui Address from State: {callback_context.state} ---")

# Guardrail before model callback
def secure_input_guardrail(
        callback_context: CallbackContext, llm_request: LlmRequest
    ) -> Optional[LlmResponse]:
    """
    Inspects the latest user message for security-critical keywords related to
    credential leakage, prompt injection, and safety bypass attempts.
    """
    agent_name = callback_context.agent_name
    print(f"--- Callback: secure_input_guardrail running for agent: {agent_name} ---")

    last_user_message_text = ""
    if llm_request.contents:
        for content in reversed(llm_request.contents):
            if content.role == 'user' and content.parts:
                if content.parts[0].text:
                    text = content.parts[0].text
                    # Check if this is the "For context" message and skip it if so
                    if text.strip().startswith("For context:"):
                         continue
                    
                    last_user_message_text = text
                    break

    print(f"--- Callback: Inspecting last user message: '{last_user_message_text[:100]}...' ---")

    # --- Address Capture Logic ---
    _capture_sui_address(callback_context, last_user_message_text)
    
    # --- Guardrail Logic ---
    # Critical security keywords
    danger_keywords = [
        "seed phrase", "private key", "mnemonic", "secret key", 
        "ignore previous", "system override", "developer mode",
        "bypass security", "disable aml", "skip simulation"
    ]

    found_keyword = next((kw for kw in danger_keywords if kw in last_user_message_text.lower()), None)

    if found_keyword:
        print(f"--- Callback: Found '{found_keyword}'. Blocking LLM call! ---")
        # Optionally, set a flag in state to record the block event
        callback_context.state["secure_input_guardrail_triggered"] = True
        print(f"--- Callback: Set state 'secure_input_guardrail_triggered': True ---")

        # Construct and return an LlmResponse to stop the flow and send this back instead
        return LlmResponse(
            content=types.Content(
                role="model", # Mimic a response from the agent's perspective
                parts=[types.Part(text=(
                        f"⚠️ Security Alert: Your request involves a restricted term ('{found_keyword}'). "
                        "To protect your assets, SuiMind does not process instructions that "
                        "compromise 'Zero-Trust' security protocols or credential safety."
                    ))],
            )
        )
    else:
        # Keyword not found, allow the request to proceed to the LLM
        print(f"--- Callback: Keyword not found. Allowing LLM call for {agent_name}. ---")
        return None # Returning None signals ADK to continue normally
        

def transaction_security_guardrail(
        tool: BaseTool, args: Dict[str, Any], tool_context: ToolContext
    ) -> Optional[Dict]:
    """
    SuiMind 'Safety Wall' Guardrail: Inspects transactions for high risk scores,
    AML flags, and excessive financial slippage before execution.
    """
    tool_name = tool.name
    agent_name = tool_context.agent_name
    print(f"--- Callback: transaction_security_guardrail running for tool '{tool_name}' in agent '{agent_name}' ---")
    print(f"--- Callback: Inspecting args: {args} ---")
    
    # 1. Fetch real-time security data from the session state
    # This data is populated by the 'security_specialist' agent or middleware
    risk_score = tool_context.state.get("certik_risk_score", 0) # Score 0-100
    is_aml_flagged = tool_context.state.get("aml_sanction_flag", False)
    print(f"--- Callback: Risk Score: {risk_score}, AML Flagged: {is_aml_flagged} ---")

    # 2. Block transactions to high-risk or sanctioned entities
    # SuiMind aims to reduce wallet drains by 90% via this check [cite: 15, 27]
    if risk_score > 70 or is_aml_flagged:
        print(f"--- Callback: Blocking transaction due to high risk score ({risk_score}) or AML flag ({is_aml_flagged}) ---")
        return {
            "status": "error",
            "error_message": (
                f"Security Block: Target address risk score is {risk_score}/100. "
                "Known threats (AML/Rugpull) detected. Transaction halted by Safety Wall."
            )
        }

    # 3. Financial Safety: Slippage & Value Protection
    if tool_name == "swap_assets":
        slippage = float(args.get("slippage", 0))
        # High slippage can lead to significant value loss via MEV [cite: 20]
        if slippage > 0.05: # 5% threshold
            print(f"--- Callback: Blocking swap due to high slippage ({slippage}) ---")
            return {
                "status": "error",
                "error_message": "Policy restriction: Slippage exceeds 5%. Use a tighter range to protect your assets."
            }

    # 4. Large Transfer Guardrail
    if tool_name == "execute_transfer":
        amount = float(args.get("amount", 0))
        if amount > 1000: # Example threshold for manual review
            print(f"--- Callback: Blocking transfer due to high amount ({amount}) ---")
            return {
                "status": "error",
                "error_message": "Policy restriction: Large transfers (>1000 SUI) require additional simulation review."
            }
            
    print(f"--- Callback: Transaction allowed for tool '{tool_name}' ---")
    return None # Allow transaction to proceed