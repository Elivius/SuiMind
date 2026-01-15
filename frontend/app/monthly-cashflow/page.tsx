"use client"

import { ArrowUpRight, TrendingUp, Wallet, Shield, Sparkles, Bell, Settings } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from "recharts"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import GooeyNav from "@/components/ui/GooeyNav"
import Silk from "@/components/ui/Silk"

const items = [
    { label: "Home", href: "/home" },
    { label: "Monthly Cashflow", href: "/monthly-cashflow" },
    { label: "Recent Activity", href: "/recent-activity" },
    { label: "Mindy AI", href: "/mindy-ai" },
];

// Data for testing only
const expensesData = [
    { name: "Shopping", value: 500 },
    { name: "Transaction", value: 250 },
    { name: "Bill", value: 800 },
    { name: "Other", value: 150 },
    { name: "Food", value: 300 },
];




const COLORS = Array.from({ length: 20 }, (_, i) => `url(#grad${i + 1})`);
const FLAT_COLORS = [
    "#6FBEE5", "#00FFD1", "#818CF8", "#4A9FCC", "#F472B6",
    "#FB923C", "#4ADE80", "#2DD4BF", "#A78BFA", "#F87171",
    "#60A5FA", "#34D399", "#FBBF24", "#C084FC", "#FB7185",
    "#22D3EE", "#86EFAC", "#93C5FD", "#FDA4AF", "#5EEAD4"
];


function DashboardHeader() {
    return (
        <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
            <div className="w-full px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white">SuiMind</h1>
                    </div>
                    <div style={{ height: '45px', position: 'relative' }}>
                        <GooeyNav
                            items={items}
                            particleCount={5}
                            particleDistances={[90, 10]}
                            particleR={100}
                            initialActiveIndex={1}
                            animationTime={600}
                            timeVariance={300}
                            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                            <Settings className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

function ExpensesAllocation() {
    const total = expensesData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="relative mt-2">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6FBEE5]/10 rounded-full blur-[80px]" />

            {/* Chart container */}
            <div className="relative z-10 backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[40px] p-8 shadow-2xl">
                <div className="h-[320px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6FBEE5" /><stop offset="100%" stopColor="#4A9FCC" /></linearGradient>
                                <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00FFD1" /><stop offset="100%" stopColor="#4BC0C0" /></linearGradient>
                                <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#818CF8" /><stop offset="100%" stopColor="#6366F1" /></linearGradient>
                                <linearGradient id="grad4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#0284c7" /></linearGradient>
                                <linearGradient id="grad5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F472B6" /><stop offset="100%" stopColor="#DB2777" /></linearGradient>
                                <linearGradient id="grad6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FB923C" /><stop offset="100%" stopColor="#EA580C" /></linearGradient>
                                <linearGradient id="grad7" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4ADE80" /><stop offset="100%" stopColor="#16A34A" /></linearGradient>
                                <linearGradient id="grad8" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#2DD4BF" /><stop offset="100%" stopColor="#0D9488" /></linearGradient>
                                <linearGradient id="grad9" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#A78BFA" /><stop offset="100%" stopColor="#7C3AED" /></linearGradient>
                                <linearGradient id="grad10" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F87171" /><stop offset="100%" stopColor="#DC2626" /></linearGradient>
                                <linearGradient id="grad11" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#60A5FA" /><stop offset="100%" stopColor="#2563EB" /></linearGradient>
                                <linearGradient id="grad12" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#34D399" /><stop offset="100%" stopColor="#059669" /></linearGradient>
                                <linearGradient id="grad13" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FBBF24" /><stop offset="100%" stopColor="#D97706" /></linearGradient>
                                <linearGradient id="grad14" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#C084FC" /><stop offset="100%" stopColor="#9333EA" /></linearGradient>
                                <linearGradient id="grad15" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FB7185" /><stop offset="100%" stopColor="#E11D48" /></linearGradient>
                                <linearGradient id="grad16" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#22D3EE" /><stop offset="100%" stopColor="#0891B2" /></linearGradient>
                                <linearGradient id="grad17" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#86EFAC" /><stop offset="100%" stopColor="#22C55E" /></linearGradient>
                                <linearGradient id="grad18" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#93C5FD" /><stop offset="100%" stopColor="#3B82F6" /></linearGradient>
                                <linearGradient id="grad19" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FDA4AF" /><stop offset="100%" stopColor="#F43F5E" /></linearGradient>
                                <linearGradient id="grad20" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#5EEAD4" /><stop offset="100%" stopColor="#14B8A6" /></linearGradient>
                            </defs>
                            <Pie
                                data={expensesData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={95}
                                outerRadius={125}
                                paddingAngle={8}
                                cornerRadius={12}
                                stroke="none"
                            >
                                {expensesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(10, 20, 35, 0.9)",
                                    backdropFilter: "blur(12px)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "16px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                                    padding: "12px 16px",
                                }}
                                itemStyle={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}
                                cursor={{ fill: "transparent" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Centered Total Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-white/40 text-sm font-medium uppercase tracking-[3px]">Total</span>
                        <span className="text-3xl font-bold text-white mt-1">${total}</span>
                    </div>
                </div>

                {/* Custom Legend */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                    {expensesData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ background: FLAT_COLORS[index % FLAT_COLORS.length] }}
                            />
                            <span className="text-sm text-white/60">{entry.name}</span>
                            <span className="text-sm font-semibold ml-auto">{((entry.value / total) * 100).toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function MonthlyCashflowRecords() {
    return (
        <div className="w-full h-full mt-4">
            {/* Chart area */}
            <div className="h-[380px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cashflowData} margin={{ top: 40, right: 0, left: -20, bottom: 40 }} barGap={0}>
                        <defs>
                            {/* Individual glowing gradients */}
                            <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6FBEE5" /><stop offset="100%" stopColor="#4A9FCC" stopOpacity={0.5} /></linearGradient>
                            <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00FFD1" /><stop offset="100%" stopColor="#4BC0C0" stopOpacity={0.5} /></linearGradient>
                            <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818CF8" /><stop offset="100%" stopColor="#6366F1" stopOpacity={0.5} /></linearGradient>
                            <linearGradient id="barGrad4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F472B6" /><stop offset="100%" stopColor="#DB2777" stopOpacity={0.5} /></linearGradient>
                            <linearGradient id="barGrad5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FB923C" /><stop offset="100%" stopColor="#EA580C" stopOpacity={0.5} /></linearGradient>
                            <linearGradient id="barGrad6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4ADE80" /><stop offset="100%" stopColor="#16A34A" stopOpacity={0.5} /></linearGradient>

                            {/* Glow filter */}
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="4 4"
                            stroke="rgba(255,255,255,0.08)"
                        />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#FFFFFF', fontSize: 14, fontWeight: 700, opacity: 0.9 }}
                            dy={15}
                            height={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 600 }}
                            tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(10, 20, 35, 0.95)",
                                backdropFilter: "blur(16px)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: "20px",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                                padding: "14px 18px",
                            }}
                            labelStyle={{ color: "#FFFFFF", fontWeight: "bold", marginBottom: "4px" }}
                            itemStyle={{ color: "#FFFFFF", fontSize: "15px", fontWeight: 700 }}
                            cursor={{ fill: "rgba(255,255,255,0.02)", radius: 15 }}
                        />
                        {/* Actual Glowing Data Bar */}
                        <Bar
                            dataKey="cashflow"
                            radius={[12, 12, 0, 0]}
                            barSize={32}
                            animationDuration={2000}
                            animationEasing="ease-in-out"
                            filter="url(#glow)"
                        >
                            {cashflowData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`url(#barGrad${(index % 6) + 1})`} />
                            ))}
                            <LabelList
                                dataKey="cashflow"
                                position="top"
                                offset={15}
                                formatter={(value: any) => `$${value}`}
                                style={{ fill: '#FFFFFF', fontSize: '13px', fontWeight: 'bold' }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const cashflowData = [
    { month: "Aug", cashflow: 1200 },
    { month: "Sep", cashflow: 950 },
    { month: "Oct", cashflow: 1400 },
    { month: "Nov", cashflow: 1100 },
    { month: "Dec", cashflow: 1600 },
    { month: "Jan", cashflow: 1300 },
];

export default function DashboardPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#001B39] text-white">
            {/* Silk Background */}
            <Silk
                className="fixed inset-0 z-0 pointer-events-none opacity-40"
                color="#5bafff"
                speed={3.0}
                scale={1.2}
                noiseIntensity={1.5}
                rotation={0}
            />

            <div className="relative z-10">
                <DashboardHeader />

                <main className="container mx-auto px-4 lg:px-8 py-8 space-y-5">
                    {/* Expenses Breakdowns */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                                    <span className="text-lg font-medium text-white/60">/ overview</span>
                                </div>
                            </div>
                        </div>

                        {/* Balance Card */}
                        <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-10 min-h-[550px]">
                            <div className="space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-white/100 font-bold text-2xl">Monthly Cash Flow </p>
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
                        <h2 className="text-2xl font-bold text-white">Category Distribution</h2>
                        <div>
                            <ExpensesAllocation />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
