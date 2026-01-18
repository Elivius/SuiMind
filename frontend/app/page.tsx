"use client"

import { useRouter } from "next/navigation"
import { Aurora, Button, Card } from "@/components/ui"
import { useState, useEffect, useRef, ReactNode } from "react"
import {
    Wallet,
    Zap,
    TrendingUp,
    ArrowRight,
    Shield,
    Bot,
    BarChart3,
    CheckCircle2
} from "lucide-react"

// Premium Scroll Reveal Component
function ScrollReveal({
    children,
    delay = 0,
    direction = "up",
    duration = 700,
    distance = 40,
    blur = true,
    scale = 0.99
}: {
    children: ReactNode,
    delay?: number,
    direction?: "up" | "down" | "left" | "right" | "none",
    duration?: number,
    distance?: number,
    blur?: boolean,
    scale?: number
}) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            {
                threshold: 0.1,
                rootMargin: "-20px 0px -20px 0px"
            }
        )

        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    const directions = {
        up: `translate-y-[${distance}px]`,
        down: `translate-y-[-${distance}px]`,
        left: `translate-x-[${distance}px]`,
        right: `translate-x-[-${distance}px]`,
        none: ""
    }

    // Since tailwind doesn't support dynamic arbitrary values in classes easily, 
    // we'll use inline styles for the transform distance if it's custom, 
    // or just stick to safe standard ones. Let's use standard translation for reliability.
    const transformMap = {
        up: `translateY(${distance}px)`,
        down: `translateY(-${distance}px)`,
        left: `translateX(${distance}px)`,
        right: `translateX(-${distance}px)`,
        none: ""
    }

    return (
        <div
            ref={ref}
            style={{
                transitionDelay: isVisible ? `${delay}ms` : "0ms",
                transitionDuration: `${duration}ms`,
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                    ? "translate(0, 0) scale(1)"
                    : `${transformMap[direction]} scale(${scale})`,
                filter: blur ? (isVisible ? "blur(0px)" : "blur(8px)") : "none"
            }}
            className="transition-all"
        >
            {children}
        </div>
    )
}

export default function LandingPage() {
    const router = useRouter()

    return (
        <div className="relative min-h-screen bg-[#001B39] text-white overflow-x-hidden selection:bg-[#6FBEE5]/30 scroll-smooth">
            {/* Background Effect */}
            <div className="fixed inset-0 z-0">
                <Aurora
                    colorStops={["#00D2FF", "#3A7BD5", "#00D2FF"]}
                    amplitude={0.6}
                    blend={0.6}
                    speed={0.4}
                />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <ScrollReveal direction="none" duration={800}>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] flex items-center justify-center shadow-lg shadow-[#6FBEE5]/20">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">SuiMind</span>
                    </div>
                </ScrollReveal>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                    {["Features", "Security", "Insights"].map((item, i) => (
                        <ScrollReveal key={item} delay={100 * i} direction="none" duration={800}>
                            <button className="hover:text-white transition-colors">{item}</button>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal direction="none" duration={800} delay={400}>
                    <Button
                        onClick={() => router.push("/login")}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md rounded-xl px-6"
                    >
                        Launch App
                    </Button>
                </ScrollReveal>
            </nav>

            <main className="relative z-10">
                {/* HERO SECTION */}
                <section className="px-6 pt-20 pb-32 max-w-7xl mx-auto text-center">
                    <ScrollReveal delay={100} distance={20}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6FBEE5]/10 border border-[#6FBEE5]/20 text-[#6FBEE5] text-xs font-bold uppercase tracking-widest mb-8">
                            <Bot className="w-4 h-4" />
                            Empowering Sui Financials with AI
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={300} distance={40}>
                        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-8">
                            Your Money, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6FBEE5] via-white to-[#4A9FCC]">Intelligently</span> Managed.
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal delay={500} distance={30}>
                        <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                            The next generation of financial intelligence on Sui. Track activity, analyze cashflow, and get AI insights to grow your wealth.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={700} distance={20}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                onClick={() => router.push("/login")}
                                className="w-full sm:w-auto sm:min-w-[220px] justify-center px-10 py-8 text-lg font-bold bg-gradient-to-r from-[#6FBEE5] to-[#4A9FCC] hover:from-[#5DAED5] hover:to-[#3A8FBC] text-white border-0 rounded-2xl shadow-xl shadow-[#6FBEE5]/20 hover:shadow-[#6FBEE5]/40 transition-all hover:scale-[1.05] active:scale-[0.98]"
                            >
                                Start for Free
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto sm:min-w-[220px] justify-center px-10 py-8 text-lg font-bold border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-2xl text-white transition-all"
                            >
                                View Live Demo
                            </Button>
                        </div>
                    </ScrollReveal>
                </section>

                {/* FEATURES GRID */}
                <section className="px-6 py-32 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ScrollReveal delay={100} direction="up" distance={60}>
                            <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#6FBEE5]/30 transition-all group h-full">
                                <div className="w-14 h-14 rounded-2xl bg-[#6FBEE5]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-7 h-7 text-[#6FBEE5]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Cashflow Master</h3>
                                <p className="text-white/50 leading-relaxed font-medium">Automatic tracking of active and passive income with visual breakdowns of your monthly expenses.</p>
                            </Card>
                        </ScrollReveal>

                        <ScrollReveal delay={300} direction="up" distance={60}>
                            <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#6FBEE5]/30 transition-all group h-full">
                                <div className="w-14 h-14 rounded-2xl bg-sky-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Bot className="w-7 h-7 text-sky-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Mindy AI</h3>
                                <p className="text-white/50 leading-relaxed font-medium">Your personal financial assistant that analyzes your Sui activity to provide actionable growth advice.</p>
                            </Card>
                        </ScrollReveal>

                        <ScrollReveal delay={500} direction="up" distance={60}>
                            <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#6FBEE5]/30 transition-all group h-full">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Shield className="w-7 h-7 text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Sui Secure</h3>
                                <p className="text-white/50 leading-relaxed font-medium">Enterprise-grade security integrated directly with your Sui wallet. Your data, your keys, your control.</p>
                            </Card>
                        </ScrollReveal>
                    </div>
                </section>

                {/* DECISION SECTION */}
                <section className="px-6 py-32 bg-gradient-to-b from-transparent via-[#6FBEE5]/5 to-transparent">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1">
                            <ScrollReveal direction="left" distance={100}>
                                <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                                    Turn Data into <br /><span className="text-[#6FBEE5]">Decisions.</span>
                                </h2>
                            </ScrollReveal>

                            <div className="space-y-6">
                                {[
                                    "Real-time transaction monitoring",
                                    "AI-driven yield optimization",
                                    "Automated expense categorization",
                                    "Intuitive asset management"
                                ].map((item, i) => (
                                    <ScrollReveal key={i} delay={100 * i} direction="left" distance={40}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full bg-[#6FBEE5]/20 flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-[#6FBEE5]" />
                                            </div>
                                            <span className="text-lg font-medium text-white/80">{item}</span>
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <ScrollReveal direction="right" distance={80} scale={0.9}>
                                <div className="relative aspect-square max-w-md mx-auto">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] rounded-[3rem] blur-3xl opacity-20 animate-pulse" />
                                    <Card className="relative h-full w-full border-white/20 bg-white/5 backdrop-blur-2xl rounded-[3rem] overflow-hidden p-8 flex flex-col justify-center">
                                        <div className="space-y-6">
                                            <div className="h-12 w-full bg-white/10 rounded-xl" />
                                            <div className="h-12 w-3/4 bg-white/10 rounded-xl opacity-60" />
                                            <div className="h-40 w-full bg-gradient-to-br from-[#6FBEE5]/20 to-transparent rounded-2xl border border-white/10 flex items-center justify-center">
                                                <BarChart3 className="w-16 h-16 text-[#6FBEE5] opacity-50" />
                                            </div>
                                            <div className="h-12 w-full bg-white/10 rounded-xl opacity-30" />
                                        </div>
                                    </Card>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="px-6 py-40 text-center">
                    <ScrollReveal direction="up" distance={100} scale={0.95}>
                        <div className="max-w-4xl mx-auto p-12 sm:p-20 rounded-[3rem] bg-gradient-to-br from-[#6FBEE5] via-[#4A9FCC] to-[#3A7BD5] relative overflow-hidden shadow-2xl shadow-[#6FBEE5]/20">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                            <ScrollReveal delay={200} distance={20} direction="none">
                                <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter mb-8 relative z-10 leading-[0.9]">
                                    Ready to Upgrade Your <br />Financial Mindset?
                                </h2>
                            </ScrollReveal>

                            <ScrollReveal delay={400} distance={10} direction="none">
                                <p className="text-white/80 text-lg sm:text-xl mb-12 relative z-10 font-medium max-w-2xl mx-auto">
                                    Join thousands of users optimizing their Sui assets with AI intelligence. Build your wealth today.
                                </p>
                            </ScrollReveal>

                            <ScrollReveal delay={600} distance={15} direction="none">
                                <Button
                                    onClick={() => router.push("/login")}
                                    className="bg-white text-[#001B39] hover:bg-[#F0F9FF] px-12 py-8 text-2xl font-black rounded-2xl shadow-2xl relative z-10 transition-all hover:scale-105 active:scale-95"
                                >
                                    Get Started Now
                                </Button>
                            </ScrollReveal>
                        </div>
                    </ScrollReveal>
                </section>
            </main>

            <footer className="relative z-10 px-6 py-16 border-t border-white/10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                <ScrollReveal direction="none" delay={100}>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-[#6FBEE5]" />
                        </div>
                        <span className="text-2xl font-bold tracking-tighter">SuiMind</span>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="none" delay={300}>
                    <p className="text-white/40 text-sm font-medium">© 2026 SuiMind. Built on Sui Network.</p>
                </ScrollReveal>

                <div className="flex gap-8 text-white/40 text-sm font-medium">
                    {["Twitter", "Discord", "Docs"].map((item, i) => (
                        <ScrollReveal key={item} delay={200 * i} direction="none">
                            <button className="hover:text-white transition-colors">{item}</button>
                        </ScrollReveal>
                    ))}
                </div>
            </footer>
        </div>
    )
}
