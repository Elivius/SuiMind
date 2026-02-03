// Use to interact with ai-agent (mindy)

"use client";

import { useState, useCallback, useEffect } from 'react';
import { createSession, sendMessageToAgent, getSessionHistory, ChatMessage } from '@/lib/adk-service';
import { useCurrentAccount } from '@mysten/dapp-kit';

export const useMindyAgent = () => {
    const account = useCurrentAccount()

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial check for stored user ID and pending state
    useEffect(() => {
        const init = async () => {
            if (typeof window !== 'undefined') {
                const storedUserId = localStorage.getItem('mindy_ai_user_id');
                const storedSessionId = localStorage.getItem('mindy_ai_session_id');
                const isPending = localStorage.getItem('mindy_ai_pending') === 'true';

                // Restore loading state if there was a pending request
                if (isPending) {
                    setIsLoading(true);
                }

                if (storedUserId) {
                    setUserId(storedUserId);
                }

                if (storedSessionId && storedUserId) {
                    setSessionId(storedSessionId);
                    // Fetch history
                    try {
                        const history = await getSessionHistory(storedUserId, storedSessionId);
                        if (history && history.length > 0) {
                            setMessages(history);
                            // Only clear pending if the last message is from Mindy (AI has responded)
                            if (isPending) {
                                const lastMessage = history[history.length - 1];
                                if (lastMessage.role === 'mindy') {
                                    // AI has responded, clear pending
                                    localStorage.removeItem('mindy_ai_pending');
                                    setIsLoading(false);
                                }
                                // If last message is still from 'user', keep loading and let polling handle it
                            }
                        }
                    } catch (e) {
                        console.error("Failed to load history", e);
                        // Clear pending on error
                        if (isPending) {
                            localStorage.removeItem('mindy_ai_pending');
                            setIsLoading(false);
                        }
                    }
                }
            }
        };
        init();
    }, []);

    // Poll for AI response while loading (handles cross-page navigation)
    useEffect(() => {
        if (!isLoading || !sessionId || !userId) return;

        const pollInterval = setInterval(async () => {
            try {
                const history = await getSessionHistory(userId, sessionId);
                if (history && history.length > 0) {
                    const lastMessage = history[history.length - 1];
                    if (lastMessage.role === 'mindy') {
                        // AI has responded
                        setMessages(history);
                        localStorage.removeItem('mindy_ai_pending');
                        setIsLoading(false);
                    }
                }
            } catch (e) {
                console.error("Polling failed", e);
            }
        }, 5000);

        return () => clearInterval(pollInterval);
    }, [isLoading, sessionId, userId]);

    const startSession = useCallback(async ({ skipLoading = false, forceNew = false } = {}) => {
        if (!skipLoading) setIsLoading(true);
        setError(null);
        try {
            // Check for existing session first to avoid re-creating if we have one locally
            const storedSessionId = typeof window !== 'undefined' ? localStorage.getItem('mindy_ai_session_id') || undefined : undefined;
            const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('mindy_ai_user_id') || undefined : undefined;

            let finalSessionId = forceNew ? undefined : storedSessionId; // if forceNew is true, we create a new session (When user clicks delete chat)
            let finalUserId = storedUserId;

            // Simplified logic: If we don't have a session in state (or we forced new - user create new chat), try to create
            if (!finalSessionId || !finalUserId) {
                // Pass storedUserId so we keep the same user identity but get a NEW session ID (If user create new chat - remain same user id)
                const sessionData = await createSession(account?.address as string, finalUserId);
                finalSessionId = sessionData.sessionId;
                finalUserId = sessionData.userId;

                // If we forced a new session, clear the UI messages
                if (forceNew) {
                    setMessages([]);
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('mindy_ai_pending');
                    }
                }
            }

            setSessionId(finalSessionId);
            setUserId(finalUserId);

            if (typeof window !== 'undefined') {
                if (finalUserId) localStorage.setItem('mindy_ai_user_id', finalUserId);
                if (finalSessionId) localStorage.setItem('mindy_ai_session_id', finalSessionId);
            }

            return { sessionId: finalSessionId, userId: finalUserId };

        } catch (e: any) {
            console.error(e);
            setError("Failed to start session.");
            return undefined;
        } finally {
            if (!skipLoading) setIsLoading(false);
        }
    }, [account?.address]);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        // Optimistically add user message
        const userMsg: ChatMessage = { role: 'user', content, id: Date.now().toString() };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);
        setError(null);

        // Set pending flag in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('mindy_ai_pending', 'true');
        }

        try {
            // Create session lazily if needed (Will be null if it is a new user)
            let currentSessionId = sessionId;
            let currentUserId = userId;

            /*
            Usually when it is first time user, it will create the session when
            user click on send button, the startSession will be called here.

            Only when user create new chat, it will create a new session
            by directly calling startSession at Line 44
            */
            if (!currentSessionId || !currentUserId) {
                const sessionData = await startSession({ skipLoading: true }); // skipLoading=true so we don't turn off loading prematurely
                if (!sessionData) {
                    throw new Error("Failed to initialize session");
                }
                currentSessionId = sessionData.sessionId;
                currentUserId = sessionData.userId;
            }

            const response = await sendMessageToAgent(currentUserId!, currentSessionId!, content);

            if (response.error === "SESSION_EXPIRED") {
                console.warn("Session expired. Re-initializing...");
                localStorage.removeItem('mindy_ai_session_id');
                setSessionId(null);

                const newSession = await startSession({ skipLoading: true, forceNew: false }); // No need forceNew chat history since session is deleted (no history recorded)

                if (newSession) {
                    // Retry the message with the NEW credentials
                    const retryResponse = await sendMessageToAgent(newSession.userId, newSession.sessionId, content);

                    if (retryResponse.text) {
                        setMessages(prev => [...prev, {
                            role: 'mindy',
                            content: retryResponse.text!,
                            id: Date.now().toString()
                        }]);
                        return;
                    } else if (retryResponse.error) {
                        throw new Error(retryResponse.error);
                    }
                } else {
                    throw new Error("Failed to re-initialize session.");
                }
                return;
            }

            if (response.error) {
                throw new Error(response.error);
            }

            const agentMsg: ChatMessage = {
                role: 'mindy',
                content: response.text || "I processed your request but have no text response.",
                id: (Date.now() + 1).toString()
            };

            setMessages(prev => [...prev, agentMsg]);

        } catch (e: any) {
            console.error("Error sending message:", e);
            const errorMsgText = e.message || "Failed to send message.";
            setError(errorMsgText);

            // Also show error as a message bubble from the agent so user sees it
            const errorChatMsg: ChatMessage = {
                role: 'mindy',
                content: `${errorMsgText} Please try again later.`,
                id: (Date.now() + 1).toString()
            };
            setMessages(prev => [...prev, errorChatMsg]);
        } finally {
            setIsLoading(false);
            // Clear pending flag
            if (typeof window !== 'undefined') {
                localStorage.removeItem('mindy_ai_pending');
            }
        }
    }, [sessionId, userId]);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        startSession,
        hasSession: !!sessionId
    };
};