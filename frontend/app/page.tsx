"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button, Card, ScrollToTop } from "@/components/ui"
import { FadeReveal } from "@/components/ui/fade-reveal"
import {
    TrendingUp,
    ArrowRight,
    ArrowUpRight,
    ArrowDownLeft,
    Shield,
    Bot,
    BarChart3,
    CheckCircle2,
    Bell
} from "lucide-react"
import { Footer } from "@/components/layout"
import { SuiMindLogo, MindyAILogo } from "@/components/icons"

export default function LandingPage() {
    const router = useRouter()

    return (
        <div className="relative min-h-screen text-white overflow-x-hidden selection:bg-[#6FBEE5]/30 scroll-smooth">
            <ScrollToTop />
            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-6 md:py-12 w-full mx-auto">
                <FadeReveal direction="none" duration={800} className="w-fit">
                    <div className="flex items-center gap-2">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg shadow-[#6FBEE5]/20 flex-shrink-0 transition-transform hover:scale-105 duration-300">
                            <SuiMindLogo />
                        </div>
                        <span className="text-3xl md:text-4xl font-bold tracking-tighter">SuiMind</span>
                    </div>
                </FadeReveal>

                <FadeReveal direction="none" duration={800} className="w-fit">
                    <Button
                        onClick={() => router.push("/login")}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md rounded-xl px-6 py-4 md:px-9 md:py-6 text-base md:text-lg font-bold transition-all hover:scale-105 active:scale-95"
                    >
                        Launch App
                    </Button>
                </FadeReveal>
            </nav>

            <main className="relative z-10">
                {/* HERO SECTION */}
                <section className="px-6 md:px-12 pt-12 md:pt-20 pb-20 md:pb-32 w-full mx-auto text-center">
                    <FadeReveal delay={100} distance={20}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6FBEE5]/10 border border-[#6FBEE5]/20 text-[#6FBEE5] text-xs font-bold uppercase tracking-widest mb-8">
                            <Bot className="w-4 h-4" />
                            Empowering Sui Financial with AI
                        </div>
                    </FadeReveal>

                    <FadeReveal delay={300} distance={50} triggerOnce blur={false} scale={1}>
                        <h1 className="text-4xl sm:text-6xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.9] mb-8">
                            Your Money, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6FBEE5] via-white to-[#4A9FCC]">Intelligently</span> <br />Managed.
                        </h1>
                    </FadeReveal>

                    <FadeReveal delay={500} distance={30} triggerOnce blur={false} scale={1}>
                        <p className="text-white/60 text-lg sm:text-xl max-w-xl lg:max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                            The next generation of financial intelligence on Sui. Track activity, analyze cashflow, and get AI insights to grow your wealth.
                        </p>
                    </FadeReveal>

                    <FadeReveal delay={500} distance={30} triggerOnce blur={false} scale={1}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                            <Button
                                onClick={() => router.push("/login")}
                                className="w-full sm:w-auto sm:min-w-[250px] justify-center px-8 py-6 text-lg md:px-10 md:py-8 md:text-xl font-bold bg-gradient-to-r from-[#6FBEE5] to-[#BE03FD] hover:from-[#5DAED5] hover:to-[#BE03FD] text-white border-0 rounded-2xl shadow-xl shadow-[#6FBEE5]/20 hover:shadow-[#6FBEE5]/40 transition-all hover:scale-[1.05] active:scale-[0.98]"
                            >
                                Start for Free
                                <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </div>
                    </FadeReveal>
                </section>

                {/* FEATURES GRID */}
                <section className="px-6 md:px-12 py-20 md:py-32 w-full mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <FadeReveal delay={100} direction="up" distance={60}>
                            <Card className="p-8 md:p-10 border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#6FBEE5]/30 transition-all group h-full flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#4385f5]/30 via-[#e94335]/20 to-[#fcbc05]/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-[#4385f5]/20 border border-white/10">
                                    <TrendingUp className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                </div>
                                <h3 className="text-4xl font-bold mb-4">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4385f5] via-[#e94335] to-[#fcbc05]"> Cashflow Master
                                    </span>
                                </h3>
                                <p className="text-white/80 leading-relaxed font-medium">Take full control of your financial flow by managing your active and passive income with intuitive visual insights into your monthly spending patterns.</p>
                            </Card>
                        </FadeReveal>

                        <FadeReveal delay={300} direction="up" distance={60}>
                            <Card className="p-8 md:p-10 border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#6FBEE5]/30 transition-all group h-full flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#4891ee]/30 via-[#877acc]/20 to-[#cd666e]/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-[#877acc]/20 border border-white/10">
                                    <MindyAILogo className="w-20 h-20 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                </div>
                                <h3 className="text-6xl font-bold mb-4">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4891ee] via-[#877acc] to-[#cd666e]"> Mindy AI
                                    </span>
                                </h3>
                                <p className="text-white/80 leading-relaxed font-medium">Powered by Gemini 3.0 AI, your intelligent financial assistant analyzes your Sui blockchain activity in real-time to deliver personalized insights and actionable growth strategies.</p>
                            </Card>
                        </FadeReveal>

                        <FadeReveal delay={500} direction="up" distance={60}>
                            <Card className="p-8 md:p-10 border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#6FBEE5]/30 transition-all group h-full flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#4385f5]/30 via-[#34a853]/20 to-[#e94335]/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-[#34a853]/20 border border-white/10">
                                    <BarChart3 className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                </div>
                                <h3 className="text-4xl font-bold mb-4">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4385f5] via-[#34a853] to-[#e94335]"> Smart Insights
                                    </span>
                                </h3>
                                <p className="text-white/80 leading-relaxed font-medium">Transform complex blockchain data into beautiful, actionable visualizations. Track spending patterns, analyze transaction history, and discover financial opportunities at a glance.</p>
                            </Card>
                        </FadeReveal>
                    </div>
                </section>

                {/* DECISION SECTION */}
                <section className="px-6 py-20 md:py-32 bg-gradient-to-b from-transparent via-[#6FBEE5]/5 to-transparent">
                    <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-80 px-6 md:px-12">
                        <div className="flex-1">
                            <FadeReveal direction="left" distance={60}>
                                <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[0.9]">
                                    Turn Data into <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6FBEE5] via-[#3B82F6] to-[#fffdfe]">Decisions.</span>
                                </h2>
                            </FadeReveal>

                            <div className="space-y-6">
                                {[
                                    "Real-time Sui blockchain transaction tracking",
                                    "Gemini 3.0 AI-powered financial insights",
                                    "Interactive cashflow visualizations",
                                    "Smart expense pattern recognition"
                                ].map((item, i) => (
                                    <FadeReveal key={i} delay={100 * i} direction="left" distance={40}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full bg-[#6FBEE5]/20 flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-[#6FBEE5]" />
                                            </div>
                                            <span className="text-xl font-medium text-white">{item}</span>
                                        </div>
                                    </FadeReveal>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full relative">
                            <div className="relative max-w-lg mx-auto mt-12 lg:mt-0">
                                {/* Background Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] rounded-[3rem] blur-[100px] opacity-20 animate-pulse" />

                                <div className="relative space-y-4">
                                    {/* Decision Card 1 */}
                                    <FadeReveal direction="right" distance={40} delay={200} scale={0.95}>
                                        <div className="transform -rotate-2 hover:rotate-0 transition-all duration-500 -translate-x-8 sm:-translate-x-12">
                                            <Card className="border-white/10 bg-white/5 backdrop-blur-2xl p-5 md:p-6 rounded-3xl shadow-2xl flex items-center justify-between gap-4 border-l-4 border-l-blue-500/50">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                                        <TrendingUp className="w-6 h-6 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-[10px] uppercase font-bold tracking-widest mb-1">Monthly Cashflow</p>
                                                        <p className="text-blue-400 text-lg font-black">+125.4000 SUI</p>
                                                    </div>
                                                </div>
                                                <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-wider border border-blue-500/20">
                                                    + 14.5% This Month
                                                </div>
                                            </Card>
                                        </div>
                                    </FadeReveal>

                                    {/* Decision Card 2 - Main AI Mind */}
                                    <FadeReveal direction="right" distance={40} delay={300} scale={0.95}>
                                        <div className="z-10 relative">
                                            <Card className="border-[#6FBEE5]/30 bg-gradient-to-br from-[#6FBEE5]/20 via-black/40 to-black/60 backdrop-blur-3xl p-6 md:p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative group">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6FBEE5]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#6FBEE5]/20 transition-colors" />
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(111,190,229,0.3)] border border-white/10">
                                                            <MindyAILogo className="w-7 h-7 sm:w-8 sm:h-8" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg sm:text-xl font-black text-white leading-tight">Mindy AI Insight</h4>
                                                            <div className="flex gap-1 mt-1.5">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#6FBEE5] animate-bounce" />
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#6FBEE5] animate-bounce [animation-delay:0.2s]" />
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#6FBEE5] animate-bounce [animation-delay:0.4s]" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-[#6FBEE5] group-hover:border-[#6FBEE5] transition-all group-hover:rotate-45">
                                                        <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white" />
                                                    </div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                                    <div className="h-1.5 w-full bg-gradient-to-r from-[#6FBEE5] to-transparent rounded-full opacity-50" />
                                                    <div className="h-1.5 w-3/4 bg-white/10 rounded-full" />
                                                    <p className="text-white/60 text-xs font-medium pt-1">Analyze spending patterns...</p>
                                                </div>
                                            </Card>
                                        </div>
                                    </FadeReveal>

                                    {/* Decision Card 3 */}
                                    <FadeReveal direction="right" distance={40} delay={400} scale={0.95}>
                                        <div className="transform rotate-3 hover:rotate-0 transition-all duration-500 translate-x-8 sm:translate-x-12">
                                            <Card className="border-white/10 bg-white/5 backdrop-blur-2xl p-5 md:p-6 rounded-3xl shadow-2xl flex items-center gap-4">
                                                <div className="flex -space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20 border-2 border-[#1a1a1a] z-20">
                                                        <ArrowDownLeft className="w-5 h-5 text-white stroke-[3px]" />
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20 border-2 border-[#1a1a1a] z-10">
                                                        <ArrowUpRight className="w-5 h-5 text-white stroke-[3px]" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Recent Activity</p>
                                                    <p className="text-white text-sm font-black truncate">15 transactions this week</p>
                                                </div>
                                                <div className="text-[#6FBEE5] text-xs font-black bg-[#6FBEE5]/10 px-3 py-1.5 rounded-xl border border-[#6FBEE5]/20 hover:bg-[#6FBEE5]/20 transition-colors cursor-pointer">
                                                    View
                                                </div>
                                            </Card>
                                        </div>
                                    </FadeReveal>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="px-6 py-24 md:py-40 text-center">
                    <FadeReveal direction="up" distance={100} scale={0.95}>
                        <div className="max-w-6xl mx-auto p-8 sm:p-16 lg:p-24 rounded-[2rem] sm:rounded-[3rem] lg:rounded-[4rem] bg-gradient-to-br from-[#06b6d4]/30 via-[#3b82f6]/30 to-[#8b5cf6]/30 relative overflow-hidden shadow-2xl shadow-indigo-500/30 border border-white/20">
                            <FadeReveal delay={200} distance={20} direction="none">
                                <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tighter mb-8 relative z-10 leading-[1.1]">
                                    Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6FBEE5] via-white to-[#4A9FCC]">Upgrade</span> Your <br />Financial Mindset?
                                </h2>
                            </FadeReveal>

                            <FadeReveal delay={300} distance={10} direction="none">
                                <p className="text-white/80 text-lg sm:text-xl mb-12 relative z-10 font-medium max-w-2xl mx-auto">
                                    Experience the power of Gemini 3.0 AI combined with real-time Sui blockchain insights. Transform your financial future today.
                                </p>
                            </FadeReveal>

                            <FadeReveal delay={330} distance={15} direction="none">
                                <Button
                                    onClick={() => router.push("/login")}
                                    className="bg-white text-[#001B39] hover:bg-[#F0F9FF] px-8 py-6 text-xl md:px-12 md:py-8 md:text-2xl font-bold rounded-2xl shadow-2xl relative z-10 transition-all hover:scale-105 active:scale-95"
                                >
                                    Get Started Now
                                </Button>
                            </FadeReveal>
                        </div>
                    </FadeReveal>
                </section>
            </main>

            <Footer />
        </div>
    )
}
