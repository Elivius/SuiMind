"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Aurora from "@/components/ui/Aurora"
import { Wallet, Mail, Lock, ArrowRight, Github, Chrome } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock login
        router.push("/home-page")
    }

    const handleWalletConnect = () => {
        // Mock wallet connect
        router.push("/home-page")
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#001B39] text-white flex items-center justify-center p-6">
            {/* Aurora Background */}
            <div className="fixed inset-0 z-0">
                <Aurora
                    colorStops={["#00D2FF", "#3A7BD5", "#00D2FF"]}
                    amplitude={0.5}
                    blend={0.5}
                    speed={0.5}
                />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="flex flex-col items-center mb-9">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] flex items-center justify-center shadow-2xl shadow-[#6FBEE5]/30 mb-6 animate-bounce-subtle">
                        <Wallet className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        SuiMind
                    </h1>
                    <p className="text-white/60 text-lg font-medium tracking-wide">AI-Powered Financial Intelligence</p>
                </div>

                <Card className="border-white/20 backdrop-blur-2xl bg-white/5 p-8 shadow-2xl relative overflow-hidden group">
                    {/* Decorative elements */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6FBEE5]/10 rounded-full blur-3xl group-hover:bg-[#6FBEE5]/20 transition-all duration-700" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />

                    <div className="relative z-10">
                        <div className="space-y-4 mb-8">
                            <Button
                                onClick={handleWalletConnect}
                                className="w-full py-7 text-lg font-bold bg-gradient-to-r from-[#6FBEE5] to-[#4A9FCC] hover:from-[#5DAED5] hover:to-[#3A8FBC] text-white border-0 rounded-2xl shadow-lg shadow-[#6FBEE5]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <Wallet className="w-6 h-6" />
                                Connect Sui Wallet
                            </Button>
                        </div>

                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm uppercase">
                                <span className="bg-transparent px-4 text-white/40 font-medium tracking-widest">or continue with</span>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white/70 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#6FBEE5]/50 focus:border-[#6FBEE5]/50 transition-all bg-opacity-50"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white/70 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#6FBEE5]/50 focus:border-[#6FBEE5]/50 transition-all bg-opacity-50"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-6 text-base font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                Sign In
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </form>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                                <Chrome className="w-4 h-4" />
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                                <Github className="w-4 h-4" />
                                GitHub
                            </button>
                        </div>
                    </div>
                </Card>

                <p className="mt-8 text-center text-sm text-white/40">
                    Don&apos;t have an account?{" "}
                    <button className="text-[#6FBEE5] font-semibold hover:underline">Create one for free</button>
                </p>
            </div>

            <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}
