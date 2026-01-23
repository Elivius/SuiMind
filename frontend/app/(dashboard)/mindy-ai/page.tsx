"use client"

import { Button, Card } from "@/components/ui"
import { ArrowUpRight, Zap } from "lucide-react"

export default function MindyAIPage() {
    return (
        <div className="w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col h-[calc(100vh-280px)] md:h-[calc(120vh-250px)]">
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
                                <Button className="px-5 sm:px-6 bg-[#6FBEE5] hover:bg-[#5DAED5] text-white font-bold border-0 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#6FBEE5]/20">
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
        </div>
    )
}
