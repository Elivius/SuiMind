"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Shield, Zap, Settings, Bell } from "lucide-react"
import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function WalletDashboard() {
  const [salary, setSalary] = useState("")
  const [expenses, setExpenses] = useState("")

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
    <div className="min-h-screen bg-gradient-to-br from-[#001B39] via-[#002B4F] to-[#003D66] text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold">SuiMind</h1>
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Main Balance Card */}
        <Card className="border-white/20 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 mb-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6FBEE5]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-white/60 text-sm mb-2">Total Balance</p>
                <h2 className="text-5xl font-bold text-balance">
                  ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <div className="flex items-center gap-2 mt-3">
                  {balance >= 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">Positive Balance</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                      <span className="text-red-400 text-sm font-medium">Deficit</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Security Shield */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Protected by AI Security</span>
              <Zap className="w-4 h-4 text-green-400 ml-auto" />
            </div>

            <div className="px-4 py-3 rounded-xl bg-[#6FBEE5]/10 border border-[#6FBEE5]/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-[#6FBEE5]" />
                <h4 className="text-sm font-semibold">AI Insight</h4>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Your idle USDC could earn 8.2% APY on Scallop. Consider moving $2,000 to maximize returns.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-white/20 backdrop-blur-xl bg-white/5 h-full">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6">Income & Expenses</h3>
                <div className="space-y-6">
                  {/* Salary Input */}
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-white/70 mb-2">
                      Monthly Salary
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">$</span>
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
                    <label htmlFor="expenses" className="block text-sm font-medium text-white/70 mb-2">
                      Monthly Expenses
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">$</span>
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
                        <p className="text-white/60 text-sm mb-1">Available Balance</p>
                        <p className="text-3xl font-bold">
                          ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
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

                    {/* Breakdown */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Income:</span>
                        <span className="text-green-400 font-medium">
                          +$
                          {(Number.parseFloat(salary) || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Expenses:</span>
                        <span className="text-red-400 font-medium">
                          -$
                          {(Number.parseFloat(expenses) || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
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
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
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
                        <p className="font-medium text-sm truncate">{tx.amount}</p>
                        <p className="text-xs text-white/50">{tx.time}</p>
                        <p className="text-xs text-white/40 mt-1">
                          {tx.from && `From: ${tx.from}`}
                          {tx.to && `To: ${tx.to}`}
                          {tx.protocol && `Via: ${tx.protocol}`}
                        </p>
                      </div>
                      <span className="text-sm text-white/70">{tx.usd}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <Card className="border-white/20 backdrop-blur-xl bg-white/5">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6">Financial Breakdown</h3>
              {chartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent?? 0)* 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0, 27, 57, 0.9)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "12px",
                          color: "white",
                        }}
                        formatter={(value: number | undefined) =>
                          `$${(value??0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        }
                      />
                      <Legend
                        wrapperStyle={{ color: "white" }}
                        formatter={(value) => <span style={{ color: "white" }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-white/50">Enter your salary and expenses to see the breakdown</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="border-white/20 backdrop-blur-xl bg-white/5">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-[#6FBEE5]" />
                <h3 className="text-xl font-semibold">AI-Powered Suggestions</h3>
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
  )
}
