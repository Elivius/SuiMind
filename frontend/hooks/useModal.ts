"use client"

import { useState, useCallback } from "react"

interface UseModalReturn {
    isOpen: boolean
    isClosing: boolean
    open: () => void
    close: () => void
}

/**
 * A reusable hook for managing modal state with animated close.
 * Handles the closing animation delay before actually closing the modal.
 * 
 * @param animationDuration - Duration of the close animation in ms (default: 300)
 */
export function useModal(animationDuration = 300): UseModalReturn {
    const [isOpen, setIsOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    const open = useCallback(() => {
        setIsOpen(true)
        setIsClosing(false)
    }, [])

    const close = useCallback(() => {
        setIsClosing(true)
        setTimeout(() => {
            setIsOpen(false)
            setIsClosing(false)
        }, animationDuration)
    }, [animationDuration])

    return { isOpen, isClosing, open, close }
}
