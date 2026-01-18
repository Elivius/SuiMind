"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useCurrentAccount } from "@mysten/dapp-kit"

const AUTH_GRACE_PERIOD_MS = 1000

export function useAuthProtection() {
    const currentAccount = useCurrentAccount()
    const router = useRouter()
    const pathname = usePathname()
    const isLoginPage = pathname === "/login"
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
        if (!isAuthChecking && !currentAccount && !isLoginPage) {
            router.push("/login")
        }
    }, [isAuthChecking, currentAccount, isLoginPage, router])

    // Show spinner if checking auth OR if unauthorized (pending redirect)
    const isLoading = (isAuthChecking || !currentAccount) && !isLoginPage

    return {
        isLoading,
        isLoginPage
    }
}
