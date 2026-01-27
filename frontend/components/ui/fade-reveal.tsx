"use client"

import { useState, useEffect, useRef, ReactNode } from "react"

interface FadeRevealProps {
    children: ReactNode
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    duration?: number
    distance?: number
    blur?: boolean
    scale?: number
    triggerOnce?: boolean
}

/**
 * A simple fade-reveal component using Intersection Observer.
 * Different from the GSAP-based ScrollReveal in scroll-reveal.tsx which does text splitting.
 */
export function FadeReveal({
    children,
    delay = 0,
    direction = "up",
    duration = 700,
    distance = 40,
    blur = true,
    scale = 0.99,
    triggerOnce = false
}: FadeRevealProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (triggerOnce) {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                        if (ref.current) observer.unobserve(ref.current)
                    }
                } else {
                    setIsVisible(entry.isIntersecting)
                }
            },
            {
                threshold: 0.1,
                rootMargin: "-20px 0px -20px 0px"
            }
        )

        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [triggerOnce])

    const transformMap = {
        up: `translate3d(0, ${distance}px, 0)`,
        down: `translate3d(0, -${distance}px, 0)`,
        left: `translate3d(${distance}px, 0, 0)`,
        right: `translate3d(-${distance}px, 0, 0)`,
        none: "translate3d(0, 0, 0)"
    }

    return (
        <div
            ref={ref}
            style={{
                transitionDelay: isVisible ? `${delay}ms` : "0ms",
                transitionDuration: `${duration}ms`,
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                    ? "translate3d(0, 0, 0) scale(1)"
                    : `${transformMap[direction]} scale(${scale})`,
                filter: blur ? (isVisible ? "none" : "blur(8px)") : "none",
                WebkitBackfaceVisibility: "hidden",
                backfaceVisibility: "hidden"
            }}
            className="transition-all"
        >
            {children}
        </div>
    )
}