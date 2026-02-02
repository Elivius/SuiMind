"use client"

import { useState, useEffect } from "react"
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Wallet, Sparkles } from "lucide-react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine } from "recharts"
import { Button, Card } from "@/components/ui"
import { useRouter } from "next/navigation"

// Data for testing only
const expensesData = [
    { name: "Shopping", value: 500 },
    { name: "Transaction", value: 250 },
    { name: "Bill", value: 800 },
    { name: "Other", value: 150 },
    { name: "Food", value: 300 },
]

const COLORS = Array.from({ length: 20 }, (_, i) => `url(#grad${i + 1})`)
const FLAT_COLORS = [
    "#6FBEE5", "#00FFD1", "#818CF8", "#4A9FCC", "#F472B6",
    "#FB923C", "#4ADE80", "#2DD4BF", "#A78BFA", "#F87171",
    "#60A5FA", "#34D399", "#FBBF24", "#C084FC", "#FB7185",
    "#22D3EE", "#86EFAC", "#93C5FD", "#FDA4AF", "#5EEAD4"
]

const cashflowData = [
    { month: "Aug", income: 4200, expenses: 10000 },
    { month: "Sep", income: 3800, expenses: 2850 },
    { month: "Oct", income: 3400, expenses: 3400 },
    { month: "Nov", income: 4100, expenses: 3000 },
    { month: "Dec", income: 5200, expenses: 10000 },
    { month: "Jan", income: 4600, expenses: 3300 },
].map(item => ({ ...item, net: item.income - item.expenses }))

function ExpensesAllocation() {
    const total = expensesData.reduce((acc, curr) => acc + curr.value, 0)

    return (
        <div className="relative mt-2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6FBEE5]/10 rounded-full blur-[80px]" />
            <div className="relative z-10 backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[30px] sm:rounded-[40px] p-5 sm:p-8 shadow-2xl">
                <div className="h-[320px] relative">
                    <ResponsiveContainer width="100%" height="100%" className="chart-reset">
                        <PieChart>
                            <defs>
                                <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6FBEE5" /><stop offset="100%" stopColor="#4A9FCC" /></linearGradient>
                                <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00FFD1" /><stop offset="100%" stopColor="#4BC0C0" /></linearGradient>
                                <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#818CF8" /><stop offset="100%" stopColor="#6366F1" /></linearGradient>
                                <linearGradient id="grad4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#0284c7" /></linearGradient>
                                <linearGradient id="grad5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F472B6" /><stop offset="100%" stopColor="#DB2777" /></linearGradient>
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-white/40 text-sm font-medium uppercase tracking-[3px]">Total</span>
                        <span className="text-3xl font-bold text-white mt-1">${total}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                    {expensesData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ background: FLAT_COLORS[index % FLAT_COLORS.length] }} />
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
    const dataMax = Math.max(...cashflowData.map((i) => i.net));
    const dataMin = Math.min(...cashflowData.map((i) => i.net));
    const off = dataMax <= 0 ? 0 : dataMax >= 0 && dataMin >= 0 ? 1 : dataMax / (dataMax - dataMin);

    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkSize = () => setIsDesktop(window.innerWidth >= 1024);
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    return (
        <div className="w-full h-full mt-4">
            <div className="h-[350px] sm:h-[520px] w-full mt-4 relative group">
                {/* Advanced Visual Enhancers */}
                <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-[#6FBEE5]/5 to-transparent rounded-[40px] pointer-events-none opacity-50" />

                <ResponsiveContainer width="100%" height="100%" className="chart-reset">
                    <ComposedChart data={cashflowData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barGap={12} className="outline-none" style={{ outline: 'none' }}>
                        <defs>
                            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00FAFF" />
                                <stop offset="100%" stopColor="#00FAFF" stopOpacity={0.3} />
                            </linearGradient>
                            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF3DBC" />
                                <stop offset="100%" stopColor="#FF3DBC" stopOpacity={0.3} />
                            </linearGradient>
                            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset={0} stopColor="#4ADE80" stopOpacity={1} />
                                <stop offset={off} stopColor="#4ADE80" stopOpacity={1} />
                                <stop offset={off} stopColor="#F87171" stopOpacity={1} />
                                <stop offset={1} stopColor="#F87171" stopOpacity={1} />
                            </linearGradient>
                            <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="5" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        <CartesianGrid vertical={false} strokeDasharray="0" stroke="rgba(255,255,255,0.03)" />

                        <XAxis
                            dataKey="month"
                            axisLine={{ stroke: '#FFFFFF', strokeWidth: 1 }}
                            tickLine={false}
                            tick={{
                                fill: '#FFFFFF',
                                fontSize: isDesktop ? 13 : 10,
                                fontWeight: isDesktop ? 900 : 700,
                                letterSpacing: isDesktop ? '2px' : '1px'
                            }}
                            dy={isDesktop ? 15 : 10}
                            interval={0}
                        />

                        <YAxis
                            axisLine={{ stroke: '#FFFFFF', strokeWidth: 1 }}
                            tickLine={false}
                            tick={{ fill: '#FFFFFF', fontSize: isDesktop ? 11 : 10, fontWeight: 700 }}
                            tickFormatter={(value) => {
                                const absValue = Math.abs(value);
                                const formatted = absValue >= 1000 ? (absValue / 1000).toFixed(0) + 'k' : absValue;
                                return value < 0 ? `-$${formatted}` : `$${formatted}`;
                            }}
                            width={35}
                        />

                        <ReferenceLine y={0} stroke="rgba(255, 255, 255, 1)" strokeWidth={1} />

                        <Tooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const net = payload[0].payload.net;
                                    const isNegative = net < 0;
                                    return (
                                        <div className="bg-[#050B15]/95 backdrop-blur-3xl border border-white/10 rounded-[24px] p-5 shadow-2xl min-w-[200px]">
                                            <p className="text-white/30 text-[9px] font-black uppercase tracking-[3px] mb-4 text-center border-b border-white/5 pb-2">
                                                {payload[0].payload.month} Transaction Delta
                                            </p>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black uppercase" style={{ color: '#00FAFF' }}>Income</span>
                                                    <span className="text-white font-black">${payload[0].payload.income.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black uppercase" style={{ color: '#FF3DBC' }}>Expenses</span>
                                                    <span className="text-white font-black">${payload[0].payload.expenses.toLocaleString()}</span>
                                                </div>
                                                <div className="h-[1px] bg-white/5 my-2" />
                                                <div className="flex items-center justify-between">
                                                    <span className={`${isNegative ? 'text-red-400' : 'text-[#6FBEE5]'} text-[10px] font-black uppercase`}>
                                                        Net Flow
                                                    </span>
                                                    <span className={`${isNegative ? 'text-red-400' : 'text-white'} text-lg font-black`}>
                                                        {isNegative ? '-' : ''}${Math.abs(net).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            content={({ payload }) => (
                                <div className={`flex ${isDesktop ? 'gap-6 mb-10 mr-4' : 'gap-4 mb-6 mr-1'} justify-end`}>
                                    {payload?.filter(entry => entry.value !== 'Net Flow').map((entry, index) => {
                                        const color = entry.value === 'Income' ? '#00FAFF' : '#FF3DBC';
                                        return (
                                            <div key={index} className={`flex items-center ${isDesktop ? 'gap-2' : 'gap-1.5'}`}>
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                                <span className={`${isDesktop ? 'text-[11px] font-black tracking-widest' : 'text-[9px] font-bold tracking-wider'} uppercase text-white`}>
                                                    {entry.value}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        />

                        <Bar
                            dataKey="income"
                            name="Income"
                            fill="url(#incomeGrad)"
                            radius={[isDesktop ? 6 : 4, isDesktop ? 6 : 4, 0, 0]}
                            barSize={isDesktop ? 24 : 12}
                            stroke="none"
                            style={{ outline: 'none' }}
                        />

                        <Bar
                            dataKey="expenses"
                            name="Expenses"
                            fill="url(#expenseGrad)"
                            radius={[isDesktop ? 6 : 4, isDesktop ? 6 : 4, 0, 0]}
                            barSize={isDesktop ? 24 : 12}
                            stroke="none"
                            style={{ outline: 'none' }}
                        />

                        <Line
                            type="monotone"
                            dataKey="net"
                            name="Net Flow"
                            stroke="url(#lineGrad)"
                            strokeWidth={4}
                            dot={{ r: 0 }}
                            activeDot={{ r: 6, fill: '#FFF', strokeWidth: 3 }}
                            filter="url(#line-glow)"
                            animationDuration={3000}
                            style={{ outline: 'none' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const router = useRouter()
    return (
        <div className="w-full px-6 py-8 space-y-6">
            {/* Expenses Breakdowns */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                            <span className="text-2xl font-medium text-white/60">/ Insights</span>
                        </div>
                    </div>
                </div>

                {/* Balance Card */}
                <Card className="backdrop-blur-xl bg-white/5 border-white/10 p-6 sm:p-12 min-h-auto lg:min-h-[650px]">
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className="text-white/70 font-bold text-xl sm:text-2xl">Monthly Cash Flow </p>
                                <div className="flex flex-wrap items-baseline gap-3">
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">$401.84K</h2>
                                    <div className="flex items-center gap-1 text-sky-400">
                                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="text-base sm:text-lg font-semibold">+2.34%</span>
                                    </div>
                                </div>
                                <p className="text-white/40 text-sm">+$9,234.12 last 24h</p>
                            </div>
                        </div>
                        <MonthlyCashflowRecords />
                    </div>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="backdrop-blur-xl bg-gradient-to-r from-white/5 via-white/5 to-[#6FBEE5]/30 border-white/10 p-6 overflow-hidden">
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

                    <Card className="backdrop-blur-xl bg-gradient-to-r from-white/5 via-white/5 to-emerald-500/30 border-white/10 p-6 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-white/60 text-sm">Monthly Income</p>
                                <p className="text-2xl font-bold text-white">$93.38K</p>
                                <div className="flex items-center gap-1 text-[xs] uppercase font-bold tracking-wider" style={{ color: '#00FAFF' }}>
                                    <TrendingUp className="w-3 h-3" />
                                    <span>5.2% APY</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-[#00FAFF]/10 border border-[#00FAFF]/20 flex items-center justify-center shadow-lg shadow-[#00FAFF]/10">
                                <ArrowDownLeft className="w-6 h-6" style={{ color: '#00FAFF' }} />
                            </div>
                        </div>
                    </Card>

                    <Card className="backdrop-blur-xl bg-gradient-to-r from-white/5 via-white/5 to-rose-500/30 border-white/10 p-6 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-white/60 text-sm">Monthly Expenses</p>
                                <p className="text-2xl font-bold text-white">$25.18K</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#FF3DBC', opacity: 0.6 }}>47 Transactions</p>
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
                            <div className="relative w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#6FBEE5] via-[#4A9FD8] to-[#A890FE] flex items-center justify-center border border-white/20 shadow-2xl">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            <div className="space-y-1">
                                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent tracking-tight">
                                    Mindy AI Suggestion !
                                </h3>
                            </div>

                            <p className="text-white/70 text-lg leading-relaxed max-w-3xl font-medium">
                                Your <span className="text-white font-bold underline decoration-[#00FAFF]/40 decoration-2 underline-offset-4">2,500 SUI</span> in the wallet could earn <span className="text-[#00FAFF] font-bold">6.8% APY</span> on Scallop (<span className="text-emerald-400 font-bold">2.6% higher</span> than current average).
                                Moving these funds could generate an additional <span className="bg-gradient-to-r from-[#00FAFF] to-[#6FBEE5] bg-clip-text text-transparent font-bold">$1,700 annually</span>.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Button
                                    onClick={() => router.push('/mindy-ai')}
                                    className="h-16 px-12 text-lg bg-gradient-to-r from-[#6FBEE5] to-[#A890FE] hover:from-[#A890FE] hover:to-[#6FBEE5] text-white font-black rounded-[20px] shadow-xl shadow-[#6FBEE5]/20 border border-white/20 transition-all hover:scale-105 active:scale-95 group/btn"
                                >
                                    View Opportunity
                                    <ArrowUpRight className="ml-3 w-6 h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Assets Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Category Distribution</h2>
                <div>
                    <ExpensesAllocation />
                </div>
            </div>
        </div>
    )
}
