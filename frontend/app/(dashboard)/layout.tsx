"use client"

import { DarkVeil, FloatingOrbs } from "@/components/ui"
import { Header, MobileNav, Footer, LoadingScreen } from "@/components/layout"
import { useAuthProtection } from "@/hooks/useAuthProtection"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isLoading, isLoginPage } = useAuthProtection()

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
                    <LoadingScreen message="Verifying access..." />
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