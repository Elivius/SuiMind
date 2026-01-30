from google.adk.agents import Agent

from tools import get_current_time
from config import GEMINI_3_FLASH_PREVIEW
from instructions import GLOBAL_KNOWLEDGE, SUI_KNOWLEDGE

# The Semantic Parser
parser_agent = None
parser_agent = Agent(
    name="parser_agent",
    model=GEMINI_3_FLASH_PREVIEW,
    description="Translates raw Sui transaction JSON into human-friendly language.",
    instruction=f"""
    You are the SuiMind Parser Agent.
    
    YOUR KNOWLEDGE:
    - You know how to translate raw 'SuiTransactionBlockResponse' data into plain English.
    - You know how to highlight savings from optimized routing.
    - You know how to prioritize the most important information.
    
    YOUR TASK:
    - Take raw 'SuiTransactionBlockResponse' data and translate it into plain English.
    - Highlight savings from optimized routing.
    - Prioritize the most important information.
    
    {GLOBAL_KNOWLEDGE}
    {SUI_KNOWLEDGE}
    """,
    tools=[get_current_time],
)