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

def get_current_time() -> str:
    """
    Returns the current UTC time in ISO 8601 format.
    Useful for filtering transactions by date or understanding the current context.
    """
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).isoformat()

def execute_sui_graphql_query(query: str, variables: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Executes a GraphQL query against the Sui Testnet GraphQL endpoint.
    
    Args:
        query (str): The GraphQL query string.
        variables (dict, optional): A dictionary of variables for the query.
        
    Returns:
        dict: The JSON response from the GraphQL endpoint.
    """
    import requests
    import json
    
    url = "https://graphql.testnet.sui.io/graphql"
    headers = {
        "Content-Type": "application/json",
    }
    
    payload = {
        "query": query,
        "variables": variables or {}
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        print(f"--- Tool: execute_sui_graphql_query HTTP {response.status_code} ---")
        try:
            data = response.json()
        except json.JSONDecodeError:
            print(f"--- Tool: execute_sui_graphql_query Failed to decode JSON. Response text: {response.text[:200]}... ---")
            return {"error": f"HTTP {response.status_code}: {response.text}"}

        print(f"--- Tool: execute_sui_graphql_query completed. Response keys: {list(data.keys())} ---")
        if 'errors' in data:
            print(f"--- Tool: execute_sui_graphql_query GraphQL Errors: {data['errors']} ---")
        return data
    except Exception as e:
        print(f"Error executing GraphQL query: {e}")
        return {"error": str(e)}

def get_sui_schema_info(type_name: str) -> str:
    """
    Retrieves the GraphQL schema fields and types for a specific Sui object type.
    Use this if you are unsure of the available fields for types like 'Transaction', 'Address', or 'GasEffects'.
    
    Args:
        type_name: The name of the GraphQL type to inspect (e.g., 'Transaction', 'Address').
    """
    import requests
    url = "https://graphql.testnet.sui.io/graphql"
    query = """
    query IntrospectType($name: String!) {
      __type(name: $name) {
        name
        fields {
          name
          description
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
    """
    try:
        response = requests.post(url, json={'query': query, 'variables': {'name': type_name}}, timeout=10)
        return str(response.json())
    except Exception as e:
        return f"Error fetching schema: {str(e)}"

def consult_security_agent(context: str, tool_context: ToolContext) -> str:
    """
    Consults the Security Agent for risk analysis on a given context (e.g., transaction digest, address).
    """
    from .sub_agents import security_agent
    return _simulate_agent(security_agent, context)

def consult_yield_agent(context: str, tool_context: ToolContext) -> str:
    """
    Consults the Yield Agent for yield optimization opportunities based on the context.
    """
    from .sub_agents import yield_agent
    return _simulate_agent(yield_agent, context)

def generate_summary(context: str, tool_context: ToolContext) -> str:
    """
    Invokes the Summary Agent to generate a concise summary of the provided context.
    """
    from .sub_agents import summary_agent
    return _simulate_agent(summary_agent, context)

def _simulate_agent(agent_obj, prompt: str) -> str:
    """
    Helper function to simulate an agent's response by providing its persona/instructions to the caller.
    """
    return (
        f"[[SYSTEM: SWITCHING CONTEXT TO {agent_obj.name}]]\n"
        f"INSTRUCTIONS: {agent_obj.instruction}\n"
        f"INPUT CONTEXT: {prompt}\n"
        f"TASK: Generate the response as {agent_obj.name}. Return ONLY the insight/summary."
    )

def mock_security_check(target: str) -> Dict[str, Any]:
    """
    Performs a mock security check on a given target (address or URL).
    Returns a random risk score and status.
    Args:
        target: The address or URL to scan.
    """
    print(f"--- Tool: mock_security_check called with target: {target} ---")
    import random
    
    score = random.randint(0, 100)
    
    if score < 20:
        status = "CRITICAL_RISK"
        details = "Known scam address or malicious contract detected."
    elif score < 50:
        status = "HIGH_RISK"
        details = "Suspicious activity patterns or unverified contract."
    elif score < 80:
        status = "MEDIUM_RISK"
        details = "New contract with limited history."
    else:
        status = "SAFE"
        details = "Verified contract with clean history."
        
    return {
        "target": target,
        "risk_score": score,
        "status": status,
        "details": details,
        "scan_timestamp": get_current_time()
    }
