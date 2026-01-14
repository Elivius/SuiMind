"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Wallet, ArrowUpRight, ArrowDownRight, Zap, Settings, Bell } from "lucide-react"
import { useState } from "react"
import Silk from "@/components/ui/Silk"
import GooeyNav from "@/components/ui/GooeyNav"

const items = [
    { label: "Home", href: "/home-page" },
    { label: "Monthly Cashflow", href: "/monthly-cashflow" },
    { label: "Recent Activity", href: "/recent-activity" },
    { label: "AI Chatbox", href: "/ai-chatbox" },
];

export default function RecentActivity() {
    const [recentTransactions] = useState([
        { id: 1, type: "receive", amount: "+150 SUI", usd: "$450.00", time: "2 min ago", from: "Cetus DEX", status: "Completed" },
        { id: 2, type: "send", amount: "-50 USDC", usd: "$50.00", time: "1 hour ago", to: "0x1a2b...3c4d", status: "Pending" },
        { id: 3, type: "swap", amount: "100 SUI → 150 USDC", usd: "$150.00", time: "3 hours ago", protocol: "Cetus", status: "Cancelled" },
        { id: 4, type: "receive", amount: "+20 SUI", usd: "$60.00", time: "5 hours ago", from: "Staking Rewards", status: "Completed" },
        { id: 5, type: "send", amount: "-10 SUI", usd: "$30.00", time: "1 day ago", to: "0x5f6g...7h8i", status: "Completed" },
        { id: 6, type: "receive", amount: "+100 SUI", usd: "$300.00", time: "2 days ago", from: "Cetus DEX", status: "Completed" },
        { id: 7, type: "send", amount: "-20 USDC", usd: "$20.00", time: "3 days ago", to: "0x9a8b...7c6d", status: "Pending" },
        { id: 8, type: "swap", amount: "50 SUI → 75 USDC", usd: "$75.00", time: "4 days ago", protocol: "Cetus", status: "Completed" },
        { id: 9, type: "receive", amount: "+30 SUI", usd: "$90.00", time: "5 days ago", from: "Staking Rewards", status: "Completed" },
        { id: 10, type: "send", amount: "-5 SUI", usd: "$15.00", time: "6 days ago", to: "0x1234...5678", status: "Cancelled" },
        { id: 11, type: "receive", amount: "+150 SUI", usd: "$450.00", time: "2 min ago", from: "Cetus DEX", status: "Completed" },
        { id: 12, type: "send", amount: "-50 USDC", usd: "$50.00", time: "1 hour ago", to: "0x1a2b...3c4d", status: "Pending" },
        { id: 13, type: "swap", amount: "100 SUI → 150 USDC", usd: "$150.00", time: "3 hours ago", protocol: "Cetus", status: "Completed" },
        { id: 14, type: "receive", amount: "+20 SUI", usd: "$60.00", time: "5 hours ago", from: "Staking Rewards", status: "Completed" },
        { id: 15, type: "send", amount: "-10 SUI", usd: "$30.00", time: "1 day ago", to: "0x5f6g...7h8i", status: "Completed" },
        { id: 16, type: "receive", amount: "+100 SUI", usd: "$300.00", time: "2 days ago", from: "Cetus DEX", status: "Completed" },
        { id: 17, type: "send", amount: "-20 USDC", usd: "$20.00", time: "3 days ago", to: "0x9a8b...7c6d", status: "Completed" },
        { id: 18, type: "swap", amount: "50 SUI → 75 USDC", usd: "$75.00", time: "4 days ago", protocol: "Cetus", status: "Completed" },
        { id: 19, type: "receive", amount: "+30 SUI", usd: "$90.00", time: "5 days ago", from: "Staking Rewards", status: "Completed" },
        { id: 20, type: "send", amount: "-5 SUI", usd: "$15.00", time: "6 days ago", to: "0x1234...5678", status: "Completed" },
    ])

    return (
        <div className="relative min-h-screen bg-[#001B39] text-white">
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
                {/* Header */}
                <header className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-40">
                    <div className="w-full px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-xl font-bold">SuiMind</h1>
                            </div>
                            <div style={{ height: '45px', position: 'relative' }}>
                                <GooeyNav
                                    items={items}
                                    particleCount={5}
                                    particleDistances={[90, 10]}
                                    particleR={100}
                                    initialActiveIndex={2}
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

                <main className="w-full px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                        <div className="lg:col-span-3">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold">Recent Activity</h2>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                                        Filter
                                    </Button>
                                    <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                                        Export
                                    </Button>
                                </div>
                            </div>

                            <Card className="border-white/20 backdrop-blur-xl bg-white/5 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/10 bg-white/5">
                                                <th className="px-6 py-4 text-sm font-semibold text-white">Activity</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-white">Amount</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-white">Details</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-white">Time</th>
                                                <th className="px-6 py-4 text-sm font-semibold text-white">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {recentTransactions.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "receive" ? "bg-green-500/20" :
                                                                tx.type === "send" ? "bg-red-500/20" : "bg-blue-500/20"
                                                                }`}>
                                                                {tx.type === "receive" ? <ArrowDownRight className="w-5 h-5 text-green-400" /> :
                                                                    tx.type === "send" ? <ArrowUpRight className="w-5 h-5 text-red-400" /> :
                                                                        <Zap className="w-5 h-5 text-blue-400" />}
                                                            </div>
                                                            <span className="capitalize font-medium text-white">{tx.type}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className={`font-semibold ${tx.type === "receive" ? "text-green-400" :
                                                            tx.type === "send" ? "text-red-400" : "text-blue-300"
                                                            }`}>{tx.amount}</p>
                                                        <p className="text-xs text-white">{tx.usd}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-white">
                                                        {tx.from && `From: ${tx.from}`}
                                                        {tx.to && `To: ${tx.to}`}
                                                        {tx.protocol && `Via: ${tx.protocol}`}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-white">
                                                        {tx.time}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.status === "Completed" ? "bg-green-500/10 text-green-400" :
                                                            tx.status === "Pending" ? "bg-yellow-500/10 text-yellow-400" :
                                                                tx.status === "Cancelled" ? "bg-red-500/10 text-red-400" :
                                                                    "bg-white/10 text-white"
                                                            }`}>
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>

                        {/* AI Chatbox */}
                        <div className="lg:col-span-1 sticky top-[100px] self-start transition-all duration-500 ease-in-out">
                            <Card className="border-white/20 backdrop-blur-xl bg-white/5 flex flex-col h-[500px] shadow-2xl shadow-blue-500/5 hover:shadow-[#6FBEE5]/10 transition-shadow duration-500">
                                <div className="p-6 h-full flex flex-col">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Zap className="w-6 h-6 text-[#6FBEE5]" />
                                        <h3 className="text-xl font-semibold text-white">AI Assistant</h3>
                                    </div>

                                    {/* Chat Messages Area */}
                                    <div className="flex-1 space-y-4 overflow-y-auto mb-6">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#6FBEE5]/20 flex items-center justify-center flex-shrink-0">
                                                <Zap className="w-4 h-4 text-[#6FBEE5]" />
                                            </div>
                                            <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] border border-white/5">
                                                <p className="text-sm text-white/90 leading-relaxed">
                                                    Hi! I can help you analyze your transaction history. Notice any patterns you'd like me to look into?
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chat Input */}
                                    <div className="mt-auto">
                                        <div className="flex gap-2 items-stretch">
                                            <input
                                                type="text"
                                                placeholder="Ask me about your activity..."
                                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#6FBEE5]/50 focus:border-[#6FBEE5]/50 transition-all text-sm"
                                            />
                                            <Button className="px-4 py-3 bg-gradient-to-r from-[#6FBEE5] to-[#4A9FCC] hover:from-[#5DAED5] hover:to-[#3A8FBC] text-white border-0 rounded-xl shadow-lg shadow-[#6FBEE5]/20">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
