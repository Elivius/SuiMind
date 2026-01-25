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

def say_goodbye() -> str:
    """Provides a simple farewell message to conclude the conversation."""
    print(f"--- Tool: say_goodbye called ---")
    return "Ciao! Have a great day."

def prepare_sui_transfer(recipient: str, amount_sui: float) -> Dict[str, Any]:
    """
    Constructs a Programmable Transaction Block (PTB) for a SUI transfer.
    Args:
        recipient: The 0x address of the receiver.
        amount_sui: The amount of SUI to send.
    """
    # This data is passed back to frontend to trigger the wallet sign-in
    return {
        "status": "pending_simulation",
        "action": "TRANSFER",
        "payload": {
            "target": recipient,
            "amount": amount_sui,
            "currency": "SUI"
        },
        "message": f"Prepared transfer of {amount_sui} SUI to {recipient}. Awaiting security scan."
    }