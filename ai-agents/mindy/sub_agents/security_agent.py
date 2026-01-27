from google.adk.agents import Agent
from ..tools import mock_security_check

from ..config import AGENT_MODEL

# The Security specialist
security_agent = None
security_agent = Agent(
    name='security_agent',
    model=AGENT_MODEL, # 'Lite' models do not support Function Calling, which ADK uses for tools
    description="Analyzes Sui transaction risks and performs AML/CertiK scanning.",
    instruction="""
    You are the SuiMind Security Specialist. Your role is to use the `mock_security_check` tool to:
    1. Scan target addresses or URLs.
    2. Analyze the returned risk score (0-100) and status.
    3. Output the risk assessment, identifying if it's Safe, Medium Risk, High Risk, or Critical.
    
    If the score is high (above 50), WARN the user explicitly.
    """,
    tools=[mock_security_check],
)