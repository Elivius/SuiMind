"use client"

import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LoadingScreenProps {
    message?: string
    className?: string
}

export function LoadingScreen({
    message = "Loading...",
    className = ""
}: LoadingScreenProps) {
    return (
        <div className={`flex-1 flex flex-col items-center justify-center gap-4 ${className}`}>
            <LoadingSpinner size="lg" />
            <p className="text-white/50 text-sm font-medium animate-pulse">
                {message}
            </p>
        </div>
    )
}