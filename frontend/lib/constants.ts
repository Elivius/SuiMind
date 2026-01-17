import { Home, Clock, Bot, Lightbulb } from "lucide-react"

// Navigation items for the dashboard
export const navigation = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Insights", href: "/insights", icon: Lightbulb },
    { label: "Recent Activity", href: "/recent-activity", icon: Clock },
    { label: "Mindy AI", href: "/mindy-ai", icon: Bot },
]

// Mock wallet address - replace with actual wallet connection logic
export const WALLET_ADDRESS = "0x7b62d94a0b62c5c37c7b62d94a0b62c57c75"
