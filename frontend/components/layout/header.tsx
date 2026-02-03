"use client"

import { Wallet, Bell } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import GooeyNav from "@/components/ui/gooey-nav"
import { navigation } from "@/lib/constants"
import { WalletConnectButton } from "@/components/ui/wallet-connect-button"
import { SuiMindLogo, MindyAILogo } from "@/components/icons"

export function Header() {
    const pathname = usePathname()

    // Determine active nav index based on current path
    const activeIndex = navigation.findIndex(item => pathname === item.href)

    return (
        <header className="border-b border-white/10 backdrop-blur-xl bg-white/5 fixed top-0 left-0 right-0 z-40">
            <div className="w-full px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link
                        href="/home"
                        onClick={(e) => {
                            if (pathname === "/home") {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                        className="flex items-center gap-2 sm:gap-3 flex-shrink-0 hover:opacity-80 transition-opacity"
                    >
                        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden flex-shrink-0 transition-transform active:scale-95 duration-200">
                            <SuiMindLogo />
                        </div>
                        <h1 className="text-lg sm:text-2xl font-bold">SuiMind</h1>
                    </Link>

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

                        <WalletConnectButton />
                    </div>
                </div>
            </div>
        </header>
    )
}