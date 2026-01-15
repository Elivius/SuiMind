"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Aurora from "@/components/ui/Aurora"
import { Wallet, Chrome } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()

    const handleWalletConnect = () => {
        // Mock wallet connect
        router.push("/home-page")
    }

    const handleGoogleLogin = () => {
        // Mock google login
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
                <div className="flex flex-col items-center mb-12">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] flex items-center justify-center shadow-2xl shadow-[#6FBEE5]/30 mb-6 animate-bounce-subtle">
                        <Wallet className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        SuiMind
                    </h1>
                    <p className="text-white/60 text-base sm:text-lg font-medium tracking-wide text-center">AI-Powered Financial Intelligence</p>
                </div>

                <Card className="border-white/20 backdrop-blur-2xl bg-white/5 p-8 shadow-2xl relative overflow-hidden group">
                    {/* Decorative elements */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6FBEE5]/10 rounded-full blur-3xl group-hover:bg-[#6FBEE5]/20 transition-all duration-700" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/20 transition-all duration-700" />

                    <div className="relative z-10 space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-white text-2xl font-bold mb-2">Welcome Back</h2>
                            <p className="text-white/50 text-lg font-medium tracking-wide">Select your preferred login method</p>
                        </div>

                        <Button
                            onClick={handleWalletConnect}
                            className="w-full py-6 sm:py-8 text-base sm:text-lg font-bold bg-gradient-to-r from-[#6FBEE5] to-[#4A9FCC] hover:from-[#5DAED5] hover:to-[#3A8FBC] text-white border-0 rounded-2xl shadow-lg shadow-[#6FBEE5]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            <Wallet className="w-6 h-6" />
                            Connect Sui Wallet
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#001B39]/50 backdrop-blur-sm px-4 text-white/30 font-medium tracking-widest">or</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-base font-semibold group/google"
                        >
                            <Chrome className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                            Continue with Google
                        </button>
                    </div>
                </Card>

                <p className="mt-12 text-center text-sm text-white/30">
                    By connecting, you agree to our <button className="hover:text-white underline transition-colors">Terms of Service</button>
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
