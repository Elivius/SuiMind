"use client"

import { ArrowDownLeft, ArrowUpRight, TrendingUp, Wallet, Sparkles } from "lucide-react"
import { Button, Card, Skeleton, MindySuggestionCard } from "@/components/ui"
import { useRouter } from "next/navigation"
import { useInsightsData, useGetBalances } from "@/hooks"
import { ExpensesPieChart, CashflowChart } from "@/components/insightsChart"
import { MindyAILogo } from "@/components/icons"
import { useEffect, useState } from "react"
import { mistToSui } from "@/lib/utils"

export default function InsightsPage() {
    const router = useRouter()
    const { cashflowData, expensesData, totals, isLoading } = useInsightsData()

    // =========== Use for AI Suggestions ===========
    const { data: balanceData } = useGetBalances()
    const balance = balanceData?.totalBalance ? mistToSui(balanceData.totalBalance) : 0

    return (
        <div className="w-full px-6 py-8 space-y-6">
            {/* Header */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                        <span className="text-2xl font-medium text-white/60">/ Insights</span>
                    </div>
                </div>

                {/* Cashflow Card */}
                <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-6 sm:p-12 min-h-auto lg:min-h-[650px]">
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className="text-white font-bold text-xl sm:text-3xl">Monthly Cash Flow (Net Flow)</p>
                                <div className="flex flex-wrap items-baseline gap-3">
                                    {isLoading ? (
                                        <Skeleton className="h-12 w-48" />
                                    ) : (
                                        <>
                                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                                                {totals.thisMonthNetFlow.toFixed(4)} SUI
                                            </h2>
                                            <div className={`flex items-center gap-1 ${totals.monthOverMonthChange >= 0 ? 'text-sky-400' : 'text-red-400'}`}>
                                                {totals.monthOverMonthChange >= 0 ? <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                <span className="text-base sm:text-lg font-semibold">{totals.monthOverMonthChange >= 0 ? '+' : ''}{totals.monthOverMonthChange.toFixed(2)}% this month</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <span className="text-white text-sm block">
                                    {isLoading ? <Skeleton className="h-4 w-32 inline-block" /> : `${totals.thisMonthTransactionCount} total transactions`}
                                </span>
                            </div>
                        </div>
                        <CashflowChart data={cashflowData} isLoading={isLoading} />
                    </div>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="backdrop-blur-xl bg-gradient-to-r from-white/5 via-white/5 to-[#6FBEE5]/30 border-white/10 p-6 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xl text-blue-400 font-bold">All Time Net Flow</p>
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </>
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold text-white">{totals.totalNetFlow.toFixed(4)} SUI</p>
                                        <p className="flex items-center gap-1 text-[xs] uppercase font-bold tracking-wider text-blue-400">{totals.inFlowTransactionCount + totals.outFlowTransactionCount} transactions</p>
                                    </>
                                )}
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6FBEE5]/20 to-[#4A9FD8]/20 flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-[#6FBEE5]" />
                            </div>
                        </div>
                    </Card>

                    <Card className="backdrop-blur-xl bg-gradient-to-r from-white/5 via-white/5 to-emerald-500/30 border-white/10 p-6 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-green-400 text-xl font-bold">All Time Inflow</p>
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-3 w-20" />
                                    </>
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold text-white">{totals.totalInFlow.toFixed(4)} SUI</p>
                                        <div className="flex items-center gap-1 text-[xs] uppercase font-bold tracking-wider text-green-400">
                                            <span>{totals.inFlowTransactionCount} transactions</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#00FAFF]/10 border border-[#00FAFF]/20 flex items-center justify-center shadow-lg shadow-[#00FAFF]/10">
                                <ArrowDownLeft className="w-6 h-6" style={{ color: '#00FAFF' }} />
                            </div>
                        </div>
                    </Card>

                    <Card className="backdrop-blur-xl bg-gradient-to-r from-white/5 via-white/5 to-rose-500/30 border-white/10 p-6 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-red-400 text-xl font-bold">All Time Outflow</p>
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-3 w-20" />
                                    </>
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold text-white">{totals.totalOutFlow.toFixed(4)} SUI</p>
                                        <p className="flex items-center gap-1 text-[xs] uppercase font-bold tracking-wider text-red-400">{totals.outFlowTransactionCount} Transactions</p>
                                    </>
                                )}
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#FF3DBC]/10 border border-[#FF3DBC]/20 flex items-center justify-center shadow-lg shadow-[#FF3DBC]/10">
                                <ArrowUpRight className="w-6 h-6" style={{ color: '#FF3DBC' }} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* AI Recommendations */}
            <MindySuggestionCard
                balance={balance}
                totals={totals}
                expensesData={expensesData}
                isLoading={isLoading}
            />

            {/* Expenses Distribution */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Expense Distribution (by Recipient)</h2>
                <ExpensesPieChart data={expensesData} isLoading={isLoading} />
            </div>
        </div>
    )
}
