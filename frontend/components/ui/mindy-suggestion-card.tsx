// Suggestion card section for Inisghts Page
// Move the suggestion card here to prevent the pie cart got re-rendered if user click regenerate suggestion button

"use client"

import { RefreshCcw, ArrowUpRight } from "lucide-react"
import { Button, Card, Skeleton } from "@/components/ui"
import { useRouter } from "next/navigation"
import { useMindyInsight, useStakingData } from "@/hooks"
import { MindyAILogo } from "@/components/icons"
import { useEffect, useState } from "react"
import { INSIGHTS_PAGE_SUGGESTIONS, getInsightsPageContextPrompt } from "@/lib/prompts"
import type { InsightsTotals, ExpenseCategory } from "@/types/insights"

interface MindySuggestionCardProps {
    balance: number
    totals: InsightsTotals | undefined
    expensesData: ExpenseCategory[]
    isLoading: boolean
}

export function MindySuggestionCard({ balance, totals, expensesData, isLoading }: MindySuggestionCardProps) {
    const router = useRouter()
    const [suggestion, setSuggestion] = useState<any>(null)
    const { data: stakingData } = useStakingData();

    const {
        insight: rawSuggestions,
        isLoading: isSuggestionsLoading,
        error: suggestionsError,
        fetchInsight: fetchSuggestions,
        regenerateInsight: regenerateSuggestions
    } = useMindyInsight()

    const handleRegenerateSuggestions = () => {
        if (!totals) return;

        regenerateSuggestions(INSIGHTS_PAGE_SUGGESTIONS, getInsightsPageContextPrompt({
            balance,
            netFlow: totals.thisMonthNetFlow,
            monthOverMonthChange: totals.monthOverMonthChange,
            topExpenses: expensesData,
            stakingApy: stakingData?.avgApy
        }))
    }

    useEffect(() => {
        if (!rawSuggestions && !isSuggestionsLoading && !suggestionsError && !isLoading && totals) {
            fetchSuggestions(INSIGHTS_PAGE_SUGGESTIONS, getInsightsPageContextPrompt({
                balance,
                netFlow: totals.thisMonthNetFlow,
                monthOverMonthChange: totals.monthOverMonthChange,
                topExpenses: expensesData,
                stakingApy: stakingData?.avgApy
            }))
        }
    }, [isLoading, balance, totals, expensesData, fetchSuggestions, rawSuggestions, isSuggestionsLoading, suggestionsError, stakingData])

    useEffect(() => {
        if (rawSuggestions) {
            try {
                const cleanJson = rawSuggestions.replace(/```json\n?|\n?```/g, "").trim();
                const parsed = JSON.parse(cleanJson);
                setSuggestion(parsed);
            } catch (e) {
                console.error("Failed to parse insight JSON:", e);
            }
        }
    }, [rawSuggestions])

    return (
        <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6FBEE5] via-[#A890FE] to-[#FF3DBC] rounded-[32px] blur opacity-25 transition duration-1000" />

            <Card className="relative overflow-hidden backdrop-blur-3xl bg-gradient-to-br from-[#6FBEE5]/10 via-[#050B15]/40 to-[#A890FE]/10 border-white/10 p-6 sm:p-10 rounded-[30px]">
                {/* Background Auras */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#6FBEE5]/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#A890FE]/10 rounded-full blur-[100px] animate-pulse delay-1000" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                    {/* Interactive Icon Orb */}
                    <div className="relative shrink-0 animate-bounce-subtle">
                        <div className="absolute inset-0 blur-xl opacity-40 animate-pulse" />
                        <div className="w-30 h-30 bg-transparent items-center justify-center">
                            <MindyAILogo className="w-30 h-30" />
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-4xl sm:text-4xl font-bold text-white tracking-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4891ee] via-[#877acc] to-[#cd666e]">Mindy AI </span> Suggestion !
                            </h3>
                            <Button
                                onClick={handleRegenerateSuggestions}
                                disabled={isSuggestionsLoading}
                                className="p-2 h-auto rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/40 hover:text-white transition-all hover:rotate-90"
                            >
                                <RefreshCcw className={`w-4 h-4 ${isSuggestionsLoading ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>

                        {isSuggestionsLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-3/4 bg-white/10" />
                                <Skeleton className="h-6 w-1/2 bg-white/10" />
                            </div>
                        ) : suggestion ? (
                            <>
                                <p className="text-white text-lg leading-relaxed font-medium">
                                    <span className="text-2xl text-[#CF9FFF] font-bold underline decoration-[#00FAFF]/40 decoration-2 underline-offset-4 pointer-events-none">
                                        {suggestion.highlightedText}
                                    </span>
                                </p>
                                <p className="text-white text-lg leading-relaxed font-medium max-w-4xl">
                                    {suggestion.body}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                    <Button
                                        onClick={() => {
                                            router.push(`/mindy-ai?prompt=${encodeURIComponent(`Tell me more about this suggestion:\n\nTitle: ${suggestion.highlightedText}\n\nDescription: ${suggestion.body}`)}`)
                                        }}
                                        className="h-16 px-12 text-lg bg-gradient-to-r from-[#3B82F6] to-[#9333EA] hover:from-[#9333EA] hover:to-[#3B82F6] text-white font-black rounded-[20px] shadow-xl shadow-[#3B82F6]/20 border border-white/20 transition-all hover:scale-105 active:scale-95 group/btn"
                                    >
                                        Learn More @ Mindy AI
                                        <ArrowUpRight className="ml-3 w-6 h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <p className="text-white/50 text-lg">Unable to generate insight at this moment. Please try again later.</p>
                        )}
                    </div>
                </div>
            </Card >
        </div >
    )
}
