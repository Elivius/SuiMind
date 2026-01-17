"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useCurrentAccount } from "@mysten/dapp-kit"
import DarkVeil from "@/components/ui/dark-veil"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { FloatingOrbs } from "@/components/ui/floating-orbs"
import { Header, MobileNav, Footer } from "@/components/layout"

const AUTH_GRACE_PERIOD_MS = 1000

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const currentAccount = useCurrentAccount()
    const router = useRouter()
    const pathname = usePathname()
    const isLoginPage = pathname === "/login"
    const [isAuthChecking, setIsAuthChecking] = useState(true)

    // Handle auth checking grace period
    useEffect(() => {
        if (currentAccount) {
            setIsAuthChecking(false)
        } else {
            const timeout = setTimeout(() => setIsAuthChecking(false), AUTH_GRACE_PERIOD_MS)
            return () => clearTimeout(timeout)
        }
    }, [currentAccount])

    // Redirect to login if not connected after grace period
    useEffect(() => {
        if (!isAuthChecking && !currentAccount && !isLoginPage) {
            router.push("/login")
        }
    }, [isAuthChecking, currentAccount, isLoginPage, router])

    const isLoading = isAuthChecking && !isLoginPage

    return (
        <div className="relative min-h-screen bg-black text-white">
            {/* DarkVeil Background */}
            <DarkVeil
                className="fixed inset-0 z-0 pointer-events-none"
                speed={0.25}
                hueShift={0}
                noiseIntensity={0.02}
                warpAmount={0.15}
            />

            {/* Floating orbs for depth */}
            <FloatingOrbs />

            <div className="relative z-10 flex flex-col min-h-screen">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    )
}