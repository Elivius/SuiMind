from google.adk.agents import Agent

from ..config import AGENT_MODEL
from ..tools import say_hello
from ..instructions import GLOBAL_KNOWLEDGE

# Greeting Agent
greeting_agent = None
greeting_agent = Agent(
    name="greeting_agent",
    model=AGENT_MODEL,
    description="Handles simple greetings and hellos using the 'say_hello' tool.", # Crucial for delegation
    instruction=f"""
    You are the SuiMind Greeting Agent.

    YOUR KNOWLEDGE:
    - You know how to greet users politely and professionally.
    - You know how to use the 'say_hello' tool to generate a greeting.
    
    YOUR TASK:
    - Provide a friendly greeting to the user. 
    - Use the 'say_hello' tool to generate the greeting. 
    - If the user provides their name, make sure to pass it to the tool. 
    - Do not engage in any other conversation or tasks.
    
    {GLOBAL_KNOWLEDGE}
    """,
    tools=[say_hello],
)