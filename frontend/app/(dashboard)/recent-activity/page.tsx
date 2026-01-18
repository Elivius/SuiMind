"use client"

import { Button, Card } from "@/components/ui"
import { ArrowUpRight, ArrowDownRight, Zap, ChevronDown } from "lucide-react"
import { useState } from "react"

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
        { id: 20, type: "send", amount: "-5 SUI", usd: "$15.00", time: "6 days ago", to: "gggg", status: "Completed" },
    ])

    const [typeFilter, setTypeFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [timeFilter, setTimeFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredTransactions = recentTransactions.filter(tx => {
        const matchesType = typeFilter === "all" || tx.type === typeFilter
        const matchesStatus = statusFilter === "all" || tx.status === statusFilter

        // Time filter logic (mocked since 'time' is a relative string in the data)
        let matchesTime = true
        if (timeFilter !== "all") {
            if (timeFilter === "24h") matchesTime = tx.time.includes("min") || tx.time.includes("hour")
            if (timeFilter === "7d") matchesTime = !tx.time.includes("month") // simplistic mock
        }

        return matchesType && matchesStatus && matchesTime
    })

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleFilterChange = () => {
        setCurrentPage(1)
    }

    return (
        <div className="w-full px-6 py-8">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                <div className="xl:col-span-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                        <h2 className="text-2xl sm:text-3xl font-bold">Recent Activity</h2>
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Type Filter */}
                            <div className="relative group">
                                <select
                                    className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6FBEE5]/50 hover:bg-white/10 transition-all cursor-pointer"
                                    value={typeFilter}
                                    onChange={(e) => { setTypeFilter(e.target.value); handleFilterChange(); }}
                                >
                                    <option value="all" className="bg-[#001B39]">All Types</option>
                                    <option value="send" className="bg-[#001B39]">Send</option>
                                    <option value="receive" className="bg-[#001B39]">Receive</option>
                                    <option value="swap" className="bg-[#001B39]">Swap</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                            </div>

                            {/* Status Filter */}
                            <div className="relative group">
                                <select
                                    className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6FBEE5]/50 hover:bg-white/10 transition-all cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange(); }}
                                >
                                    <option value="all" className="bg-[#001B39]">All Status</option>
                                    <option value="Completed" className="bg-[#001B39]">Completed</option>
                                    <option value="Pending" className="bg-[#001B39]">Pending</option>
                                    <option value="Cancelled" className="bg-[#001B39]">Cancelled</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                            </div>

                            {/* Time Filter */}
                            <div className="relative group">
                                <select
                                    className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6FBEE5]/50 hover:bg-white/10 transition-all cursor-pointer"
                                    value={timeFilter}
                                    onChange={(e) => { setTimeFilter(e.target.value); handleFilterChange(); }}
                                >
                                    <option value="all" className="bg-[#001B39]">All Time</option>
                                    <option value="24h" className="bg-[#001B39]">Last 24 Hours</option>
                                    <option value="7d" className="bg-[#001B39]">Last 7 Days</option>
                                    <option value="30d" className="bg-[#001B39]">Last 30 Days</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <Card className="border-white/20 backdrop-blur-xl bg-white/5 overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
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
                                    {paginatedTransactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "receive" ? "bg-green-500/60" :
                                                        tx.type === "send" ? "bg-red-500/60" : "bg-blue-500/60"
                                                        }`}>
                                                        {tx.type === "receive" ? <ArrowDownRight className="w-5 h-5 text-green-500" /> :
                                                            tx.type === "send" ? <ArrowUpRight className="w-5 h-5 text-red-500" /> :
                                                                <Zap className="w-5 h-5 text-blue-500" />}
                                                    </div>
                                                    <span className="capitalize font-medium text-white">{tx.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className={`font-semibold ${tx.type === "receive" ? "text-green-500" :
                                                    tx.type === "send" ? "text-red-500" : "text-blue-500"
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
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.status === "Completed" ? "bg-green-500/10 text-green-500" :
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

                        {/* Mobile List */}
                        <div className="md:hidden divide-y divide-white/10">
                            {paginatedTransactions.map((tx) => (
                                <div key={tx.id} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "receive" ? "bg-sky-500/20" :
                                                tx.type === "send" ? "bg-red-500/20" : "bg-blue-500/20"
                                                }`}>
                                                {tx.type === "receive" ? <ArrowDownRight className="w-4 h-4 text-green-500" /> :
                                                    tx.type === "send" ? <ArrowUpRight className="w-4 h-4 text-red-500" /> :
                                                        <Zap className="w-4 h-4 text-blue-500" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white capitalize">{tx.type}</p>
                                                <p className="text-[10px] text-white/50">{tx.time}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-bold ${tx.type === "receive" ? "text-green-500" :
                                                tx.type === "send" ? "text-red-500" : "text-blue-500"
                                                }`}>{tx.amount}</p>
                                            <p className="text-[10px] text-white/50">{tx.usd}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-[11px] text-white/70 truncate flex-1">
                                            {tx.from && `From: ${tx.from}`}
                                            {tx.to && `To: ${tx.to}`}
                                            {tx.protocol && `Via: ${tx.protocol}`}
                                        </p>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${tx.status === "Completed" ? "bg-green-500/10 text-green-500" :
                                            tx.status === "Pending" ? "bg-yellow-500/10 text-yellow-400" :
                                                tx.status === "Cancelled" ? "bg-red-500/10 text-red-400" :
                                                    "bg-white/10 text-white"
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between gap-4">
                            <p className="text-sm text-white/50">
                                Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-white px-2">
                                    Page {currentPage} of {totalPages || 1}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Mindy AI */}
                <div className="xl:col-span-1 xl:sticky xl:top-[100px] xl:self-start transition-all duration-500 ease-in-out">
                    <Card className="border-white/20 backdrop-blur-xl bg-white/5 flex flex-col h-[500px] shadow-2xl shadow-blue-500/5 hover:shadow-[#6FBEE5]/10 transition-shadow duration-500">
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-6">
                                <Zap className="w-6 h-6 text-[#6FBEE5]" />
                                <h3 className="text-xl font-semibold text-white">Mindy AI</h3>
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
        </div>
    )
}
