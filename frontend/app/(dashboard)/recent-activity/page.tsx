"use client"

import { Button, Card, Skeleton } from "@/components/ui"
import { ArrowUpRight, ArrowDownLeft, Zap, ChevronDown, Repeat } from "lucide-react"
import { useState } from "react"
import { useGetTransactions } from "@/hooks"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { processTx } from "@/lib/utils"

export default function RecentActivity() {
    const itemsPerPage = 10
    const account = useCurrentAccount()

    const [cursor, setCursor] = useState<string | null>(null)
    const [paginationHistory, setPaginationHistory] = useState<(string | null)[]>([])

    const { data: transactionData, isLoading: isTransactionLoading } = useGetTransactions(itemsPerPage, cursor || undefined)

    const [typeFilter, setTypeFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [timeFilter, setTimeFilter] = useState("all")

    // Destructure nodes and pageInfo from the new hook return
    const nodes = transactionData?.nodes || [];
    const pageInfo = transactionData?.pageInfo;

    const recentTransactions = nodes
        .map((tx) => processTx(tx, account?.address))
        .filter((tx): tx is NonNullable<typeof tx> => tx !== null);

    const filteredTransactions = recentTransactions.filter(tx => {
        const matchesType = typeFilter === "all" || tx.type === typeFilter
        const matchesStatus = statusFilter === "all" || tx.status === statusFilter

        // Time filter logic (mocked since 'time' is a relative string in the data)
        let matchesTime = true
        if (timeFilter !== "all" && tx.time) {
            const timeStr = tx.time.toString();
            if (timeFilter === "24h") matchesTime = timeStr.includes("min") || timeStr.includes("hour") || timeStr.includes("secs")
            if (timeFilter === "7d") matchesTime = !timeStr.includes("/")
        }

        return matchesType && matchesStatus && matchesTime
    })

    // Alias for compatibility with existing render code
    const paginatedTransactions = filteredTransactions;

    const handleNextPage = () => {
        if (pageInfo?.hasPreviousPage && pageInfo?.startCursor) {
            setPaginationHistory((prev) => [...prev, cursor]);
            setCursor(pageInfo.startCursor)
        }
    }

    const handlePrevPage = () => {
        if (paginationHistory.length > 0) {
            const prevCursor = paginationHistory[paginationHistory.length - 1];
            setCursor(prevCursor);
            setPaginationHistory((prev) => prev.slice(0, -1));
        } else {
            // Fallback reset
            setCursor(null);
            setPaginationHistory([]);
        }
    }

    const handleFilterChange = () => {
        setCursor(null);
        setPaginationHistory([]);
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
                                    {isTransactionLoading ? (
                                        // Skeleton Rows
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <tr key={i}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Skeleton className="h-10 w-10 rounded-full" />
                                                        <Skeleton className="h-4 w-16" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 space-y-1">
                                                    <Skeleton className="h-5 w-20" />
                                                    <Skeleton className="h-3 w-10" />
                                                </td>
                                                <td className="px-6 py-4 space-y-1">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-20" />
                                                </td>
                                                <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                                                <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                                            </tr>
                                        ))
                                    ) : paginatedTransactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-white/50">
                                                No transactions found matching your filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedTransactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${tx.type === "receive" ? "bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/20" :
                                                            tx.type === "send" ? "bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/20" : "bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/20"
                                                            }`}>
                                                            {tx.type === "receive" ? <ArrowDownLeft className="w-5 h-5 text-white stroke-[3px]" /> :
                                                                tx.type === "send" ? <ArrowUpRight className="w-5 h-5 text-white stroke-[3px]" /> :
                                                                    <Repeat className="w-5 h-5 text-white stroke-[3px]" />}
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
                                                    <div className="flex flex-col gap-0.5">
                                                        {tx.from && <span>From: {tx.from}</span>}
                                                        {tx.to && <span>To: {tx.to}</span>}
                                                    </div>
                                                    {tx.gas_fee && <div className="text-xs text-white/50 mt-1">Gas Fee: {tx.gas_fee}</div>}
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
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile List */}
                        <div className="md:hidden divide-y divide-white/10">
                            {isTransactionLoading ? (
                                // Skeleton List Items
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="w-8 h-8 rounded-full" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-4 w-20" />
                                                    <Skeleton className="h-3 w-12" />
                                                </div>
                                            </div>
                                            <div className="space-y-1 flex flex-col items-end">
                                                <Skeleton className="h-4 w-16" />
                                                <Skeleton className="h-3 w-10" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <Skeleton className="h-3 w-32" />
                                            <Skeleton className="h-5 w-16 rounded-full" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                paginatedTransactions.map((tx) => (
                                    <div key={tx.id} className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${tx.type === "receive" ? "bg-gradient-to-br from-green-400 to-green-600" :
                                                    tx.type === "send" ? "bg-gradient-to-br from-red-400 to-red-600" : "bg-gradient-to-br from-blue-400 to-blue-600"
                                                    }`}>
                                                    {tx.type === "receive" ? <ArrowDownLeft className="w-4 h-4 text-white stroke-[3px]" /> :
                                                        tx.type === "send" ? <ArrowUpRight className="w-4 h-4 text-white stroke-[3px]" /> :
                                                            <Repeat className="w-4 h-4 text-white stroke-[3px]" />}
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
                                            <div className="text-[11px] text-white/70 truncate flex-1 flex flex-col gap-0.5">
                                                <div className="truncate">
                                                    {tx.from && `From: ${tx.from}`}
                                                    {tx.to && `To: ${tx.to}`}
                                                </div>
                                                {tx.gas_fee && <div className="text-white/50">Gas Fee: {tx.gas_fee}</div>}
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${tx.status === "Completed" ? "bg-green-500/10 text-green-500" :
                                                tx.status === "Pending" ? "bg-yellow-500/10 text-yellow-400" :
                                                    tx.status === "Cancelled" ? "bg-red-500/10 text-red-400" :
                                                        "bg-white/10 text-white"
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination Controls */}
                        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between gap-4">
                            <p className="text-sm text-white/50">
                                {isTransactionLoading ? "Loading..." : `Showing ${filteredTransactions.length} transaction(s)`}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePrevPage}
                                    disabled={paginationHistory.length === 0 || isTransactionLoading}
                                    className="border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={!pageInfo?.hasPreviousPage || isTransactionLoading}
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
