// ============= Insights Page Types =============

// --- Bar/Line Chart (Monthly Cashflow) ---
export interface MonthlyCashflow {
    month: string
    inFlow: number
    outFlow: number
    netFlow: number
}

export interface CashflowChartProps {
    data: MonthlyCashflow[]
    isLoading: boolean
}

// --- Pie Chart (Expenses Allocation) ---
export interface ExpenseCategory {
    name: string
    value: number
    [key: string]: string | number  // Index signature for Recharts compatibility
}

export interface ExpensesPieChartProps {
    data: ExpenseCategory[]
    isLoading: boolean
}

// --- useInsightsData Hook Return ---
export interface InsightsTotals {
    totalInFlow: number
    totalOutFlow: number
    totalNetFlow: number
    thisMonthNetFlow: number  // Current month's net balance for card display
    thisMonthTransactionCount: number  // Current month's transaction count
    monthOverMonthChange: number  // Percentage change vs last month
    inFlowTransactionCount: number  // Combined total across all months
    outFlowTransactionCount: number  // Combined total across all months
}

export interface FrequentContact {
    address: string
    name?: string
    txCount: number
    sent: number
    received: number
    cashflow: number
    lastTxTime: number
}

export interface UseInsightsDataReturn {
    cashflowData: MonthlyCashflow[]
    expensesData: ExpenseCategory[]
    frequentContacts: FrequentContact[]
    totals: InsightsTotals
    isLoading: boolean
}