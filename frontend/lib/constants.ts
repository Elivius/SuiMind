import { Home, Clock, Bot, Lightbulb } from "lucide-react"
import { MindyAILogo } from "@/components/icons"

// Navigation items for the dashboard
export const navigation = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Insights", href: "/insights", icon: Lightbulb },
    { label: "Recent Activity", href: "/recent-activity", icon: Clock },
    { label: "Mindy AI", href: "/mindy-ai", icon: MindyAILogo },
]

export const SUI_COIN_TYPE = "0x2::sui::SUI";
export const MIST_PER_SUI = 1_000_000_000;

// For graphQL return data matching
export const GQL_SUI_COIN_TYPE = "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI"