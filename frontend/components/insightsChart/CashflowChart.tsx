"use client"

import { useState, useEffect } from "react"
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine, Tooltip } from "recharts"
import { Skeleton } from "@/components/ui"
import type { CashflowChartProps } from "@/types/insights"

export function CashflowChart({ data, isLoading }: CashflowChartProps) {
    const dataMax = Math.max(...data.map((i) => i.netFlow), 0)
    const dataMin = Math.min(...data.map((i) => i.netFlow), 0)
    const allZero = dataMax === 0 && dataMin === 0
    const off = dataMax <= 0 ? 0 : dataMax >= 0 && dataMin >= 0 ? 1 : dataMax / (dataMax - dataMin)

    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
        checkSize()
        window.addEventListener('resize', checkSize)
        return () => window.removeEventListener('resize', checkSize)
    }, [])

    if (isLoading) {
        return (
            <div className="w-full h-full mt-4">
                <div className="h-[350px] sm:h-[520px] w-full mt-4 flex items-center justify-center">
                    <Skeleton className="w-full h-full rounded-3xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full mt-4">
            <div className="h-[350px] sm:h-[520px] w-full mt-4 relative group">
                <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-[#6FBEE5]/5 to-transparent rounded-[40px] pointer-events-none opacity-50" />

                <ResponsiveContainer width="100%" height="100%" className="chart-reset">
                    <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barGap={12} className="outline-none" style={{ outline: 'none' }}>
                        <defs>
                            <linearGradient id="inFlowGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00FAFF" />
                                <stop offset="100%" stopColor="#00FAFF" stopOpacity={0.3} />
                            </linearGradient>
                            <linearGradient id="outFlowGrad" x1="0" y1="0" x2="0" y2="1">
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
                                const absValue = Math.abs(value)
                                const formatted = absValue >= 1000 ? (absValue / 1000).toFixed(1) + 'k' : absValue.toFixed(4)
                                return value < 0 ? `-${formatted}` : `${formatted}`
                            }}
                            width={45}
                        />

                        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

                        <Tooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const netFlow = payload[0].payload.netFlow
                                    const isZero = Math.abs(netFlow) < 0.0001
                                    const isNegative = netFlow < 0 && !isZero
                                    const netLabelColor = isZero ? 'text-white' : isNegative ? 'text-red-400' : 'text-green-400'
                                    const netValueColor = isZero ? 'text-white' : isNegative ? 'text-red-400' : 'text-green-400'
                                    return (
                                        <div className="bg-[#050B15]/95 backdrop-blur-3xl border border-white/10 rounded-[24px] p-5 shadow-2xl min-w-[200px]">
                                            <p className="text-white text-[12px] font-black uppercase tracking-[3px] mb-4 text-center border-b border-white/5 pb-2">
                                                {payload[0].payload.month} Transaction Delta
                                            </p>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[12px] font-black uppercase" style={{ color: '#00FAFF' }}>Inflow</span>
                                                    <span className="text-white font-black">{payload[0].payload.inFlow.toFixed(4)} SUI</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[12px] font-black uppercase" style={{ color: '#FF3DBC' }}>Outflow</span>
                                                    <span className="text-white font-black">{payload[0].payload.outFlow.toFixed(4)} SUI</span>
                                                </div>
                                                <div className="h-[1px] bg-white/5 my-2" />
                                                <div className="flex items-center justify-between">
                                                    <span className={`${netLabelColor} text-[10px] font-black uppercase`}>Net Flow</span>
                                                    <span className={`${netValueColor} text-lg font-black`}>
                                                        {isZero ? '' : isNegative ? '-' : ''}{Math.abs(netFlow).toFixed(4)} SUI
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />

                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            content={({ payload }) => (
                                <div className={`flex ${isDesktop ? 'gap-6 mb-10 mr-4' : 'gap-4 mb-6 mr-1'} justify-end`}>
                                    {payload?.filter(entry => entry.value !== 'Net Flow').map((entry, index) => {
                                        const color = entry.value === 'Inflow' ? '#00FAFF' : '#FF3DBC'
                                        return (
                                            <div key={index} className={`flex items-center ${isDesktop ? 'gap-2' : 'gap-1.5'}`}>
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                                <span className={`${isDesktop ? 'text-[11px] font-black tracking-widest' : 'text-[9px] font-bold tracking-wider'} uppercase text-white`}>
                                                    {entry.value}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        />

                        <Bar dataKey="inFlow" name="Inflow" fill="url(#inFlowGrad)" radius={[isDesktop ? 6 : 4, isDesktop ? 6 : 4, 0, 0]} barSize={isDesktop ? 24 : 12} stroke="none" style={{ outline: 'none' }} />
                        <Bar dataKey="outFlow" name="Outflow" fill="url(#outFlowGrad)" radius={[isDesktop ? 6 : 4, isDesktop ? 6 : 4, 0, 0]} barSize={isDesktop ? 24 : 12} stroke="none" style={{ outline: 'none' }} />
                        <Line type="monotone" dataKey="netFlow" name="Net Flow" stroke="url(#lineGrad)" strokeWidth={4} dot={{ r: 0 }} activeDot={{ r: 6, fill: '#FFF', strokeWidth: 3 }} filter="url(#line-glow)" animationDuration={3000} style={{ outline: 'none' }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
