"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button, Card, ScrollToTop } from "@/components/ui"
import { FadeReveal } from "@/components/ui/fade-reveal"
import {
    Wallet,
    TrendingUp,
    ArrowRight,
    Shield,
    Bot,
    BarChart3,
    CheckCircle2
} from "lucide-react"
import { Footer } from "@/components/layout"

export default function LandingPage() {
    const router = useRouter()

    return (
        <div className="relative min-h-screen text-white overflow-x-hidden selection:bg-[#6FBEE5]/30 scroll-smooth">
            <ScrollToTop />
            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-6 md:py-10 w-full mx-auto">
                <FadeReveal direction="none" duration={800}>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] flex items-center justify-center shadow-lg shadow-[#6FBEE5]/20">
                            <Wallet className="w-6 h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        <span className="text-3xl md:text-4xl font-bold tracking-tighter">SuiMind</span>
                    </div>
                </FadeReveal>

                <FadeReveal direction="none" duration={800}>
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
                            <Card className="p-6 md:p-8 border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#6FBEE5]/30 transition-all group h-full">
                                <div className="w-14 h-14 rounded-2xl bg-[#6FBEE5]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-7 h-7 text-[#6FBEE5]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Cashflow Master</h3>
                                <p className="text-white/50 leading-relaxed font-medium">Take full control of your financial flow by managing your active and passive income with intuitive visual insights into your monthly spending patterns.</p>
                            </Card>
                        </FadeReveal>

                        <FadeReveal delay={300} direction="up" distance={60}>
                            <Card className="p-6 md:p-8 border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#6FBEE5]/30 transition-all group h-full">
                                <div className="w-14 h-14 rounded-2xl bg-sky-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Bot className="w-7 h-7 text-sky-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Mindy AI</h3>
                                <p className="text-white/50 leading-relaxed font-medium">Your personal financial assistant that analyzes your Sui activity to provide actionable growth advice.</p>
                            </Card>
                        </FadeReveal>

                        <FadeReveal delay={500} direction="up" distance={60}>
                            <Card className="p-6 md:p-8 border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#6FBEE5]/30 transition-all group h-full">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Shield className="w-7 h-7 text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Sui Secure</h3>
                                <p className="text-white/50 leading-relaxed font-medium">Enterprise-grade security integrated directly with your Sui wallet. Your data, your keys, your control.</p>
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
                                    Turn Data into <br /><span className="text-[#6FBEE5]">Decisions.</span>
                                </h2>
                            </FadeReveal>

                            <div className="space-y-6">
                                {[
                                    "Real-time transaction monitoring",
                                    "AI-driven yield optimization",
                                    "Automated expense categorization",
                                    "Intuitive asset management"
                                ].map((item, i) => (
                                    <FadeReveal key={i} delay={100 * i} direction="left" distance={40}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full bg-[#6FBEE5]/20 flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-[#6FBEE5]" />
                                            </div>
                                            <span className="text-lg font-medium text-white/80">{item}</span>
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
                                            <Card className="border-white/10 bg-white/5 backdrop-blur-2xl p-5 md:p-6 rounded-3xl shadow-2xl flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#6FBEE5]/20 flex items-center justify-center shrink-0">
                                                    <TrendingUp className="w-6 h-6 text-[#6FBEE5]" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Yield Optimization</p>
                                                    <p className="text-white text-sm font-bold">Move 50 SUI to Scallop for +2.4% APR</p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                                                    <ArrowRight className="w-4 h-4 text-white/40" />
                                                </div>
                                            </Card>
                                        </div>
                                    </FadeReveal>

                                    {/* Decision Card 2 - Main AI Mind */}
                                    <FadeReveal direction="right" distance={40} delay={300} scale={0.95}>
                                        <div className="z-10 relative">
                                            <Card className="border-[#6FBEE5]/30 bg-gradient-to-br from-[#6FBEE5]/20 to-transparent backdrop-blur-3xl p-6 md:p-8 rounded-[2.5rem] shadow-2xl">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(111,190,229,0.5)]">
                                                        <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-[#6FBEE5]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg sm:text-xl font-black text-white leading-tight">Mindy AI is Thinking...</h4>
                                                        <div className="flex gap-1 mt-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#6FBEE5] animate-bounce" />
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#6FBEE5] animate-bounce [animation-delay:0.2s]" />
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#6FBEE5] animate-bounce [animation-delay:0.4s]" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="h-2 w-full bg-white/10 rounded-full" />
                                                    <div className="h-2 w-5/6 bg-white/10 rounded-full" />
                                                    <div className="h-2 w-4/6 bg-white/10 rounded-full opacity-50" />
                                                </div>
                                            </Card>
                                        </div>
                                    </FadeReveal>

                                    {/* Decision Card 3 */}
                                    <FadeReveal direction="right" distance={40} delay={400} scale={0.95}>
                                        <div className="transform rotate-3 hover:rotate-0 transition-all duration-500 translate-x-8 sm:translate-x-12">
                                            <Card className="border-white/10 bg-white/5 backdrop-blur-2xl p-5 md:p-6 rounded-3xl shadow-2xl flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                                                    <Shield className="w-6 h-6 text-indigo-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Security Update</p>
                                                    <p className="text-white text-sm font-bold">Revoke 'UnknownDEX' permissions?</p>
                                                </div>
                                                <Button size="sm" className="bg-white/10 hover:bg-white/20 border-0 text-[10px] h-8 px-4 rounded-xl font-bold">Review</Button>
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
                                    Join thousands of users optimizing their Sui assets with AI intelligence. Build your wealth today.
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
