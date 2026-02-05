"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface CopyAddressProps {
    fullAddress: string
    displayAddress: string
}

export function CopyAddress({ fullAddress, displayAddress }: CopyAddressProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(fullAddress)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 hover:bg-white/10 py-0.5 rounded transition-colors group/copy"
            title="Copy Address"
        >
            <span className="truncate max-w-[120px] md:max-w-[160px]">{displayAddress}</span>
            {copied ? (
                <Check className="w-3 h-3 text-green-400 ml-1" />
            ) : (
                <Copy className="w-3 h-3 text-white/60 group-hover/copy:text-white/80 transition-colors ml-1" />
            )}
        </button>
    )
}
