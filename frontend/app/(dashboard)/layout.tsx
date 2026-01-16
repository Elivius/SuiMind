"use client"

import { Wallet, Settings, Bell, Home, Clock, Bot, Lightbulb } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import DarkVeil from "@/components/ui/dark-veil"
import GooeyNav from "@/components/ui/gooey-nav"
import Footer from "@/components/ui/footer"

const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Insights", href: "/insights", icon: Lightbulb },
    { label: "Recent Activity", href: "/recent-activity", icon: Clock },
    { label: "Mindy AI", href: "/mindy-ai", icon: Bot },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()

    // Determine active nav index based on current path
    const activeIndex = navItems.findIndex(item => pathname === item.href)

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#001B39] text-white">
            {/* DarkVeil Background */}
            <DarkVeil
                className="fixed inset-0 z-0 pointer-events-none opacity-40"
                speed={0.3}
                hueShift={0}
                noiseIntensity={0.05}
                warpAmount={0.2}
            />

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <header className="border-b border-white/10 backdrop-blur-xl bg-white/5 fixed top-0 left-0 right-0 z-40">
                    <div className="w-full px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] flex items-center justify-center">
                                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <h1 className="text-lg sm:text-xl font-bold">SuiMind</h1>
                            </div>

                            <div className="hidden lg:block" style={{ height: '45px', position: 'relative' }}>
                                <GooeyNav
                                    items={navItems}
                                    particleCount={5}
                                    particleDistances={[90, 10]}
                                    particleR={100}
                                    initialActiveIndex={activeIndex >= 0 ? activeIndex : 0}
                                    animationTime={600}
                                    timeVariance={300}
                                    colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                                />
                            </div>

                            <div className="flex items-center gap-1 sm:gap-2">
                                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 w-9 h-9 sm:w-10 sm:h-10">
                                    <Bell className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 w-9 h-9 sm:w-10 sm:h-10">
                                    <Settings className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content - add padding top for fixed header, padding bottom on mobile for fixed bottom nav */}
                <main className="flex-1 pt-[72px] pb-20 lg:pb-0">
                    {children}
                </main>

                {/* Footer - hidden on mobile */}
                <div className="hidden lg:block">
                    <Footer />
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 backdrop-blur-xl bg-[#001B39]/90">
                    <div className="flex items-center justify-around py-2 px-2 safe-area-inset-bottom">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <button
                                    key={item.href}
                                    onClick={() => router.push(item.href)}
                                    className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 min-w-[60px] ${isActive
                                        ? 'text-[#6FBEE5] bg-[#6FBEE5]/10'
                                        : 'text-white/50 hover:text-white/70'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                                    <span className="text-[10px] font-medium">{item.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </nav>
            </div>
        </div>
    )
}
