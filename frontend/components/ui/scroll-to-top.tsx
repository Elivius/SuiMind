"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener("scroll", toggleVisibility)
        return () => window.removeEventListener("scroll", toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    return (
        <div
            className={cn(
                "fixed left-1/2 -translate-x-1/2 z-30 transition-all duration-300 pointer-events-none opacity-0 translate-y-[-20px]",
                isVisible && "opacity-100 translate-y-0 pointer-events-auto",
                "top-[100px]" // Positioned below the navbar
            )}
        >
            <Button
                onClick={scrollToTop}
                size="sm"
                className="bg-[#6FBEE5]/20 hover:bg-[#6FBEE5]/40 text-[#6FBEE5] border border-[#6FBEE5]/30 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 group transition-all"
            >
                <ChevronUp className="w-4 h-4 group-hover:block transition-all" />
                <span className="text-xs font-bold uppercase tracking-wider">Back to top</span>
            </Button>
        </div>
    )
}
