"use client"

import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
    className?: string
    size?: "sm" | "md" | "lg"
}

const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
}

export function LoadingSpinner({ className = "", size = "md" }: LoadingSpinnerProps) {
    return (
        <div className={`${sizeClasses[size]} border-2 border-white/30 border-t-white rounded-full animate-spin ${className}`} />
    )
}