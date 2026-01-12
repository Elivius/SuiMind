from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm
from google.adk.tools import google_search

# The Security specialist
security_agent = None
security_agent = Agent(
    name='security_agent',
    model='gemini-2.0-flash-exp', # 'Lite' models do not support Function Calling, which ADK uses for tools
    description="Analyzes Sui transaction risks and performs AML/CertiK scanning.",
    instruction="""
    You are the SuiMind Security Specialist. Your role is to use Google Search to:
    1. Scan target addresses using CertiK SkyInsights.
    2. Perform 'Dry-Run' simulations on the Sui Network.
    3. Output risk scores (0-100) and identify known 'Rugpull' or AML threats.
    """,
    tools=[google_search],
)