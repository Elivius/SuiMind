"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowUpRight, Zap, Settings, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import DarkVeil from "@/components/ui/dark-veil"
import GooeyNav from "@/components/ui/gooey-nav"

const items = [
    { label: "Home", href: "/home" },
    { label: "Monthly Cashflow", href: "/monthly-cashflow" },
    { label: "Recent Activity", href: "/recent-activity" },
    { label: "Mindy AI", href: "/mindy-ai" },
];

export default function MindyAIPage() {
    const router = useRouter()
    return (
        <div className="relative min-h-screen bg-[#001B39] text-white">
            {/* DarkVeil Background */}
            <DarkVeil
                className="fixed inset-0 z-0 pointer-events-none opacity-40"
                speed={0.3}
                hueShift={0}
                noiseIntensity={0.05}
                warpAmount={0.2}
            />

            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-40">
                    <div className="w-full px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] flex items-center justify-center">
                                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <h1 className="text-lg sm:text-xl font-bold">SuiMind</h1>
                            </div>
                            <div className="hidden md:block" style={{ height: '45px', position: 'relative' }}>
                                <GooeyNav
                                    items={items}
                                    particleCount={5}
                                    particleDistances={[90, 10]}
                                    particleR={100}
                                    initialActiveIndex={3}
                                    animationTime={600}
                                    timeVariance={300}
                                    colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                                />
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 w-9 h-9 sm:w-10 sm:h-10">
                                    <Bell className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 w-9 h-9 sm:w-10 sm:h-10">
                                    <Settings className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* Mobile Nav */}
                    <div className="md:hidden border-t border-white/5 px-4 py-2 overflow-x-auto flex gap-6 no-scrollbar">
                        {items.map((item, idx) => (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`text-sm font-medium whitespace-nowrap py-1 ${idx === 3 ? 'text-[#6FBEE5]' : 'text-white/60'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </header>

                <main className="w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex flex-col h-[calc(100vh-230px)] md:h-[calc(100vh-200px)]">

                        <Card className="flex-1 border-white/20 backdrop-blur-xl bg-white/5 flex flex-col mb-6">
                            {/* Chat Messages Area */}
                            <div className="flex-1 p-6 space-y-6 overflow-y-auto h-[600px]">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#6FBEE5]/20 flex items-center justify-center flex-shrink-0 border border-[#6FBEE5]/30">
                                        <Zap className="w-5 h-5 text-[#6FBEE5]" />
                                    </div>
                                    <div className="bg-white/10 rounded-2xl rounded-tl-none px-5 py-4 max-w-[80%] border border-white/5 shadow-xl">
                                        <p className="text-white/90 leading-relaxed">
                                            Welcome to SuiMind! I am your personal DeFAI assistant. I can help you:
                                        </p>
                                        <ul className="mt-3 space-y-2 text-sm text-white/70 list-disc list-inside">
                                            <li>Analyze your transaction history</li>
                                            <li>Find yield opportunities on Sui</li>
                                            <li>Set up automated trading rules</li>
                                            <li>Monitor protocol risks</li>
                                        </ul>
                                        <p className="mt-3 text-white/90">
                                            How can I assist you today?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Input */}
                            <div className="p-2 sm:p-4">
                                <div className="max-w-4xl mx-auto bg-white/5 p-3 sm:p-5 rounded-3xl border border-white/10 shadow-2xl">
                                    <div className="flex gap-3 items-stretch">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                placeholder="Message SuiMind AI..."
                                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#6FBEE5]/50 focus:border-[#6FBEE5]/50 transition-all"
                                            />
                                        </div>
                                        <Button className="px-5 sm:px-6 bg-[#6FBEE5] hover:bg-[#5DAED5] text-[#001B39] font-bold border-0 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#6FBEE5]/20">
                                            <ArrowUpRight className="w-5 h-5 sm:mr-1" />
                                            <span className="hidden sm:inline">Send</span>
                                        </Button>
                                    </div>
                                    <p className="text-center text-[10px] text-white/20 mt-4 uppercase tracking-widest">
                                        Powered by Sui Network & Advanced LLMs
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
