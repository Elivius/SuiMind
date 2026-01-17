"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useCurrentAccount } from "@mysten/dapp-kit"
import DarkVeil from "@/components/ui/dark-veil"
import { Header, MobileNav, Footer } from "@/components/layout"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const currentAccount = useCurrentAccount()
    const router = useRouter()
    const pathname = usePathname()
    const isLoginPage = pathname === "/login"

    // Redirect to login if not connected (except on login page)
    useEffect(() => {
        if (!currentAccount && !isLoginPage) {
            router.push("/login")
        }
    }, [currentAccount, isLoginPage, router])

    // Prevent flash of white screen
    if (!currentAccount && !isLoginPage) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="relative min-h-screen bg-[#001B39] text-white">
            {/* DarkVeil Background - shared across all pages */}
            <DarkVeil
                className="fixed inset-0 z-0 pointer-events-none opacity-60"
                speed={0.25}
                hueShift={0}
                noiseIntensity={0.02}
                warpAmount={0.15}
            />

            {/* Floating orbs for depth - shared across all pages */}
            <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9945FF]/20 rounded-full blur-[128px] animate-float-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#14F195]/15 rounded-full blur-[100px] animate-float-slower" />
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#9945FF]/10 rounded-full blur-[80px] animate-float" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header - only show when NOT on login page */}
                {!isLoginPage && <Header />}

                {/* Main Content */}
                <main className={`flex-1 ${isLoginPage ? 'flex items-center justify-center' : 'pt-[72px] pb-20 min-[1025px]:pb-0'}`}>
                    {children}
                </main>

                {/* Footer - only show when NOT on login page, hidden on mobile */}
                {!isLoginPage && (
                    <div className="hidden min-[1025px]:block">
                        <Footer />
                    </div>
                )}

                {/* Mobile Bottom Navigation - only show when NOT on login page */}
                {!isLoginPage && <MobileNav />}
            </div>
        </div>
    )
}