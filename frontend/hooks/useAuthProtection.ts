// Use to protect auth - Prevent user from accessing protected routes (dashboard) if not connected

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCurrentAccount } from "@mysten/dapp-kit"

const AUTH_GRACE_PERIOD_MS = 1000

export function useAuthProtection() {
    const currentAccount = useCurrentAccount()
    const router = useRouter()
    const [isAuthChecking, setIsAuthChecking] = useState(true)

    // Handle auth checking grace period
    useEffect(() => {
        if (currentAccount) {
            setIsAuthChecking(false)
        } else {
            const timeout = setTimeout(() => setIsAuthChecking(false), AUTH_GRACE_PERIOD_MS)
            return () => clearTimeout(timeout)
        }
    }, [currentAccount])

    // Redirect to login if not connected after grace period
    useEffect(() => {
        if (!isAuthChecking && !currentAccount) {
            router.push("/login")
        }
    }, [isAuthChecking, currentAccount, router])

    // Show spinner if checking auth OR if unauthorized (pending redirect)
    const isLoading = isAuthChecking || !currentAccount

    return { isLoading }
}
