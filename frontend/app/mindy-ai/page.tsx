"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Wallet, ArrowUpRight, Zap, Settings, Bell } from "lucide-react"
import Silk from "@/components/ui/Silk"
import GooeyNav from "@/components/ui/GooeyNav"

const items = [
    { label: "Home", href: "/home" },
    { label: "Monthly Cashflow", href: "/monthly-cashflow" },
    { label: "Recent Activity", href: "/recent-activity" },
    { label: "Mindy AI", href: "/mindy-ai" },
];

export default function MindyAIPage() {
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
                                    initialActiveIndex={3}
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

                <main className="w-full mx-auto px-6 py-6">
                    <div className="flex flex-col h-[calc(110vh-180px)]">

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
                            <div className="p-1">
                                <div className="max-w-4xl mx-auto bg-white/5 p-5 rounded-3xl border border-white/10 shadow-2xl">
                                    <div className="flex gap-3 items-stretch">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                placeholder="Message SuiMind AI..."
                                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#6FBEE5]/50 focus:border-[#6FBEE5]/50 transition-all"
                                            />
                                        </div>
                                        <Button className="px-6 bg-[#6FBEE5] hover:bg-[#5DAED5] text-[#001B39] font-bold border-0 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#6FBEE5]/20">
                                            <ArrowUpRight className="w-5 h-5 mr-1" />
                                            Send
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
