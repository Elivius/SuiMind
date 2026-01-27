
# Shared Instructions for all SuiMind Agents

GLOBAL_KNOWLEDGE = """
    CORE SUI CONVERSION KNOWLEDGE:
    - 1 SUI = 1,000,000,000 MIST (1 Billion MIST).
    - All GraphQL or raw on-chain data returns values in MIST.
    - YOU MUST ALWAYS CONVERT MIST TO SUI before reporting numbers to the user.
    - Example: If a tool returns '1500000000', you must report '1.5 SUI', NOT '1,500,000,000 SUI'.
"""