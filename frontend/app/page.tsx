"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Shield, Zap, Settings, Bell } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Silk from "@/components/ui/Silk"
import GooeyNav from "@/components/ui/GooeyNav"

const items = [
  { label: "Home", href: "page" },
  { label: "Monthly Cashflow", href: "Monthly_Cashflow" },
  { label: "Recent Activity", href: "#" },
  { label: "AI Chatbox", href: "#" },
];

export default function WalletDashboard() {
  const router = useRouter()
  const [salary, setSalary] = useState("")
  const [expenses, setExpenses] = useState("")
  const [showInsight, setShowInsight] = useState(false);



  const calculateBalance = () => {
    const salaryNum = Number.parseFloat(salary) || 0
    const expensesNum = Number.parseFloat(expenses) || 0
    return salaryNum - expensesNum
  }

  const balance = calculateBalance()

  const chartData = [
    { name: "Income", value: Number.parseFloat(salary) || 0, color: "#10B981" },
    { name: "Expenses", value: Number.parseFloat(expenses) || 0, color: "#EF4444" },
  ].filter((item) => item.value > 0)

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
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="w-full px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold">SuiMind</h1>
              </div>
              <div style={{ height: '45px', position: 'relative' }}>
                <GooeyNav
                  items={items}
                  particleCount={5}
                  particleDistances={[90, 10]}
                  particleR={100}
                  initialActiveIndex={0}
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

        <div className="w-full px-6 py-8">
          {/* Main Balance Card */}
          <Card className="border-white/20 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 mb-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6FBEE5]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                {/* Left side: Balance + AI Insight */}
                <div>
                  <p className="text-white text-xl font-bold mb-2">Total Balance</p>
                  <div className="flex items-center gap-4">
                    <h2 className="text-7xl font-bold" style={{ color: "white" }}>
                      ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                    {/* AI Insight beside the number */}
                    <div
                      className="px-7 py-5 rounded-xl bg-[#6FBEE5]/10 border border-[#6FBEE5]/20 cursor-pointer hover:bg-[#6FBEE5]/20 transition-all"
                      onClick={() => setShowInsight(true)}
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
                <div className="flex flex-col gap-3">
                  <Button
                    className="px-8 py-7 text-base font-semibold bg-gradient-to-r from-[#6FBEE5] to-[#4A9FCC] hover:from-[#5DAED5] hover:to-[#3A8FBC] text-white border-0 rounded-xl shadow-lg shadow-[#6FBEE5]/20 hover:shadow-[#6FBEE5]/40 transition-all"
                  >
                    <ArrowUpRight className="w-5 h-5 mr-2" />
                    Send
                  </Button>
                  <Button
                    className="px-8 py-7 text-base font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white border-0 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
                  >
                    <ArrowDownRight className="w-5 h-5 mr-2" />
                    Receive
                  </Button>
                </div>
              </div>

              {/* AI Insight Modal */}
              {showInsight && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                  <div className="bg-[#111] p-6 rounded-xl text-white w-[320px]">
                    <h2 className="text-lg font-semibold mb-2">AI Insight</h2>
                    <p>This is the new interface.</p>

                    <button
                      className="mt-4 px-4 py-2 bg-blue-500 rounded"
                      onClick={() => setShowInsight(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-white/20 backdrop-blur-xl bg-white/5 h-[65vh]">
                <div className="p-6">
                  <Button
                    variant="ghost"
                    className="justify-start text-xl text-white font-semibold mb-6 p-0 h-auto hover:bg-transparent hover:text-2xl"
                    onClick={() => router.push('/Monthly_Cashflow')}
                  >
                    Monthly Cashflow
                  </Button>
                  <div className="space-y-6">
                    {/* Salary Input */}
                    <div>
                      <label htmlFor="salary" className="block text-sm font-medium text-white mb-2">
                        Monthly Salary
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-lg">$</span>
                        <input
                          id="salary"
                          type="number"
                          placeholder="0.00"
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          className="w-full pl-8 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#6FBEE5]/50 focus:border-[#6FBEE5]/50 transition-all text-lg"
                        />
                      </div>
                    </div>

                    {/* Expenses Input */}
                    <div>
                      <label htmlFor="expenses" className="block text-sm font-medium text-white mb-2">
                        Monthly Expenses
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-lg">$</span>
                        <input
                          id="expenses"
                          type="number"
                          placeholder="0.00"
                          value={expenses}
                          onChange={(e) => setExpenses(e.target.value)}
                          className="w-full pl-8 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#6FBEE5]/50 focus:border-[#6FBEE5]/50 transition-all text-lg"
                        />
                      </div>
                    </div>

                    {/* Balance Summary */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5">
                        <div>
                          <p className="text-white text-sm mb-1">Available Balance</p>
                          {balance > 0 ? (
                            <p className="text-3xl font-bold text-green-400">
                              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          ) : balance === 0 ? (
                            <p className="text-3xl font-bold text-white">
                              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          ) : (
                            <p className="text-3xl font-bold text-red-400">
                              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          )}
                        </div>
                        <div
                          className={`px-4 py-2 rounded-lg ${balance >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                        >
                          {balance >= 0 ? (
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" />
                              <span className="font-semibold">Surplus</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 rotate-180" />
                              <span className="font-semibold">Deficit</span>
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
            <div className="lg:col-span-1">
              <Card className="border-white/20 backdrop-blur-xl bg-white/5 h-full">
                <div className="p-6 h-full flex flex-col">
                  <Button
                    variant="ghost"
                    className="justify-start text-xl text-white font-semibold mb-6 p-0 h-auto hover:bg-transparent hover:text-2xl"
                    onClick={() => router.push('/recentactivity')}
                  >
                    Recent Activity
                  </Button>
                  <div className="space-y-4 flex-1">
                    {recentTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-start gap-3 pb-4 border-b border-white/10 last:border-0 last:pb-0"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "receive"
                            ? "bg-green-500/20"
                            : tx.type === "send"
                              ? "bg-red-500/20"
                              : "bg-blue-500/20"
                            }`}
                        >
                          {tx.type === "receive" ? (
                            <ArrowDownRight className="w-5 h-5 text-green-400" />
                          ) : tx.type === "send" ? (
                            <ArrowUpRight className="w-5 h-5 text-red-400" />
                          ) : (
                            <Zap className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm truncate ${tx.type === "receive" ? "text-green-400" : tx.type === "send" ? "text-red-400" : "text-blue-300"}`}>{tx.amount}</p>
                          <p className="text-xs text-white">{tx.time}</p>
                          <p className="text-xs text-white mt-1">
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

            {/* AI Chatbox */}
            <div className="lg:col-span-1">
              <Card className="border-white/20 backdrop-blur-xl bg-white/5 h-full">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-[#6FBEE5]" />
                    <h3 className="text-xl font-semibold" style={{ color: "white" }}>AI Assistant</h3>
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
        </div>
      </div>
    </div>
  )
}
