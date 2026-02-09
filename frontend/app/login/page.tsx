"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { Card, GoogleLoginButton, WalletConnectButton } from "@/components/ui"
import { LoadingScreen } from "@/components/layout"
import { Wallet, ArrowLeft } from "lucide-react"
import { SuiMindLogo } from "@/components/icons"
import Link from "next/link"

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
            <LoadingScreen message="Redirecting..." className="min-h-screen" />
        )
    }

    return (
        <div className="relative min-h-screen text-white flex items-center justify-center overflow-hidden">
            {/* Back Button */}
            <Link
                href="/"
                className="absolute top-6 left-6 sm:top-10 sm:left-10 z-20 flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all group scale-100 hover:scale-105 active:scale-95 shadow-xl backdrop-blur-md animate-in fade-in duration-1000 ease-out"
            >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:-translate-x-1.5 transition-all" />
                <span className="text-base sm:text-lg font-black tracking-tight text-white">Back</span>
            </Link>

            <div className="relative z-10 w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
                <div className="flex flex-col items-center mb-12">
                    <div className="w-30 h-30 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#9945FF]/30 mb-8 animate-bounce-subtle">
                        <SuiMindLogo />
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                        SuiMind
                    </h1>
                    <p className="text-white text-base sm:text-lg font-medium tracking-wide text-center">AI-Powered Financial Intelligence</p>
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
            </div>
        </div>
    )
}