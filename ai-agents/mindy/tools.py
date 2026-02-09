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


# ============================================================
# TRANSACTION INTENT TOOLS
# These tools prepare transaction intents that the frontend will execute
# The AI agent describes WHAT to do, the frontend handles signing/execution
# ============================================================

def prepare_transfer(
    recipient: str,
    amount: float,
    remark: Optional[str] = None,
    tool_context: ToolContext = None
) -> Dict[str, Any]:
    """
    Prepares a SUI transfer transaction intent for the frontend to execute.
    The user must approve and sign this transaction through their wallet.
    
    Args:
        recipient (str): The Sui address to send SUI to (must start with 0x).
        amount (float): The amount of SUI to send.
        remark (str, optional): Optional remark for the transfer.
        tool_context (ToolContext, optional): The tool context to access session state.
        
    Returns:
        dict: A transaction intent object that the frontend will use to execute the transfer.
    """
    # Validate inputs
    if not recipient or not recipient.startswith('0x'):
        return {
            "success": False,
            "error": "Invalid recipient address. Must start with 0x."
        }
    
    if amount <= 0:
        return {
            "success": False,
            "error": "Amount must be greater than 0."
        }
    
    sender = None
    if tool_context and tool_context.state:
        sender = tool_context.state.get("sui_address")
    
    return {
        "success": True,
        "transaction_intent": {
            "type": "TRANSFER_SUI",
            "recipient": recipient,
            "amount": amount,
            "amount_mist": int(amount * 1_000_000_000),
            "sender": sender,
            "remark": remark or "Transfer via Mindy AI",
            "requires_signature": True
        },
        "message": f"I've prepared a transfer of {amount} SUI to {recipient[:6]}...{recipient[-4:]}. Please confirm this transaction in your wallet."
    }


def prepare_payment_request(
    recipient: str,
    amount: float,
    remark: Optional[str] = None,
    tool_context: ToolContext = None
) -> Dict[str, Any]:
    """
    Prepares a payment request transaction intent. This creates a request asking
    another user to pay you.
    
    Args:
        recipient (str): The Sui address of the person you're requesting payment FROM (must start with 0x).
        amount (float): The amount of SUI you're requesting.
        remark (str, optional): Optional remark for the payment request.
        tool_context (ToolContext, optional): The tool context to access session state.
        
    Returns:
        dict: A transaction intent object that the frontend will use to create the payment request.
    """
    if not recipient or not recipient.startswith('0x'):
        return {
            "success": False,
            "error": "Invalid recipient address. Must start with 0x."
        }
    
    if amount <= 0:
        return {
            "success": False,
            "error": "Amount must be greater than 0."
        }
    
    sender = None
    if tool_context and tool_context.state:
        sender = tool_context.state.get("sui_address")
    
    return {
        "success": True,
        "transaction_intent": {
            "type": "CREATE_PAYMENT_REQUEST",
            "recipient": recipient,  # Who should pay
            "amount": amount,
            "amount_mist": int(amount * 1_000_000_000),
            "sender": sender,  # Who is requesting
            "remark": remark or "Payment request via Mindy AI",
            "requires_signature": True
        },
        "message": f"I've prepared a payment request for {amount} SUI from {recipient[:6]}...{recipient[-4:]}. Please confirm to send this request."
    }


# REJECT STILL IN BETA
def prepare_reject_request(
    request_id: str,
    tool_context: ToolContext = None
) -> Dict[str, Any]:
    """
    Prepares a rejection for a payment request. Use this when the user wants to
    decline a payment request they received.
    
    Args:
        request_id (str): The object ID of the payment request to reject.
        tool_context (ToolContext, optional): The tool context to access session state.
        
    Returns:
        dict: A transaction intent object that the frontend will use to reject the request.
    """
    if not request_id:
        return {
            "success": False,
            "error": "Request ID is required."
        }
    
    return {
        "success": True,
        "transaction_intent": {
            "type": "REJECT_PAYMENT_REQUEST",
            "request_id": request_id,
            "requires_signature": True
        },
        "message": f"I've prepared to reject the payment request. Please confirm in your wallet."
    }

def get_staking_data() -> Dict[str, Any]:
    """
    Fetches real-time staking data including the current APY (Annual Percentage Yield) for Sui validators.
    Uses the Sui Fullnode JSON-RPC endpoint.
    
    Returns:
        dict: A dictionary containing the average APY, current epoch, and a summary message.
    """
    import requests
    # Using Testnet to match the GraphQL endpoint in this file. 
    # Switch to "https://fullnode.mainnet.sui.io:443" for mainnet.
    url = "https://fullnode.testnet.sui.io:443"
    
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "suix_getValidatorsApy",
        "params": []
    }
    
    try:
        print(f"--- Tool: get_staking_data fetching from {url} ---")
        response = requests.post(url, json=payload, timeout=10)
        data = response.json()
        
        if "result" in data and "apys" in data["result"]:
            # Calculate average APY from the latest epoch
            apys_list = data["result"]["apys"]
            if not apys_list:
                return {"error": "No APY data returned from the network."}
                
            # apys_list contains objects like {'apy': 0.05, 'address': '0x...'}
            # APY is usually returned as a float (e.g., 0.05 for 5%) or string
            valid_apys = []
            for entry in apys_list:
                try:
                    val = float(entry.get('apy', 0))
                    if val > 0:
                        valid_apys.append(val)
                except (ValueError, TypeError):
                    continue
            
            if valid_apys:
                avg_apy = sum(valid_apys) / len(valid_apys)
                formatted_apy = avg_apy * 100 # Convert to percentage
                epoch = data["result"].get("epoch", "Unknown")
                
                return {
                    "average_apy": avg_apy,
                    "average_apy_percent": f"{formatted_apy:.2f}%",
                    "epoch": epoch,
                    "validator_count": len(apys_list),
                    "message": f"The current average staking APY on Sui (Testnet) is approximately {formatted_apy:.2f}% (Epoch {epoch}).",
                    "suiscan_link": "https://suiscan.xyz/testnet/validators"
                }
            else:
                return {"message": "Could not calculate average APY from validator data."}
        elif "error" in data:
            return {"error": f"RPC Error: {data['error']}"}
        else:
            return {"error": "Unexpected response format from Sui RPC."}
            
    except Exception as e:
        print(f"Error executing get_staking_data: {e}")
        return {"error": str(e)}
