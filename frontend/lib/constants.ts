import { Home, Clock, Bot, Lightbulb } from "lucide-react"

// Navigation items for the dashboard
export const navigation = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Insights", href: "/insights", icon: Lightbulb },
    { label: "Recent Activity", href: "/recent-activity", icon: Clock },
    { label: "Mindy AI", href: "/mindy-ai", icon: Bot },
]

export const SUI_COIN_TYPE = "0x2::sui::SUI";
export const MIST_PER_SUI = 1_000_000_000;

// For graphQL return data matching
export const GQL_SUI_COIN_TYPE = "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI"

// ============= UI =============
// Shared chart colors - Insight Page
export const CHART_GRADIENT_COLORS = Array.from({ length: 20 }, (_, i) => `url(#grad${i + 1})`)

export const CHART_FLAT_COLORS = [
    "#6FBEE5", "#00FFD1", "#818CF8", "#4A9FCC", "#F472B6",
    "#FB923C", "#4ADE80", "#2DD4BF", "#A78BFA", "#F87171",
    "#60A5FA", "#34D399", "#FBBF24", "#C084FC", "#FB7185",
    "#22D3EE", "#86EFAC", "#93C5FD", "#FDA4AF", "#5EEAD4"
]

// Shared tooltip style
export const CHART_TOOLTIP_STYLE = {
    backgroundColor: "rgba(10, 20, 35, 0.9)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    padding: "12px 16px",
}
// ================================