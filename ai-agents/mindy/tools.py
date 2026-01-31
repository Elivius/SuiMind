from typing import Optional
from google.adk.tools.tool_context import ToolContext
from google.adk.tools import FunctionTool
from typing import Dict, Any 

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
    
    print(f"--- Tool: execute_sui_graphql_query Query: {query} ---")
    print(f"--- Tool: execute_sui_graphql_query Variables: {variables} ---")
    
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

def get_transactions(address: Optional[str] = None, limit: int = 5, before: Optional[str] = None, tool_context: ToolContext = None) -> Dict[str, Any]:
    """
    Fetches transaction history for a specific address.
    
    Args:
        address (str, optional): The Sui address to fetch transactions for. If None, tries to use 'sui_address' from context state.
        limit (int, optional): The number of transactions to fetch. Defaults to 5.
        before (str, optional): The cursor for pagination (to get previous page).
        tool_context (ToolContext, optional): The tool context to access session state.
        
    Returns:
        dict: The transaction history data.
    """
    if not address and tool_context and tool_context.state:
        address = tool_context.state.get("sui_address")
        print(f"--- Tool: get_transactions used context address: {address} ---")

    if not address or address == "UNKNOWN_ADDRESS":
        return {"error": "No address provided and no address found in session context. Please ask the user for their Sui address."}
    query = """
    query getTransactions($address: SuiAddress!, $limit: Int = 5, $before: String) {
      transactions(last: $limit, before: $before, filter: {affectedAddress: $address}) {
        pageInfo {
          hasPreviousPage
          startCursor
        }
        nodes {
          digest
          gasInput {
            gasPrice
            gasBudget
            gasSponsor {
              address
            }
          }
          effects {
            timestamp
            status
            gasEffects {
              gasSummary {
                computationCost
                storageCost
                storageRebate
                nonRefundableStorageFee
              }
            }
            balanceChangesJson
          }
        }
      }
    }
    """
    variables = {
        "address": address,
        "limit": limit,
        "before": before
    }
    return execute_sui_graphql_query(query, variables)

def get_balance(address: Optional[str] = None, tool_context: ToolContext = None) -> Dict[str, Any]:
    """
    Fetches the balance of a specific address.
    
    Args:
        address (str, optional): The Sui address to fetch the balance for. If None, tries to use 'sui_address' from context state.
        tool_context (ToolContext, optional): The tool context to access session state.
        
    Returns:
        dict: The balance data.
    """
    if not address and tool_context and tool_context.state:
        address = tool_context.state.get("sui_address")
        print(f"--- Tool: get_balance used context address: {address} ---")

    if not address or address == "UNKNOWN_ADDRESS":
        return {"error": "No address provided and no address found in session context. Please ask the user for their Sui address."}
    query = """
    query getBalances($address: SuiAddress!) {
      address(address: $address) {
        balance(coinType: "0x2::sui::SUI") {
          totalBalance
        }
      }
    }
    """
    variables = {
        "address": address
    }
    return execute_sui_graphql_query(query, variables)
