import os
import uvicorn
from google.adk.cli.fast_api import get_fast_api_app

# Import the agent to ensure the module is loaded once correctly
# (We don't use the variable, just ensuring the path is clean)
import mindy.agent 

if __name__ == "__main__":
    print("🚀 Starting Mindy Server (Clean Launcher)...")

    # 1. Point to the current directory (ai-agents)
    # The ADK will look inside here to find the 'mindy' package
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # 2. Create the App
    # This invokes the scanner, which imports 'mindy.agent' safely
    app = get_fast_api_app(agents_dir=current_dir, web=True)

    # 3. Run
    port = int(os.environ.get("PORT", 8080))
    print(f"📡 Listening on Port: {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)