"use client"

import { ArrowUpRight, TrendingUp, Wallet, Shield, Sparkles } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Data for testing only
const portfolioData = [
    { name: "Stocks", value: 400 },
    { name: "Bonds", value: 300 },
    { name: "Crypto", value: 300 },
    { name: "Cash", value: 200 },
];

const cashflowData = [
    { month: "Aug", cashflow: 1200 },
    { month: "Sep", cashflow: 950 },
    { month: "Oct", cashflow: 1400 },
    { month: "Nov", cashflow: 1100 },
    { month: "Dec", cashflow: 1600 },
    { month: "Jan", cashflow: 1300 },
];

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];


function DashboardNav() {
    return (
        <div className="relative mb-2">
            {/* Background glow */}
            <div className="absolute -top-8 -left-12 w-80 h-35 bg-gradient-to-r from-[#6FBEE5]/30 to-[#4A9FD8]/30 blur-3xl" />

            <nav className="relative z-10 flex justify-between items-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-b-2xl p-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <span className="text-white/60">/ Overview</span>
                </div>

                <Button className="bg-gradient-to-r from-[#6FBEE5] to-[#4A9FD8] hover:opacity-90 text-white border-0">
                    <Wallet className="mr-2 w-4 h-4" />
                    Connect Wallet
                </Button>
            </nav>
        </div>
    )
}

function ExpensesAllocation() {
    return (
        <div className="relative mt-6">
            {/* Background glow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-r from-[#6FBEE5]/25 to-[#4A9FD8]/25 blur-3xl" />

            {/* Chart container */}
            <div className="relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">Portfolio Allocation</h3>
                    <p className="text-sm text-white/60">Asset distribution</p>
                </div>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={portfolioData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={70}
                                outerRadius={100}
                                label
                            >
                                {portfolioData.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(0,0,0,0.8)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#fff",
                                }}
                                labelStyle={{
                                    color: "#ffffff",
                                    fontWeight: 600,
                                }}
                                itemStyle={{
                                    color: "#ffffff",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

function MonthlyCashflowRecords() {
    return (
        <div className="w-full h-full">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">
                    Monthly Cash Flow
                </h3>
                <p className="text-sm text-white/60">
                    Last 6 months
                </p>
            </div>

            {/* Chart area (FIXED HEIGHT) */}
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cashflowData}>
                        <XAxis
                            dataKey="month"
                            stroke="rgba(255, 255, 255, 1)"
                        />
                        <YAxis
                            stroke="rgba(255, 255, 255, 1)"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(0,0,0,0.85)",
                                border: "1px solid rgba(255,255,255,0.15)",
                            }}
                            labelStyle={{ color: "#fff" }}
                            itemStyle={{ color: "#fff" }}
                            cursor={{ fill: "rgba(255,255,255,0.1)" }}
                        />
                        <Bar
                            dataKey="cashflow"
                            radius={[10, 10, 0, 0]}
                            fill="#5AADEB"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        // <div className="min-h-screen bg-gradient-to-tr from-[#6FBEE5] via-[#4A9FD8] to-[#00FFD1]"> Another options for the background color 1
        // <div className="min-h-screen bg-gradient-to-br from-[#E0F7FA] via-[#B2EBF2] to-[#80DEEA]"> Another options for the background color 2
        <div className="min-h-screen bg-gray-900">
            <DashboardNav />

            <main className="container mx-auto px-4 lg:px-8 py-8 space-y-5">
                {/* Portfolio Overview */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Portfolio</h1>
                            <p className="text-white/60">Track your Sui assets in real-time</p>
                        </div>
                    </div>

                    {/* Balance Card */}
                    <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-10 min-h-[520px]">
                        <div className="space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-white/100 font-bold text-2xl">Cash Flow </p>
                                    <div className="flex items-baseline gap-3">
                                        <h2 className="text-5xl font-bold text-white">$401.84K</h2>
                                        <div className="flex items-center gap-1 text-green-400">
                                            <ArrowUpRight className="w-5 h-5" />
                                            <span className="text-lg font-semibold">+2.34%</span>
                                        </div>
                                    </div>
                                    <p className="text-white/40 text-sm">+$9,234.12 last 24h</p>
                                </div>
                            </div>

                            <MonthlyCashflowRecords />
                        </div>
                    </Card>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-white/60 text-sm">Available Balance</p>
                                    <p className="text-2xl font-bold text-white">$283.28K</p>
                                    <p className="text-white/40 text-xs">8,542 SUI</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6FBEE5]/20 to-[#4A9FD8]/20 flex items-center justify-center">
                                    <Wallet className="w-6 h-6 text-[#6FBEE5]" />
                                </div>
                            </div>
                        </Card>

                        <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-white/60 text-sm">Income</p>
                                    <p className="text-2xl font-bold text-white">$93.38K</p>
                                    <div className="flex items-center gap-1 text-green-400 text-xs">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>5.2% APY</span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6FBEE5]/20 to-[#4A9FD8]/20 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-[#6FBEE5]" />
                                </div>
                            </div>
                        </Card>

                        <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-white/60 text-sm">Expenses</p>
                                    <p className="text-2xl font-bold text-white">$25.18K</p>
                                    <p className="text-white/40 text-xs">47 items</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6FBEE5]/20 to-[#4A9FD8]/20 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-[#6FBEE5]" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* AI Recommendations */}
                <Card className="backdrop-blur-xl bg-gradient-to-br from-[#6FBEE5]/10 to-[#4A9FD8]/10 border-white/20 p-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6FBEE5] to-[#4A9FD8] flex items-center justify-center shrink-0">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div className="space-y-3 flex-1">
                            <h3 className="text-xl font-semibold text-white">AI Recommendation</h3>
                            <p className="text-white/80 leading-relaxed">
                                Your 2,500 SUI in the wallet could earn 6.8% APY on Scallop (2.6% higher than current average). Moving
                                these funds could generate an additional $1,700 annually.
                            </p>
                            <Button className="bg-white text-[#001B39] hover:bg-white/90">View Opportunity</Button>
                        </div>
                    </div>
                </Card>

                {/* Assets Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Expenses Allocation</h2>
                    <div>
                        <ExpensesAllocation />
                    </div>
                </div>
            </main>
        </div>
    )
}
