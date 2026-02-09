"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { Skeleton } from "@/components/ui"
import type { ExpensesPieChartProps } from "@/types/insights"
import { truncateAddress } from "@/lib/utils"

const CHART_GRADIENT_COLORS = Array.from({ length: 20 }, (_, i) => `url(#grad${i + 1})`)

const CHART_FLAT_COLORS = [
    "#6FBEE5", "#00FFD1", "#818CF8", "#4A9FCC", "#F472B6",
    "#FB923C", "#4ADE80", "#2DD4BF", "#A78BFA", "#F87171",
    "#60A5FA", "#34D399", "#FBBF24", "#C084FC", "#FB7185",
    "#22D3EE", "#86EFAC", "#93C5FD", "#FDA4AF", "#5EEAD4"
]

// Shared tooltip style
const CHART_TOOLTIP_STYLE = {
    backgroundColor: "rgba(10, 20, 35, 0.9)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    padding: "12px 16px",
}

const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, value, name } = props
    const RADIAN = Math.PI / 180
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 5) * cos
    const sy = cy + (outerRadius + 5) * sin
    const mx = cx + (outerRadius + 25) * cos
    const my = cy + (outerRadius + 25) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 25
    const ey = my
    const textAnchor = cos >= 0 ? "start" : "end"

    return (
        <g>
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth={1} />
            <circle cx={ex} cy={ey} r={2} fill="rgba(255,255,255,0.5)" stroke="none" />
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 8}
                y={ey - 9}
                textAnchor={textAnchor}
                fill="white"
                className="font-bold text-[11px]"
            >
                {name.startsWith('0x') ? truncateAddress(name) : name}
            </text>
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 8}
                y={ey + 9}
                textAnchor={textAnchor}
                fill="#6FBEE5"
                className="font-black text-[10px] tracking-tight"
            >
                {`${value.toFixed(4)} SUI`}
            </text>
        </g>
    )
}

export function ExpensesPieChart({ data, isLoading }: ExpensesPieChartProps) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0)

    if (isLoading) {
        return (
            <div className="relative mt-2">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6FBEE5]/10 rounded-full blur-[80px]" />
                <div className="relative z-10 backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[30px] sm:rounded-[40px] p-5 sm:p-8 shadow-2xl">
                    <div className="h-[450px] flex items-center justify-center">
                        <Skeleton className="w-[200px] h-[200px] rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="w-3 h-3 rounded-full" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-8 ml-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative mt-2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6FBEE5]/10 rounded-full blur-[80px]" />
            <div className="relative z-10 backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[30px] sm:rounded-[40px] p-5 sm:p-8 shadow-2xl">
                <div className="h-[450px] relative">
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
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={130}
                                outerRadius={165}
                                paddingAngle={8}
                                cornerRadius={12}
                                stroke="none"
                                label={renderCustomizedLabel}
                                labelLine={false}
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_GRADIENT_COLORS[index % CHART_GRADIENT_COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-white/40 text-sm font-medium uppercase tracking-[3px]">Total</span>
                        <span className="text-3xl font-bold text-white mt-1">{total.toFixed(4)} SUI</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                    {data.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ background: CHART_FLAT_COLORS[index % CHART_FLAT_COLORS.length] }} />
                            <span className="text-sm text-white/60 truncate">{entry.name.startsWith('0x') ? truncateAddress(entry.name) : entry.name}</span>
                            <span className="text-sm font-semibold ml-auto">{total > 0 ? ((entry.value / total) * 100).toFixed(2) : 0}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
