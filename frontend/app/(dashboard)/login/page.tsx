"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { Card } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import { GoogleLoginButton } from "@/components/ui/google-login-button"
import { WalletConnectButton } from "@/components/ui/wallet-connect-button"

export default function LoginPage() {
    const currentAccount = useCurrentAccount()
    const router = useRouter()

    useEffect(() => {
        if (currentAccount) {
            router.push("/home")
        }
    }, [currentAccount, router])

    // Show redirecting state when connected
    if (currentAccount) {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                <p className="text-white/50 text-sm">Redirecting...</p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md p-6">
            <div className="flex flex-col items-center mb-12">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center shadow-2xl shadow-[#9945FF]/30 mb-6 animate-bounce-subtle">
                    <Wallet className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    SuiMind
                </h1>
                <p className="text-white/60 text-base sm:text-lg font-medium tracking-wide text-center">AI-Powered Financial Intelligence</p>
            </div>

            <Card className="border-white/20 backdrop-blur-2xl bg-white/5 p-8 shadow-2xl relative overflow-hidden group rounded-2xl">
                {/* Decorative elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#9945FF]/10 rounded-full blur-3xl group-hover:bg-[#9945FF]/20 transition-all duration-700" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#14F195]/10 rounded-full blur-3xl group-hover:bg-[#14F195]/20 transition-all duration-700" />

                <div className="relative z-10 space-y-6">
                    <div className="text-center mb-8">
                        <h2 className="text-white text-2xl font-bold mb-2">Welcome Back</h2>
                        <p className="text-white/50 text-lg font-medium tracking-wide">Select your preferred login method</p>
                    </div>

                    <WalletConnectButton />

                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="text-white/30 text-xs font-medium tracking-widest uppercase">or</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                    </div>

                    <GoogleLoginButton />
                </div>
            </Card>

            <p className="mt-12 text-center text-sm text-white/30">
                By connecting, you agree to our <button className="hover:text-white underline transition-colors">Terms of Service</button>
            </p>

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