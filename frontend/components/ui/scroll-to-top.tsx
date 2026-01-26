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
                "fixed left-1/2 -translate-x-1/2 bottom-24 min-[1025px]:bottom-10 z-50 transition-all duration-300 pointer-events-none opacity-0 translate-y-4",
                isVisible && "opacity-100 translate-y-0 pointer-events-auto",
            )}
        >
            <Button
                onClick={scrollToTop}
                size="icon"
                className="size-12 rounded-full bg-[#6FBEE5]/20 hover:bg-[#6FBEE5]/40 text-[#6FBEE5] border border-[#6FBEE5]/30 backdrop-blur-md shadow-lg shadow-[#6FBEE5]/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
            >
                <ChevronUp className="size-6 group-hover:-translate-y-1 transition-transform" />
            </Button>
        </div>
    )
}
