from typing import Optional
from google.adk.tools.tool_context import ToolContext
from google.adk.tools import FunctionTool
from typing import Dict, Any 

def say_hello(name: Optional[str] = None) -> str:
    """Provides a simple greeting. If a name is provided, it will be used.

    Args:
        name (str, optional): The name of the person to greet. Defaults to a generic greeting if not provided.

    Returns:
        str: A friendly greeting message.
    """
    if name:
        greeting = f"Hello, {name}!"
        print(f"--- Tool: say_hello called for {name} ---")
    else:
        greeting = "Hello there!"
        print(f"--- Tool: say_hello called without a specific name (name_arg_value: {name}) ---")
    return greeting

def say_goodbye(name: Optional[str] = None) -> str:
    """Provides a simple farewell message to conclude the conversation."""
    if name:
        greeting = f"Goodbye, {name}!"
        print(f"--- Tool: say_goodbye called for {name} ---")
    else:
        greeting = "Goodbye there!"
        print(f"--- Tool: say_goodbye called without a specific name (name_arg_value: {name}) ---")
    return greeting

def get_current_time() -> str:
    """
    Returns the current UTC time in ISO 8601 format.
    Useful for filtering transactions by date or understanding the current context.
    """
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).isoformat()