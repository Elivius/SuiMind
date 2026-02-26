// Use to get insights / recommendation / suggestions from Mindy

import { useState, useCallback } from 'react';
import { createSession, sendMessageToAgent } from '@/lib/adk-service';
import { useCurrentAccount } from '@mysten/dapp-kit';

// Define what useMindyInsight will return
interface UseMindyInsightResult {
    insight: string | null;
    isLoading: boolean;
    error: string | null;
    fetchInsight: (context: string, prompt: string) => Promise<void>;
    regenerateInsight: (context: string, prompt: string) => Promise<void>;
}

export const useMindyInsight = (): UseMindyInsightResult => {
    const account = useCurrentAccount()

    const [insight, setInsight] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get session mindy ai session
    const getSession = useCallback(async () => {
        if (typeof window === 'undefined') return null;

        const userId = localStorage.getItem('mindy_ai_user_id');
        const sessionId = localStorage.getItem('mindy_ai_insight_session_id');

        if (sessionId && userId) {
            return { sessionId, userId };
        }

        // If session doesn't exist, create a new one
        try {
            const sessionData = await createSession(account?.address as string, userId || undefined);

            if (sessionData) {
                localStorage.setItem('mindy_ai_insight_session_id', sessionData.sessionId);
                localStorage.setItem('mindy_ai_user_id', sessionData.userId);
                return sessionData;
            }
        } catch (e) {
            console.error("Failed to create insight session", e);
            throw e;
        }
        return null;
    }, [account?.address]);

    // Get cached insight, if not cached, generate new insight
    const fetchInsight = useCallback(async (context: string, prompt: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // Check if the insight is cached at localStorage
            const cachedInsight = localStorage.getItem(`mindy_ai_insight_${context}`);
            if (cachedInsight) {
                setInsight(cachedInsight);
                setIsLoading(false);
                return;
            }

            // If insight is not cached
            // Generate new insight
            // 1. Get session
            const session = await getSession();
            if (!session) {
                throw new Error("Failed to initialize insight session");
            }

            // 2. Generate fresh insight
            const response = await sendMessageToAgent(session.userId, session.sessionId, prompt);

            if (response.text) {
                setInsight(response.text);
                localStorage.setItem(`mindy_ai_insight_${context}`, response.text);
            } else if (response.error === "SESSION_EXPIRED") {
                // Handle expiration by clearing and retrying once
                localStorage.removeItem('mindy_ai_insight_session_id');

                const newSession = await getSession();
                if (newSession) {
                    const retryResponse = await sendMessageToAgent(newSession.userId, newSession.sessionId, prompt);
                    if (retryResponse.text) {
                        setInsight(retryResponse.text);
                        localStorage.setItem(`mindy_ai_insight_${context}`, retryResponse.text);
                    } else if (retryResponse.error) {
                        setError(retryResponse.error);
                    }
                } else {
                    setError("Failed to re-initialize insight session");
                }
            } else {
                setError("Failed to generate insight");
            }

        } catch (e) {
            console.error("Error fetching insight", e);
            setError("An error occurred while generating insight");
        } finally {
            setIsLoading(false);
        }
    }, [getSession]);

    // Regenerate insight
    const regenerateInsight = useCallback(async (context: string, prompt: string) => {
        setIsLoading(true);
        setError(null);
        setInsight(null);

        try {
            const session = await getSession();
            if (!session) {
                throw new Error("Failed to initialize insight session");
            }

            const response = await sendMessageToAgent(session.userId, session.sessionId, prompt);

            if (response.text) {
                setInsight(response.text);
                localStorage.setItem(`mindy_ai_insight_${context}`, response.text);
            } else if (response.error === "SESSION_EXPIRED") {
                // Handle expiration by clearing and retrying once
                localStorage.removeItem('mindy_ai_insight_session_id');

                const newSession = await getSession();
                if (newSession) {
                    const retryResponse = await sendMessageToAgent(newSession.userId, newSession.sessionId, prompt);
                    if (retryResponse.text) {
                        setInsight(retryResponse.text);
                        localStorage.setItem(`mindy_ai_insight_${context}`, retryResponse.text);
                    } else if (retryResponse.error) {
                        setError(retryResponse.error);
                    }
                } else {
                    setError("Failed to re-initialize insight session");
                }
            } else {
                setError("Failed to regenerate insight");
            }
        } catch (e) {
            console.error("Error regenerating insight", e);
            setError("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }, [getSession]);

    return {
        insight,
        isLoading,
        error,
        fetchInsight,
        regenerateInsight
    };
};