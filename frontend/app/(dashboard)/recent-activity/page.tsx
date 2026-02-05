"use client"

import { Button, Card, Skeleton, CopyAddress } from "@/components/ui"
import { ArrowUpRight, ArrowDownLeft, Zap, ChevronDown, Repeat, Sparkles, TrendingUp, CheckCircle2, Filter, Activity, Clock, Check, Bot, Users, Square, Trash2, Info } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useGetDetailTransactions, useMindyAgent } from "@/hooks"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { processTx, formatSuiAmount, truncateAddress } from "@/lib/utils"
import { MindyAILogo } from "@/components/icons"
import { TX_DESC_STORAGE_REBATE, TX_DESC_CONTRACT_INTERACTION } from "@/lib/constants"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function RecentActivityPage() {
    const itemsPerPage = 10
    const fetchLimit = 50
    const account = useCurrentAccount()

    const [cursor, setCursor] = useState<string | null>(null)
    const [paginationHistory, setPaginationHistory] = useState<(string | null)[]>([])

    const { data: transactionData, isLoading: isTransactionLoading } = useGetDetailTransactions(fetchLimit, cursor || undefined)

    const [typeFilter, setTypeFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [timeFilter, setTimeFilter] = useState("all")
    const [mindyInput, setMindyInput] = useState("")
    const { messages: mindyMessages, isLoading: isMindyLoading, sendMessage: sendMindyMessage, startSession: startMindySession } = useMindyAgent()
    const mindyMessagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom when new Mindy messages arrive
    useEffect(() => {
        if (mindyMessages.length > 0) {
            mindyMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, [mindyMessages])

    const handleMindySend = () => {
        if (!mindyInput.trim()) return
        sendMindyMessage(mindyInput)
        setMindyInput("")
    }

    // Dropdown States
    const [isTypeOpen, setIsTypeOpen] = useState(false)
    const [isStatusOpen, setIsStatusOpen] = useState(false)
    const [isTimeOpen, setIsTimeOpen] = useState(false)

    const typeRef = useRef<HTMLDivElement>(null)
    const statusRef = useRef<HTMLDivElement>(null)
    const timeRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (typeRef.current && !typeRef.current.contains(event.target as Node)) setIsTypeOpen(false)
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) setIsStatusOpen(false)
            if (timeRef.current && !timeRef.current.contains(event.target as Node)) setIsTimeOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Destructure transactions and pageInfo from the new hook return
    const rawTransactions = transactionData?.transactions || [];
    const pageInfo = transactionData?.pageInfo;

    const recentTransactionsWithCursor = rawTransactions
        .map((tx: any) => ({
            ...processTx(tx, account?.address),
            cursor: tx.cursor,
            rawTimestamp: tx.effects?.timestamp // Keep raw timestamp for time filtering
        }))
        .filter((item: any) => item !== null && item.id); // Ensure processTx succeeded

    const filteredTransactionsWithCursor = recentTransactionsWithCursor.filter((tx: any) => {
        const matchesType = typeFilter === "all" || tx.type === typeFilter
        const matchesStatus = statusFilter === "all" || tx.status === statusFilter

        // Time filter logic using raw timestamp
        let matchesTime = true
        if (timeFilter !== "all") {
            const txTime = tx.timestampMs || 0;
            const now = Date.now();

            if (timeFilter === "24h") {
                const oneDayInMs = 24 * 60 * 60 * 1000;
                matchesTime = (now - txTime) <= oneDayInMs;
            }
            if (timeFilter === "7d") {
                const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
                matchesTime = (now - txTime) <= sevenDaysInMs;
            }
            if (timeFilter === "30d") {
                const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
                matchesTime = (now - txTime) <= thirtyDaysInMs;
            }
        }

        return matchesType && matchesStatus && matchesTime
    })

    // Alias for compatibility with existing render code
    const paginatedTransactions = filteredTransactionsWithCursor.slice(0, itemsPerPage);

    const handleNextPage = () => {
        // If we have more than itemsPerPage filtered items, we can just move the cursor to the 10th item
        // But since we over-fetched, the "next page" logic is tricky.
        // We use the cursor of the LAST DISPLAYED item to fetch the next batch "before" it.
        if (paginatedTransactions.length > 0) {
            const lastItem = paginatedTransactions[paginatedTransactions.length - 1];
            setPaginationHistory((prev) => [...prev, cursor]);
            setCursor(lastItem.cursor)
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-6">
                        <div className="flex items-baseline gap-2">
                            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                            <span className="text-2xl font-medium text-white/60">/ Recent Activity</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 md:justify-end flex-1">
                            {/* Type Filter */}
                            <div className="relative" ref={typeRef}>
                                <button
                                    onClick={() => setIsTypeOpen(!isTypeOpen)}
                                    className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl pl-4 pr-10 h-11 hover:border-white/20 hover:bg-white/10 transition-all w-[180px]"
                                >
                                    <Filter className="w-3.5 h-3.5 text-[#6FBEE5] mr-3" />
                                    <span className="text-white text-[11px] font-bold uppercase tracking-widest truncate">
                                        {typeFilter === 'all' ? 'All Types' : typeFilter}
                                    </span>
                                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-transform duration-300 ${isTypeOpen ? 'rotate-180 text-[#6FBEE5]' : ''}`} />
                                </button>

                                {isTypeOpen && (
                                    <div className="absolute top-[calc(100%+8px)] right-0 w-full bg-[#050B15]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 z-50 shadow-2xl animate-in fade-in zoom-in duration-200 origin-top">
                                        {[
                                            { label: 'All Types', value: 'all' },
                                            { label: 'Send', value: 'send' },
                                            { label: 'Receive', value: 'receive' },
                                            { label: 'Swap', value: 'swap' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setTypeFilter(opt.value); setIsTypeOpen(false); handleFilterChange(); }}
                                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${typeFilter === opt.value ? 'bg-[#6FBEE5]/20 text-[#6FBEE5]' : 'text-white hover:bg-white/5'}`}
                                            >
                                                {opt.label}
                                                {typeFilter === opt.value && <Check className="w-3 h-3" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status Filter */}
                            <div className="relative" ref={statusRef}>
                                <button
                                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                                    className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl pl-4 pr-10 h-11 hover:border-white/20 hover:bg-white/10 transition-all w-[180px]"
                                >
                                    <Activity className="w-3.5 h-3.5 text-purple-400 mr-3" />
                                    <span className="text-white text-[11px] font-bold uppercase tracking-widest truncate">
                                        {statusFilter === 'all' ? 'All Status' : statusFilter}
                                    </span>
                                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-transform duration-300 ${isStatusOpen ? 'rotate-180 text-purple-400' : ''}`} />
                                </button>

                                {isStatusOpen && (
                                    <div className="absolute top-[calc(100%+8px)] right-0 w-full bg-[#050B15]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 z-50 shadow-2xl animate-in fade-in zoom-in duration-200 origin-top">
                                        {[
                                            { label: 'All Status', value: 'all' },
                                            { label: 'Completed', value: 'Completed' },
                                            { label: 'Pending', value: 'Pending' },
                                            { label: 'Cancelled', value: 'Cancelled' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setStatusFilter(opt.value); setIsStatusOpen(false); handleFilterChange(); }}
                                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${statusFilter === opt.value ? 'bg-purple-500/20 text-purple-400' : 'text-white hover:bg-white/5'}`}
                                            >
                                                {opt.label}
                                                {statusFilter === opt.value && <Check className="w-3 h-3" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Time Filter */}
                            <div className="relative" ref={timeRef}>
                                <button
                                    onClick={() => setIsTimeOpen(!isTimeOpen)}
                                    className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl pl-4 pr-10 h-11 hover:border-white/20 hover:bg-white/10 transition-all w-[180px]"
                                >
                                    <Clock className="w-3.5 h-3.5 text-emerald-400 mr-3" />
                                    <span className="text-white text-[11px] font-bold uppercase tracking-widest truncate">
                                        {timeFilter === 'all' ? 'All Time' :
                                            timeFilter === '24h' ? 'Last 24h' :
                                                timeFilter === '7d' ? 'Last 7d' : 'Last 30d'}
                                    </span>
                                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-transform duration-300 ${isTimeOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                                </button>

                                {isTimeOpen && (
                                    <div className="absolute top-[calc(100%+8px)] right-0 w-full bg-[#050B15]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 z-50 shadow-2xl animate-in fade-in zoom-in duration-200 origin-top">
                                        {[
                                            { label: 'All Time', value: 'all' },
                                            { label: 'Last 24 Hours', value: '24h' },
                                            { label: 'Last 7 Days', value: '7d' },
                                            { label: 'Last 30 Days', value: '30d' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setTimeFilter(opt.value); setIsTimeOpen(false); handleFilterChange(); }}
                                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${timeFilter === opt.value ? 'bg-emerald-500/20 text-emerald-400' : 'text-white hover:bg-white/5'}`}
                                            >
                                                {opt.label}
                                                {timeFilter === opt.value && <Check className="w-3 h-3" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
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
                                <tbody className="divide-y divide-white/10 pt-12 -mt-12">
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
                                                        }`}>{tx.type === "receive" ? "+" : tx.type === "send" ? "-" : ""}{formatSuiAmount(tx.amount || 0)} SUI</p>
                                                    <p className="text-xs text-white">{tx.usd}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-white">
                                                    <div className="flex flex-col gap-0.5">
                                                        {tx.label === "Sui Storage Rebate" ? (
                                                            <div className="flex items-center gap-1.5 group/tooltip relative z-50">
                                                                <span className="text-[#6FBEE5] font-medium cursor-help">♻️ {tx.label}</span>
                                                                <Info className="w-3.5 h-3.5 text-white/60" />

                                                                {/* Tooltip */}
                                                                <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] p-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-xs text-white invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 transition-all z-50 pointer-events-none">
                                                                    {TX_DESC_STORAGE_REBATE}
                                                                    <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-black/80"></div>
                                                                </div>
                                                            </div>
                                                        ) : tx.label === "Smart Contract Interaction" ? (
                                                            <div className="flex items-center gap-1.5 group/tooltip relative z-50">
                                                                <span className="text-purple-400 font-medium cursor-help">⚡ {tx.label}</span>
                                                                <Info className="w-3.5 h-3.5 text-white/60" />

                                                                {/* Tooltip */}
                                                                <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] p-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-xs text-white invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 transition-all z-50 pointer-events-none">
                                                                    {TX_DESC_CONTRACT_INTERACTION}
                                                                    <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-black/80"></div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {tx.from && (
                                                                    <div className="flex items-center">
                                                                        <span className="mr-1">From:</span>
                                                                        <CopyAddress fullAddress={tx.from} displayAddress={truncateAddress(tx.from)} />
                                                                    </div>
                                                                )}
                                                                {tx.to && (
                                                                    <div className="flex items-center">
                                                                        <span className="mr-1">To:</span>
                                                                        <CopyAddress fullAddress={tx.to} displayAddress={truncateAddress(tx.to)} />
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
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
                                                    }`}>{tx.type === "receive" ? "+" : tx.type === "send" ? "-" : ""}{formatSuiAmount(tx.amount || 0)} SUI</p>
                                                <p className="text-[10px] text-white/50">{tx.usd}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="text-[11px] text-white/70 flex-1 flex flex-col gap-0.5">
                                                <div>
                                                    {tx.label === "Sui Storage Rebate" ? (
                                                        <div className="flex items-center gap-1.5 group/tooltip relative z-50">
                                                            <span className="text-[#6FBEE5] font-medium cursor-help">♻️ {tx.label}</span>
                                                            <Info className="w-3.5 h-3.5 text-white/60" />

                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] p-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-xs text-white invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 transition-all z-50 pointer-events-none">
                                                                {TX_DESC_STORAGE_REBATE}
                                                                <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-black/80"></div>
                                                            </div>
                                                        </div>
                                                    ) : tx.label === "Smart Contract Interaction" ? (
                                                        <div className="flex items-center gap-1.5 group/tooltip relative z-50">
                                                            <span className="text-purple-400 font-medium cursor-help">⚡ {tx.label}</span>
                                                            <Info className="w-3.5 h-3.5 text-white/60" />

                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] p-2 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-xs text-white invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 transition-all z-50 pointer-events-none">
                                                                {TX_DESC_CONTRACT_INTERACTION}
                                                                <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-black/80"></div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {tx.from && (
                                                                <div className="flex items-center gap-1 text-white">
                                                                    <span>From:</span>
                                                                    <CopyAddress fullAddress={tx.from} displayAddress={truncateAddress(tx.from)} />
                                                                </div>
                                                            )}
                                                            {tx.to && (
                                                                <div className="flex items-center gap-1 text-white">
                                                                    <span>To:</span>
                                                                    <CopyAddress fullAddress={tx.to} displayAddress={truncateAddress(tx.to)} />
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
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

                        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-center sm:justify-between gap-4 flex-wrap">
                            <p className="text-sm text-white/50">
                                {isTransactionLoading ? "Loading..." : `Showing ${paginatedTransactions.length} transaction(s)`}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePrevPage}
                                    disabled={paginationHistory.length === 0 || isTransactionLoading}
                                    className="border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-auto"
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={
                                        isTransactionLoading ||
                                        paginatedTransactions.length < itemsPerPage ||
                                        (!pageInfo?.hasPreviousPage && filteredTransactionsWithCursor.length <= itemsPerPage)
                                    }
                                    className="border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-auto"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Mindy AI */}
                <div className="xl:col-span-1 xl:sticky xl:top-[100px] xl:self-start transition-all duration-500 ease-in-out">
                    <Card className="border-white/20 backdrop-blur-xl bg-white/5 flex flex-col h-[650px] overflow-hidden shadow-2xl">
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <MindyAILogo className="w-15 h-15 text-[#6FBEE5]" />
                                    <h3 className="text-3xl font-bold text-white">Mindy AI</h3>
                                </div>
                                {mindyMessages.length > 0 && (
                                    <button
                                        onClick={() => startMindySession({ forceNew: true })}
                                        disabled={isMindyLoading}
                                        className="p-2 rounded-full hover:bg-white/10 text-white/30 hover:text-red-400 transition-all disabled:opacity-50"
                                        title="New Chat"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Chat Messages Area */}
                            <div className="flex-1 space-y-4 overflow-y-auto mb-6 scrollbar-thin scrollbar-thumb-white/10">
                                {mindyMessages.length === 0 ? (
                                    <>
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                                                <MindyAILogo className="w-8 h-8 text-[#6FBEE5]" />
                                            </div>
                                            <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] border border-white/5">
                                                <p className="text-sm text-white/90 leading-relaxed">
                                                    Hi! I can help you analyze your transaction history. Notice any patterns you'd like me to look into?
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quick Prompts - Colorful & Interactive */}
                                        <div className="flex flex-wrap gap-2.5 pt-5 pl-1 relative pb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                            <button
                                                onClick={() => sendMindyMessage("Analyze my transaction history")}
                                                disabled={isMindyLoading}
                                                className="group flex items-center gap-2 text-sm px-5 py-2.5 rounded-2xl bg-[#6FBEE5]/10 border border-[#6FBEE5]/20 text-[#6FBEE5] hover:bg-[#6FBEE5] hover:text-white transition-all font-bold -rotate-1 -translate-y-0.5 hover:rotate-0 hover:translate-y-0 shadow-lg shadow-[#6FBEE5]/10 hover:shadow-[#6FBEE5]/20 disabled:opacity-50"
                                            >
                                                <Sparkles className="w-4 h-4" />
                                                Analyze history
                                            </button>
                                            <button
                                                onClick={() => sendMindyMessage("Show me recurring transactions")}
                                                disabled={isMindyLoading}
                                                className="group flex items-center gap-2 text-sm px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all font-bold rotate-1 translate-y-0.5 hover:rotate-0 hover:translate-y-0 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:opacity-50"
                                            >
                                                <TrendingUp className="w-4 h-4" />
                                                Show recurring
                                            </button>
                                            <button
                                                onClick={() => sendMindyMessage("Check risks in my transactions")}
                                                disabled={isMindyLoading}
                                                className="group flex items-center gap-2 text-sm px-5 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold -rotate-0.5 translate-x-0.5 hover:rotate-0 hover:translate-x-0 shadow-lg shadow-red-500/10 hover:shadow-red-500/20 disabled:opacity-50"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Check risks
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {mindyMessages.map((msg, idx) => (
                                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                <div className={`w-8 h-8 bg-transparent rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'mindy' ? 'bg-[#6FBEE5]/20 border-[#6FBEE5]/30' : 'bg-purple-500/20 border-purple-500/30'}`}>
                                                    {msg.role === 'mindy' ? <MindyAILogo className="w-8 h-8 text-[#6FBEE5]" /> : <Users className="w-4 h-4 text-purple-300" />}
                                                </div>
                                                <div className={`px-4 py-3 max-w-[85%] border shadow-lg ${msg.role === 'mindy'
                                                    ? 'bg-white/10 rounded-2xl rounded-tl-none border-white/5 text-white/90'
                                                    : 'bg-purple-500/20 rounded-2xl rounded-tr-none border-purple-500/10 text-white'
                                                    }`}>
                                                    <div className="text-sm leading-relaxed break-words">
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                p: ({ node: _node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                                h1: ({ node: _node, ...props }) => <h1 className="text-2xl font-bold text-white mt-6 mb-4" {...props} />,
                                                                h2: ({ node: _node, ...props }) => <h2 className="text-xl font-bold text-white mt-5 mb-3" {...props} />,
                                                                h3: ({ node: _node, ...props }) => <h3 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                                                                strong: ({ node: _node, ...props }) => <span className="font-bold text-white" {...props} />,
                                                                ul: ({ node: _node, ...props }) => <ul className="list-disc ml-4 mt-2 mb-2 space-y-1" {...props} />,
                                                                ol: ({ node: _node, ...props }) => <ol className="list-decimal ml-4 mt-2 mb-2 space-y-1" {...props} />,
                                                                li: ({ node: _node, ...props }) => <li {...props} />,
                                                                table: ({ node: _node, ...props }) => <div className="overflow-x-auto my-4"><table className="w-full border-collapse border border-white/20 text-sm" {...props} /></div>,
                                                                thead: ({ node: _node, ...props }) => <thead className="bg-white/10" {...props} />,
                                                                tbody: ({ node: _node, ...props }) => <tbody {...props} />,
                                                                tr: ({ node: _node, ...props }) => <tr className="border-b border-white/10 last:border-0" {...props} />,
                                                                th: ({ node: _node, ...props }) => <th className="px-4 py-2 text-left font-bold text-white border-r border-white/10 last:border-0" {...props} />,
                                                                td: ({ node: _node, ...props }) => <td className="px-4 py-2 text-white/80 border-r border-white/10 last:border-0" {...props} />,
                                                                a: ({ node: _node, ...props }) => <a className="text-[#6FBEE5] hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                                hr: ({ node: _node, ...props }) => <hr className="my-4 border-t border-white/60" {...props} />
                                                            }}
                                                        >
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {isMindyLoading && (
                                            <div className="flex gap-3">
                                                <div className="bg-transparent w-8 h-8 rounded-full bg-[#6FBEE5]/20 flex items-center justify-center flex-shrink-0">
                                                    <MindyAILogo className="w-8 h-8 text-[#6FBEE5]" />
                                                </div>
                                                <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 border border-white/5">
                                                    <div className="flex space-x-2">
                                                        <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                        <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                        <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={mindyMessagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Premium Chat Input - Matching Mindy Page Style */}
                            <div className="mt-auto px-1 pb-1">
                                <div className="max-w-4xl mx-auto w-full relative group">
                                    {/* The Liquid Glowing Animated Border Wrap - Smoother Version */}
                                    <div className="absolute -inset-[4px] bg-gradient-to-r from-[#6FBEE5] via-[#A890FE] via-[#FF3DBC] via-[#00FFD1] via-[#FF3DBC] via-[#A890FE] to-[#6FBEE5] rounded-[2.2rem] sm:rounded-[3.7rem] opacity-40 blur-xl group-focus-within:opacity-70 transition-all duration-1000 animate-border-flow" />
                                    <div className="absolute -inset-[2px] bg-gradient-to-r from-[#6FBEE5] via-[#A890FE] via-[#FF3DBC] via-[#00FFD1] via-[#FF3DBC] via-[#A890FE] to-[#6FBEE5] rounded-[2.1rem] sm:rounded-[3.6rem] opacity-100 animate-border-flow" />

                                    <div className="relative bg-[#050B15] backdrop-blur-3xl rounded-[2rem] sm:rounded-[3.5rem] py-3 px-4 sm:p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transition-all">
                                        <div className="flex flex-col gap-3">
                                            <textarea
                                                value={mindyInput}
                                                onChange={(e) => setMindyInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault()
                                                        handleMindySend()
                                                    }
                                                }}
                                                disabled={isMindyLoading}
                                                placeholder="Ask Mindy AI anything..."
                                                rows={1}
                                                className="w-full bg-transparent text-white placeholder:text-white/20 focus:outline-none resize-none text-lg py-1 px-1 font-normal leading-relaxed scrollbar-none disabled:opacity-50"
                                            />

                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={handleMindySend}
                                                    disabled={isMindyLoading || !mindyInput.trim()}
                                                    className={`cursor-pointer w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 ${isMindyLoading
                                                        ? "bg-white/10 scale-100 opacity-100 cursor-wait"
                                                        : mindyInput.trim()
                                                            ? "bg-gradient-to-r from-[#3B82F6] to-[#9333EA] opacity-100 scale-100 shadow-[0_0_10px_rgba(147,51,234,0.3)]"
                                                            : "bg-white/5 opacity-0 scale-50 pointer-events-none"
                                                        }`}
                                                >
                                                    {isMindyLoading ? (
                                                        <Square className="w-4 h-4 fill-current animate-pulse" />
                                                    ) : (
                                                        <ArrowUpRight className="w-6 h-6" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
