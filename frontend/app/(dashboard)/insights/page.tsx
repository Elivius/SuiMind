"use client"

import { ArrowDownLeft, ArrowUpRight, TrendingUp, Wallet, Sparkles } from "lucide-react"
import { Button, Card, Skeleton } from "@/components/ui"
import { useRouter } from "next/navigation"
import { useInsightsData } from "@/hooks/useInsightsData"
import { ExpensesPieChart, CashflowChart } from "@/components/insightsChart"
import { MindyAILogo } from "@/components/icons"

export default function InsightsPage() {
    const router = useRouter()
    const { cashflowData, expensesData, totals, isLoading } = useInsightsData()

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
                                <p className="text-white/70 font-bold text-xl sm:text-2xl">Monthly Cash Flow (Net Flow)</p>
                                <div className="flex flex-wrap items-baseline gap-3">
                                    {isLoading ? (
                                        <Skeleton className="h-12 w-48" />
                                    ) : (
                                        <>
                                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                                                {totals.thisMonthNetFlow.toFixed(2)} SUI
                                            </h2>
                                            <div className={`flex items-center gap-1 ${totals.monthOverMonthChange >= 0 ? 'text-sky-400' : 'text-red-400'}`}>
                                                {totals.monthOverMonthChange >= 0 ? <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                <span className="text-base sm:text-lg font-semibold">{totals.monthOverMonthChange >= 0 ? '+' : ''}{totals.monthOverMonthChange.toFixed(1)}% this month</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <span className="text-white/40 text-sm block">
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
                                <p className="text-white/60 text-sm">All Time Net Flow</p>
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </>
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold text-white">{totals.totalNetFlow.toFixed(2)} SUI</p>
                                        <p className="text-white/40 text-xs">{totals.inFlowTransactionCount + totals.outFlowTransactionCount} transactions</p>
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
                                <p className="text-white/60 text-sm">All Time Inflow</p>
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-3 w-20" />
                                    </>
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold text-white">{totals.totalInFlow.toFixed(2)} SUI</p>
                                        <div className="flex items-center gap-1 text-[xs] uppercase font-bold tracking-wider" style={{ color: '#00FAFF' }}>
                                            <TrendingUp className="w-3 h-3" />
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
                                <p className="text-white/60 text-sm">All Time Outflow</p>
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-3 w-20" />
                                    </>
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold text-white">{totals.totalOutFlow.toFixed(2)} SUI</p>
                                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#FF3DBC', opacity: 0.6 }}>{totals.outFlowTransactionCount} Transactions</p>
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
            <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6FBEE5] via-[#A890FE] to-[#FF3DBC] rounded-[32px] blur opacity-25 transition duration-1000" />

                <Card className="relative overflow-hidden backdrop-blur-3xl bg-gradient-to-br from-[#6FBEE5]/10 via-[#050B15]/40 to-[#A890FE]/10 border-white/10 p-6 sm:p-10 rounded-[30px]">
                    {/* Background Auras */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#6FBEE5]/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#A890FE]/10 rounded-full blur-[100px] animate-pulse delay-1000" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                        {/* Interactive Icon Orb */}
                        <div className="relative shrink-0 animate-bounce-subtle">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#6FBEE5] to-[#A890FE] blur-xl opacity-40 animate-pulse" />
                            <div className="relative w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#6FBEE5]/20 via-[#4A9FD8]/20 to-[#A890FE]/20 flex items-center justify-center border border-white/20 shadow-2xl">
                                <MindyAILogo className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent tracking-tight">
                                Mindy AI Suggestion !
                            </h3>

                            <p className="text-white/70 text-lg leading-relaxed max-w-3xl font-medium">
                                Your <span className="text-white font-bold underline decoration-[#00FAFF]/40 decoration-2 underline-offset-4">2,500 SUI</span> in the wallet could earn <span className="text-[#00FAFF] font-bold">6.8% APY</span> on Scallop (<span className="text-emerald-400 font-bold">2.6% higher</span> than current average).
                                Moving these funds could generate an additional <span className="bg-gradient-to-r from-[#00FAFF] to-[#6FBEE5] bg-clip-text text-transparent font-bold">$1,700 annually</span>.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Button
                                    onClick={() => router.push('/mindy-ai')}
                                    className="h-16 px-12 text-lg bg-gradient-to-r from-[#3B82F6] to-[#9333EA] hover:from-[#9333EA] hover:to-[#3B82F6] text-white font-black rounded-[20px] shadow-xl shadow-[#3B82F6]/20 border border-white/20 transition-all hover:scale-105 active:scale-95 group/btn"
                                >
                                    View Opportunity
                                    <ArrowUpRight className="ml-3 w-6 h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Expenses Distribution */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Expense Distribution (by Recipient)</h2>
                <ExpensesPieChart data={expensesData} isLoading={isLoading} />
            </div>
        </div>
    )
}
