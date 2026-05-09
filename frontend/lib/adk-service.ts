"use server";

const API_BASE_URL = process.env.AI_AGENT_URL as string
const APP_NAME = "mindy";

export interface ChatMessage {
    role: "user" | "mindy";
    content: string;
    id?: string;
}

export const createSession = async (
    suiAddress: string,
    existingUserId?: string
): Promise<{ sessionId: string, userId: string }> => {
    // Use native randomUUID if available, else fallback to a simple random string for compatibility
    const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

    const userId = existingUserId || `user-${generateId()}`; // existingUserId is used when user want to create a new session with same user identity (User create new chat)
    const sessionId = `session-${Date.now()}`;

    try {
        const response = await fetch(
            `${API_BASE_URL}/apps/${APP_NAME}/users/${userId}/sessions/${sessionId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sui_address: suiAddress })
            }
        );

        if (response.ok) {
            return { sessionId, userId };
        } else {
            console.error("Failed to create session:", await response.text());
            throw new Error(response.statusText);
        }
    } catch (error: any) {
        // Handle connection refused error
        if (error.cause && error.cause.code === 'ECONNREFUSED') {
            throw new Error("Agent server is offline.");
        }
        throw error;
    }
};

export const sendMessageToAgent = async (
    userId: string,
    sessionId: string,
    message: string
): Promise<{ text?: string, transactionIntent?: any, error?: string }> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/run`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    app_name: APP_NAME,
                    user_id: userId,
                    session_id: sessionId,
                    new_message: {
                        role: "user",
                        parts: [{ text: message }]
                    }
                })
            }
        );

        // Handle cloudrun instance scale to 0 (memory wiped out)
        if (response.status === 404) {
            console.warn("ADK 404: Session not found on server.");
            return { error: "SESSION_EXPIRED" };
        }

        if (!response.ok) {
            console.error("Failed to send message:", await response.text());
            throw new Error(response.statusText);
        }

        const events = await response.json();
        let mindyMessage = "";
        let transactionIntent = null;

        for (const event of events) {
            // Extract text response
            const content = event.content || {};
            const parts = content.parts || [];

            if (content.role === "model" && parts.length > 0 && parts[0].text) {
                mindyMessage += parts[0].text;
            }

            // ========= WAY 1 to get transaction intent from LLM =========
            // Check for function call responses that contain transaction_intent
            for (const part of parts) {
                // Check functionResponse (tool output)
                if (part.functionResponse) {
                    const funcResult = part.functionResponse.response || part.functionResponse;
                    if (funcResult?.transaction_intent) {
                        transactionIntent = funcResult;
                    }
                }
            }
        }

        // ========= WAY 2 to get transaction intent from LLM =========
        // Parse :::TRANSACTION_INTENT::: markers from the accumulated text
        // This is the primary method - the AI agent includes this in its response
        if (mindyMessage.includes(':::TRANSACTION_INTENT:::')) {
            const intentMatch = mindyMessage.match(/:::TRANSACTION_INTENT:::\s*([\s\S]*?)\s*:::END_TRANSACTION_INTENT:::/);
            if (intentMatch && intentMatch[1]) {
                try {
                    const extracted = JSON.parse(intentMatch[1].trim());
                    if (extracted.transaction_intent) {
                        transactionIntent = extracted;
                    }
                } catch (e) {
                    console.warn("Failed to parse transaction intent from markers:", e);
                }
            }
            // Remove the markers from the displayed message
            mindyMessage = mindyMessage
                .replace(/:::TRANSACTION_INTENT:::[\s\S]*?:::END_TRANSACTION_INTENT:::/g, '')
                .trim();
        }

        // ========= WAY 3 to get transaction intent from LLM =========
        // Fallback: Try to extract JSON with transaction_intent from text (less reliable)
        if (!transactionIntent && mindyMessage.includes('transaction_intent')) {
            const jsonMatch = mindyMessage.match(/\{[\s\S]*"transaction_intent"[\s\S]*?\}/);
            if (jsonMatch) {
                try {
                    const extracted = JSON.parse(jsonMatch[0]);
                    if (extracted.transaction_intent) {
                        transactionIntent = extracted;
                    }
                } catch { /* ignore */ }
            }
        }

        // mindyMessage will be the trimmed / formated pure human readable text
        // transactionIntent will be the transaction intent object :::TRANSACTION_INTENT:::xxx:::END_TRANSACTION_INTENT:::
        return { text: mindyMessage, transactionIntent };

    } catch (error: any) {
        if (error.cause && error.cause.code === 'ECONNREFUSED') {
            throw new Error("Agent server is offline.");
        }
        throw error;
    }
};

export const getSessionHistory = async (
    userId: string,
    sessionId: string
): Promise<ChatMessage[]> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/apps/${APP_NAME}/users/${userId}/sessions/${sessionId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }
        );

        if (!response.ok) {
            console.error("Failed to fetch history:", await response.text());
            throw new Error(`Failed to fetch history: ${response.statusText}`);
        }

        const data = await response.json();
        const events = data.events || [];
        const history: ChatMessage[] = [];

        for (const event of events) {
            // Only handle user or model messages with text
            const role = event.content?.role;
            const parts = event.content?.parts || [];

            if ((role === "user" || role === "model") && parts.length > 0) {
                let text = "";
                // Handle text parts
                for (const part of parts) {
                    if (part.text) {
                        text += part.text;
                    }
                }

                if (text) {
                    // Clean up transaction intent markers from history as well
                    if (role === "model") {
                        text = text
                            .replace(/:::TRANSACTION_INTENT:::[\s\S]*?:::END_TRANSACTION_INTENT:::/g, '')
                            .trim();
                    }

                    // Only add if there is still text content after cleanup
                    if (text) {
                        history.push({
                            role: role === "model" ? "mindy" : "user",
                            content: text,
                            id: event.id || Date.now().toString()
                        });
                    }
                }
            }
        }
        return history;

    } catch (error: any) {
        console.error("Error fetching history:", error);
        if (error.cause && error.cause.code === 'ECONNREFUSED') {
            throw new Error("Agent server is offline.");
        }
        throw error; // Throw error so we can handle it in the hook (stop polling)
    }
};
