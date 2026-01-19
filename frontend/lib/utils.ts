import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Truncates a wallet/blockchain address for display
 * @example truncateAddress("0x7b62d94a0b62c5c37c7b62d94a0b62c57c75") => "0x7b62...7c75"
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4) {
  if (!address) return ""
  if (address.length <= startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}
