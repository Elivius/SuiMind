"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navigation } from "@/lib/constants"

export function MobileNav() {
    const pathname = usePathname()

    return (
        <nav className="min-[1025px]:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 backdrop-blur-xl bg-[#001B39]/40">
            <div className="flex items-center justify-around py-2 px-2 safe-area-inset-bottom">
                {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`cursor-pointer flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 min-w-[60px] ${isActive
                                ? 'text-[#6FBEE5] bg-[#6FBEE5]/10'
                                : 'text-white/50 hover:text-white/70'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}