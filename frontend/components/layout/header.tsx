"use client"

import { useState, useRef, useEffect } from "react"
import { Wallet, Bell, Copy, LogOut, ChevronDown, Check } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import GooeyNav from "@/components/ui/gooey-nav"
import { truncateAddress } from "@/lib/utils"
import { navigation, WALLET_ADDRESS } from "@/lib/constants"

export function Header() {
    const pathname = usePathname()
    const [walletDropdownOpen, setWalletDropdownOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Determine active nav index based on current path
    const activeIndex = navigation.findIndex(item => pathname === item.href)

    const handleCopyAddress = async () => {
        await navigator.clipboard.writeText(WALLET_ADDRESS)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDisconnect = () => {
        // Add wallet disconnect logic here
        setWalletDropdownOpen(false)
    }

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

    return (
        <header className="border-b border-white/10 backdrop-blur-xl bg-white/5 fixed top-0 left-0 right-0 z-40">
            <div className="w-full px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] flex items-center justify-center">
                            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <h1 className="text-lg sm:text-xl font-bold">SuiMind</h1>
                    </div>

                    {/* Center Nav - Desktop only */}
                    <div className="hidden min-[1025px]:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ height: '45px' }}>
                        <GooeyNav
                            items={navigation}
                            particleCount={5}
                            particleDistances={[90, 10]}
                            particleR={100}
                            initialActiveIndex={activeIndex >= 0 ? activeIndex : 0}
                            animationTime={600}
                            timeVariance={300}
                            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                        />
                    </div>

                    {/* Right side actions */}
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
                                <span className="text-sm font-medium sm:hidden">{truncateAddress(WALLET_ADDRESS, 4, 3)}</span>
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
    )
}