"use client"

import { useAuthProtection } from "@/hooks/useAuthProtection"
import { LoadingScreen } from "@/components/layout"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isLoading } = useAuthProtection()

    if (isLoading) {
        return <LoadingScreen message="Verifying access..." />
    }

    return <>{children}</>
}