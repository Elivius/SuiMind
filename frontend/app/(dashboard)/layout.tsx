"use client"

import { useState, useRef, useEffect } from "react"
import { Wallet, Bell, Home, Clock, Bot, Lightbulb, Copy, LogOut, ChevronDown, Check } from "lucide-react"
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

// Mock wallet address - replace with actual wallet connection logic
const WALLET_ADDRESS = "0x7b62d94a0b62c5c37c7b62d94a0b62c57c75"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [walletDropdownOpen, setWalletDropdownOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Determine active nav index based on current path
    const activeIndex = navItems.findIndex(item => pathname === item.href)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setWalletDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    const handleCopyAddress = async () => {
        await navigator.clipboard.writeText(WALLET_ADDRESS)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDisconnect = () => {
        // Add your wallet disconnect logic here
        setWalletDropdownOpen(false)
        console.log("Disconnecting wallet...")
    }

    const isLoginPage = pathname === "/login"

    if (isLoginPage) {
        return <div className="relative min-h-screen bg-[#001B39] text-white">{children}</div>
    }

    return (
        <div className="relative min-h-screen bg-[#001B39] text-white">
            {/* DarkVeil Background */}
            <DarkVeil
                className="fixed inset-0 z-0 pointer-events-none opacity-60"
                speed={0.25}
                hueShift={0}
                noiseIntensity={0.02}
                warpAmount={0.15}
            />

            {/* Floating orbs for depth */}
            <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9945FF]/20 rounded-full blur-[128px] animate-float-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#14F195]/15 rounded-full blur-[100px] animate-float-slower" />
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#9945FF]/10 rounded-full blur-[80px] animate-float" />
            </div>

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

                            {/* Center Nav - Absolute positioned for true center */}
                            <div className="hidden min-[1025px]:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ height: '45px' }}>
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

                                {/* Wallet Connect Button with Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-2 h-9 sm:h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                        <span className="text-sm font-medium hidden sm:inline">{truncateAddress(WALLET_ADDRESS)}</span>
                                        <span className="text-sm font-medium sm:hidden">{`${WALLET_ADDRESS.slice(0, 4)}...${WALLET_ADDRESS.slice(-3)}`}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${walletDropdownOpen ? 'rotate-180' : ''}`} />
                                    </Button>

                                    {/* Dropdown Menu */}
                                    {walletDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#001B39]/95 backdrop-blur-xl shadow-xl overflow-hidden">
                                            {/* Connected Status */}
                                            <div className="px-4 py-3 border-b border-white/10">
                                                <p className="text-xs text-white/50">Connected</p>
                                                <p className="text-sm font-medium text-white/90 mt-0.5">{truncateAddress(WALLET_ADDRESS)}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="py-1">
                                                <button
                                                    onClick={handleCopyAddress}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${copied ? 'text-emerald-400' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                                                >
                                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                    {copied ? "Copied!" : "Copy Address"}
                                                </button>
                                                <button
                                                    onClick={handleDisconnect}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Disconnect
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content - add padding top for fixed header, padding bottom on mobile for fixed bottom nav */}
                <main className="flex-1 pt-[72px] pb-20 min-[1025px]:pb-0">
                    {children}
                </main>

                {/* Footer - hidden on mobile */}
                <div className="hidden min-[1025px]:block">
                    <Footer />
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="min-[1025px]:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 backdrop-blur-xl bg-[#001B39]/40">
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
