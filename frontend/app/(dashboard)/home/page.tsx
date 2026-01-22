"use client"

import { Button, Card } from "@/components/ui"
import {
  TrendingUp, ArrowUpRight, ArrowDownRight, ArrowDownLeft, Zap, Pencil, Eye, CheckCircle2,
  X, Repeat, Loader2
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useModal, useGetBalances } from "@/hooks"

export default function WalletDashboard() {
  const router = useRouter()
  const { data: balanceData, isLoading: isBalanceLoading } = useGetBalances()

  const [salary, setSalary] = useState("0")
  const [activeSalary, setActiveSalary] = useState("0")
  const [passiveSalary, setPassiveSalary] = useState("0")

  // Use reusable modal hook for all modals
  const insightModal = useModal()
  const salaryModal = useModal()
  const expensesModal = useModal()

  const [expenseCategories] = useState([
    { id: 1, name: "Rent & Utilities", amount: "1200", icon: "🏠" },
    { id: 2, name: "Groceries", amount: "400", icon: "🛒" },
    { id: 3, name: "Transportation", amount: "150", icon: "🚗" },
    { id: 4, name: "Entertainment", amount: "200", icon: "🎬" },
    { id: 5, name: "Healthcare", amount: "100", icon: "🏥" },
  ])

  const calculateBalance = () => {
    const salaryNum = Number.parseFloat(salary) || 0
    const totalExpenses = expenseCategories.reduce((acc, curr) => acc + Number(curr.amount), 0)
    return salaryNum - totalExpenses
  }

  // Convert MIST to SUI (1 SUI = 1,000,000,000 MIST)
  const walletBalance = balanceData?.totalBalance ? Number(balanceData.totalBalance) / 1_000_000_000 : 0
  const totalExpenses = expenseCategories.reduce((acc, curr) => acc + Number(curr.amount), 0)
  const balance = calculateBalance()

  const [recentTransactions] = useState([
    { id: 1, type: "receive", amount: "+150 SUI", usd: "$450.00", time: "2 min ago", from: "Cetus DEX" },
    { id: 2, type: "send", amount: "-50 USDC", usd: "$50.00", time: "1 hour ago", to: "0x1a2b...3c4d" },
    { id: 3, type: "swap", amount: "100 SUI → 150 USDC", usd: "$150.00", time: "3 hours ago", protocol: "Cetus" },
    { id: 4, type: "swap", amount: "100 SUI → 150 USDC", usd: "$150.00", time: "3 hours ago", protocol: "Cetus" },
  ])

  const [suggestions] = useState([
    {
      id: 1,
      title: "Optimize Your Savings",
      description: "You could save 15% more by reducing discretionary spending. Consider setting aside $500 monthly.",
      icon: "💰",
      priority: "high",
    },
    {
      id: 2,
      title: "Investment Opportunity",
      description: "Based on your surplus, investing in DeFi protocols could yield 8-12% APY on stablecoins.",
      icon: "📈",
      priority: "medium",
    },
    {
      id: 3,
      title: "Budget Alert",
      description: "Your expenses are trending upward. Review your spending categories to identify areas to optimize.",
      icon: "⚠️",
      priority: "medium",
    },
    {
      id: 4,
      title: "Emergency Fund",
      description: "Build an emergency fund of 3-6 months of expenses for financial security.",
      icon: "🛡️",
      priority: "low",
    },
  ])

  return (
    <div className="w-full px-6 py-8">
      {/* Main Balance Card */}
      <Card className="border-white/20 backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/5 mb-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6FBEE5]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative p-5 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left side: Balance + AI Insight */}
            <div className="flex-1">
              <p className="text-white/70 text-base sm:text-xl font-bold mb-2">Total Balance</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold break-all" style={{ color: "white" }}>
                  {isBalanceLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-white/30" />
                    </div>
                  ) : (
                    `${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SUI`
                  )}
                </h2>
                {/* AI Insight beside the number */}
                <div
                  className="inline-flex flex-col px-5 sm:px-7 py-3 sm:py-5 rounded-xl bg-[#6FBEE5]/10 border border-[#6FBEE5]/20 cursor-pointer hover:bg-[#6FBEE5]/20 transition-all self-start sm:self-center"
                  onClick={insightModal.open}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-[#6FBEE5]" />
                    <h4 className="text-sm font-semibold text-white">AI Insight</h4>
                  </div>
                  <p className="text-xs text-white/70">Click for advice</p>
                </div>
              </div>
            </div>

            {/* Right side: Send & Receive Buttons */}
            <div className="flex flex-row lg:flex-col gap-3">
              <Button
                className="flex-1 lg:flex-none px-4 sm:px-8 py-4 sm:py-7 text-sm sm:text-base font-semibold bg-gradient-to-r from-[#6FBEE5] to-[#4A9FCC] hover:from-[#5DAED5] hover:to-[#3A8FBC] text-white border-0 rounded-xl shadow-lg shadow-[#6FBEE5]/20 hover:shadow-[#6FBEE5]/40 transition-all"
              >
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                <span className="hidden sm:inline">Send</span>
                <span className="sm:hidden">Send</span>
              </Button>
              <Button
                className="flex-1 lg:flex-none px-4 sm:px-8 py-4 sm:py-7 text-sm sm:text-base font-semibold bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#22C55E] text-white border-0 rounded-xl shadow-lg shadow-[#22C55E]/20 hover:shadow-[#22C55E]/40 transition-all"
              >
                <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                <span className="hidden sm:inline">Receive</span>
                <span className="sm:hidden">Receive</span>
              </Button>
            </div>
          </div>


        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="md:col-span-2 xl:col-span-2">
          <Card className="border-white/20 backdrop-blur-xl bg-white/5 lg:h-[70vh]">
            <div className="p-6">
              <Button
                variant="ghost"
                className="justify-start text-2xl sm:text-3xl text-white font-black mb-10 p-0 h-auto hover:bg-transparent hover:scale-[1.05] transition-transform"
                onClick={() => router.push('/insights')}
              >
                Monthly Cashflow
              </Button>
              <div className="space-y-6">
                {/* Salary Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="salary" className="text-sm font-medium text-white">
                      Monthly Salary
                    </label>
                    <button
                      type="button"
                      onClick={salaryModal.open}
                      className="cursor-pointer group flex items-center gap-2 text-[#6FBEE5] hover:text-[#5DAED5] transition-all hover:scale-105 active:scale-95"
                    >
                      <Pencil className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-base font-bold underline underline-offset-4 decoration-[#6FBEE5]/40 group-hover:decoration-[#5DAED5]">
                        Edit Salary
                      </span>
                    </button>
                  </div>

                  {/* Active/Passive Display */}
                  <div className="flex gap-6 mb-4">
                    <div className="text-xs sm:text-sm text-white/60 font-medium uppercase tracking-wider">
                      Active: <span className="text-[#6FBEE5] font-bold text-base sm:text-lg">${Number(activeSalary).toLocaleString()}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-white/60 font-medium uppercase tracking-wider">
                      Passive: <span className="text-[#6FBEE5] font-bold text-base sm:text-lg">${Number(passiveSalary).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-3xl font-black">$</span>
                    <input
                      id="salary"
                      type="number"
                      placeholder="0.00"
                      value={salary}
                      readOnly
                      className="w-full pl-12 pr-6 py-6 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none transition-all text-3xl font-black cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Expenses Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="expenses" className="text-sm font-medium text-white">
                      Monthly Expenses
                    </label>
                    <button
                      type="button"
                      onClick={expensesModal.open}
                      className="cursor-pointer group flex items-center gap-2 text-[#6FBEE5] hover:text-[#5DAED5] transition-all hover:scale-105 active:scale-95"
                    >
                      <Eye className="w-5 h-5" />
                      <span className="text-base font-bold underline underline-offset-4 decoration-[#6FBEE5]/40 group-hover:decoration-[#5DAED5]">
                        View More
                      </span>
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-3xl font-black">$</span>
                    <input
                      id="expenses"
                      type="number"
                      placeholder="0.00"
                      value={totalExpenses}
                      readOnly
                      className="w-full pl-12 pr-6 py-6 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none transition-all text-3xl font-black cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 gap-4">
                    <div className="min-w-0">
                      <p className="text-white/60 text-sm sm:text-base mb-2">Available Balance</p>
                      {balance > 0 ? (
                        <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-sky-400 truncate">
                          ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      ) : balance === 0 ? (
                        <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white truncate">
                          ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      ) : (
                        <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-400 truncate">
                          ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                    <div
                      className={`px-6 py-3 sm:px-8 sm:py-4 rounded-2xl self-start sm:self-center shrink-0 shadow-lg ${balance >= 0 ? "bg-green-500/20 text-green-500 shadow-green-500/10" : "bg-red-500/20 text-red-500 shadow-red-500/10"}`}
                    >
                      {balance >= 0 ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <TrendingUp className="w-6 h-6 sm:w-5 sm:h-5" />
                          <span className="text-base sm:text-xl font-black uppercase tracking-wider">Surplus</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <TrendingUp className="w-6 h-6 sm:w-5 sm:h-5 rotate-180" />
                          <span className="text-base sm:text-xl font-black uppercase tracking-wider">Deficit</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-1">
          <Card className="border-white/20 backdrop-blur-xl bg-white/5 lg:h-[58vh]">
            <div className="p-6 h-full flex flex-col">
              <Button
                variant="ghost"
                className="justify-start text-2xl sm:text-3xl text-white font-black mb-10 p-0 h-auto hover:bg-transparent hover:scale-[1.04] transition-transform"
                onClick={() => router.push('/recent-activity')}
              >
                Recent Activity
              </Button>
              <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-start gap-3 pb-6 border-b border-white/10 last:border-0 last:pb-0"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg shrink-0 ${tx.type === "receive"
                        ? "bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/20"
                        : tx.type === "send"
                          ? "bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/20"
                          : "bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/20"
                        }`}
                    >
                      {tx.type === "receive" ? (
                        <ArrowDownLeft className="w-5 h-5 text-white stroke-[3px]" />
                      ) : tx.type === "send" ? (
                        <ArrowUpRight className="w-5 h-5 text-white stroke-[3px]" />
                      ) : (
                        <Repeat className="w-5 h-5 text-white stroke-[3px]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${tx.type === "receive" ? "text-green-500" : tx.type === "send" ? "text-red-500" : "text-blue-500"}`}>{tx.amount}</p>
                      <p className="text-xs text-white/60">{tx.time}</p>
                      <p className="text-xs text-white/60 mt-1">
                        {tx.from && `From: ${tx.from}`}
                        {tx.to && `To: ${tx.to}`}
                        {tx.protocol && `Via: ${tx.protocol}`}
                      </p>
                    </div>
                    <span className="text-sm text-white">{tx.usd}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Mindy AI */}
        <div className="xl:col-span-1">
          <Card className="border-white/20 backdrop-blur-xl bg-white/5 h-full">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-[#6FBEE5]" />
                <h3 className="text-xl font-semibold" style={{ color: "white" }}>Mindy AI</h3>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 space-y-3 overflow-y-auto mb-4 min-h-[200px]">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#6FBEE5]/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-[#6FBEE5]" />
                  </div>
                  <div className="bg-white/10 rounded-xl rounded-tl-none px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-white/90">Hello! I&apos;m your AI financial assistant. How can I help you today?</p>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex gap-2 items-stretch">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#6FBEE5]/50 focus:border-[#6FBEE5]/50 transition-all text-sm"
                />
                <Button className="px-4 py-3 bg-gradient-to-r from-[#6FBEE5] to-[#4A9FCC] hover:from-[#5DAED5] hover:to-[#3A8FBC] text-white border-0 rounded-xl">
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card className="border-white/20 backdrop-blur-xl bg-white/5">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-[#6FBEE5]" />
              <h3 className="text-xl font-semibold" style={{ color: "white" }}>AI-Powered Suggestions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-[#6FBEE5]/30 transition-all hover:shadow-lg hover:shadow-[#6FBEE5]/10"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{suggestion.title}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${suggestion.priority === "high"
                            ? "bg-red-500/20 text-red-400"
                            : suggestion.priority === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/20 text-blue-400"
                            }`}
                        >
                          {suggestion.priority}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{suggestion.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-[#6FBEE5] hover:text-[#5DAED5] hover:bg-[#6FBEE5]/10"
                  >
                    Learn More
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      {/* AI Insight Modal */}
      {insightModal.isOpen && (
        <div className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 ${insightModal.isClosing ? "opacity-0 invisible" : "opacity-100 visible"}`}>
          <Card className={`bg-[#111] border-white/20 p-6 rounded-2xl text-white w-full max-w-md shadow-2xl transition-all duration-300 ${insightModal.isClosing ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"} animate-in fade-in zoom-in duration-200`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#6FBEE5]" />
                <h2 className="text-xl font-bold">AI Financial Insight</h2>
              </div>
              <button
                onClick={insightModal.close}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors text-white/30 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              Based on your current cashflow, we suggest diversifying into Sui-native liquid staking protocols. You could potentially increase your passive income by 8-12% annually.
            </p>
            <Button
              className="w-full bg-[#6FBEE5] hover:bg-[#5DAED5] text-white py-6 rounded-xl font-bold shadow-lg shadow-[#6FBEE5]/20"
              onClick={insightModal.close}
            >
              Got it, thanks!
            </Button>
          </Card>
        </div>
      )}

      {/* Salary Edit Modal */}
      {salaryModal.isOpen && (
        <div className={`fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 transition-all duration-500 animate-in fade-in ${salaryModal.isClosing ? "opacity-0 invisible" : "opacity-100 visible"}`}>
          <Card className={`relative overflow-hidden bg-[#0A0A0B] border border-[#1A1A1B] p-0 rounded-[32px] text-white w-full max-w-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out animate-in fade-in zoom-in-95 ${salaryModal.isClosing ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"}`}>
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FBEE5] to-transparent shadow-[0_0_20px_rgba(111,190,229,0.5)]" />

            <div className="p-10 md:p-12">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    <Pencil className="w-8 h-8 text-[#6FBEE5]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">Edit Salary</h2>
                    <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-black mt-1.5 text-[10px]">Income Configuration</p>
                  </div>
                </div>
                <button
                  onClick={salaryModal.close}
                  className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-white/30 hover:text-white active:scale-90"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Active Income</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[#6FBEE5]/5 rounded-xl blur-lg transition-opacity opacity-0 group-focus-within:opacity-100" />
                    <div className="relative flex items-center bg-[#141415] border border-white/5 rounded-xl px-4 py-4 group-focus-within:border-[#6FBEE5]/50 transition-all">
                      <span className="text-xl font-bold text-[#6FBEE5] mr-2">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={activeSalary}
                        onChange={(e) => setActiveSalary(e.target.value)}
                        className="bg-transparent border-none text-xl font-bold text-white focus:outline-none w-full placeholder:text-white/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Passive Income</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[#6FBEE5]/5 rounded-xl blur-lg transition-opacity opacity-0 group-focus-within:opacity-100" />
                    <div className="relative flex items-center bg-[#141415] border border-white/5 rounded-xl px-4 py-4 group-focus-within:border-[#6FBEE5]/50 transition-all">
                      <span className="text-xl font-bold text-[#6FBEE5] mr-2">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={passiveSalary}
                        onChange={(e) => setPassiveSalary(e.target.value)}
                        className="bg-transparent border-none text-xl font-bold text-white focus:outline-none w-full placeholder:text-white/10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5">
                <div className="flex items-end justify-between mb-8 px-1">
                  <span className="text-white/30 text-xs font-bold uppercase tracking-widest pb-1">Total Monthly</span>
                  <span className="text-3xl font-black text-white">
                    ${(Number(activeSalary) + Number(passiveSalary)).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="ghost"
                    className="py-6 rounded-xl border border-white/5 text-white/60 hover:text-white hover:bg-white/5 h-auto text-xs font-bold uppercase tracking-widest"
                    onClick={salaryModal.close}
                  >
                    Discard
                  </Button>
                  <Button
                    className="py-6 rounded-xl bg-[#6FBEE5] hover:bg-[#5DAED5] text-black font-black h-auto text-xs uppercase tracking-widest shadow-xl shadow-[#6FBEE5]/10"
                    onClick={() => {
                      setSalary((Number(activeSalary) + Number(passiveSalary)).toString())
                      salaryModal.close()
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      {/* Expenses Breakdown Modal */}
      {expensesModal.isOpen && (
        <div className={`fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-6 transition-all duration-500 animate-in fade-in ${expensesModal.isClosing ? "opacity-0 invisible" : "opacity-100 visible"}`}>
          <Card className={`relative overflow-hidden bg-[#0A0A0B] border border-[#1A1A1B] p-0 rounded-[32px] text-white w-full max-w-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out animate-in fade-in zoom-in-95 ${expensesModal.isClosing ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"}`}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6FBEE5] to-transparent shadow-[0_0_20px_rgba(111,190,229,0.5)]" />

            <div className="p-10 md:p-12">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    <Eye className="w-8 h-8 text-[#6FBEE5]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">Expenses</h2>
                    <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-black mt-1.5 text-[10px]">Spending Insights</p>
                  </div>
                </div>
                <button
                  onClick={expensesModal.close}
                  className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-white/30 hover:text-white active:scale-90"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                {expenseCategories.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-6 rounded-[24px] bg-[#141415] border border-white/5 hover:border-[#6FBEE5]/30 hover:bg-white/[0.02] transition-all group">
                    <div className="flex items-center gap-6">
                      <p className="text-lg font-bold text-white group-hover:text-[#6FBEE5] transition-colors">{item.name}</p>
                    </div>
                    <span className="text-2xl font-black text-white tracking-tight">$ {Number(item.amount).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="flex items-end justify-between mb-8 px-1">
                  <span className="text-white/30 text-xs font-bold uppercase tracking-widest pb-1">Total Spending</span>
                  <span className="text-3xl font-black text-white">
                    ${expenseCategories.reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString()}
                  </span>
                </div>

                <Button
                  className="w-full bg-white/5 hover:bg-white/10 text-white py-6 rounded-xl font-bold border border-white/5 shadow-xl h-auto text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
                  onClick={expensesModal.close}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
