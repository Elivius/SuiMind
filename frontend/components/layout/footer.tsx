"use client"

import { SuiMindLogo } from "@/components/icons"


export function Footer() {
    return (
        <footer className="relative z-10 px-6 md:px-12 py-16 border-t border-white/10 w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
                    <SuiMindLogo />
                </div>
                <span className="text-2xl font-bold tracking-tighter text-white">SuiMind</span>
            </div>

            <p className="text-white/40 text-sm font-medium">© 2026 SuiMind. Built on Sui Network.</p>
        </footer>
    )
}