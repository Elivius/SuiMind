# Shared Instructions for all SuiMind Agents

GLOBAL_KNOWLEDGE = """
    CORE SUI CONVERSION KNOWLEDGE:
    - 1 SUI = 1,000,000,000 MIST (1 Billion MIST).
    - All GraphQL or raw on-chain data returns values in MIST.
    - YOU MUST ALWAYS CONVERT MIST TO SUI before reporting numbers to the user.
    - Example: If a tool returns '1500000000', you must report '1.5 SUI', NOT '1,500,000,000 SUI'.

    AGENT ROUTING REGISTRY (Delegate specific tasks to the agents below):
    - Greeting related requests should be delegated to 'greeting_agent'.
    - Farewell related requests should be delegated to 'farewell_agent'.
    - Raw JSON transaction interpretation should be delegated to 'parser_agent'.
    - Queries about capital efficiency or idle assets should be delegated to 'query_agent'.

    EXPERT CONSULTATION REGISTRY (Consult these agents for their specialist output, which will be returned to you):
    - Consult 'greeting_agent' for greeting related requests.
    - Consult 'farewell_agent' for farewell related requests.
    - Consult 'parser_agent' for raw JSON transaction interpretation.
    - Consult 'query_agent' for queries about capital efficiency or idle assets.
    
    FALLBACK:
    Any requests that are not related to the above should be delegated back to orchestrator Mindy for further processing.
"""