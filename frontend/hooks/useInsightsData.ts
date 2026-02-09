// Use to process transactions history and generate insights data

import { useMemo } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { useGetInsightTransactions } from "@/hooks"
import { processTx, getMonthYearKey, getMonthDisplay } from "@/lib/utils"
import type { ExpenseCategory, MonthlyCashflow, UseInsightsDataReturn, FrequentContact } from "@/types/insights"

export function useInsightsData(): UseInsightsDataReturn {
    const account = useCurrentAccount()
    const { data: transactionData, isLoading } = useGetInsightTransactions()

    const { cashflowData, expensesData, frequentContacts, totals } = useMemo(() => {
        const transactions = transactionData?.transactions || []

        const processedTransactions = transactions
            .map((tx) => processTx(tx, account?.address))
            .filter((tx): tx is NonNullable<typeof tx> => tx !== null)


        // Aggregate by month for cashflow chart
        const monthlyData: Record<string, { inFlow: number; outFlow: number; displayMonth: string }> = {}
        const expenseCategories: Record<string, number> = {}

        let totalInFlow = 0
        let totalOutFlow = 0
        let inFlowTransactionCount = 0
        let outFlowTransactionCount = 0

        const mockNames: Record<string, string> = {
            "0x1a2b3c4d": "Alex Morgan", // This one will display if there is no transaction in the frequent contact ui
        };

        const contactStats: Record<string, FrequentContact> = {}

        processedTransactions.forEach(tx => {
            const amount = tx.amount || 0
            const timestamp = tx.timestampMs || Date.now()
            const monthKey = getMonthYearKey(timestamp)
            const displayMonth = getMonthDisplay(timestamp)

            // --- Existing Logic ---
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { inFlow: 0, outFlow: 0, displayMonth }
            }

            if (tx.type === 'receive') {
                monthlyData[monthKey].inFlow += amount
                totalInFlow += amount
                inFlowTransactionCount++
            } else if (tx.type === 'send') {
                monthlyData[monthKey].outFlow += amount
                totalOutFlow += amount
                outFlowTransactionCount++

                const category = tx.label === "Sent" ? (tx.to || 'Other') : tx.label
                expenseCategories[category] = (expenseCategories[category] || 0) + amount
            }

            // --- Frequent Contacts Logic ---
            let counterpart = "";
            let isIncoming = false;

            if (tx.type === "receive" && tx.from && tx.from !== "Unknown") {
                counterpart = tx.from;
                isIncoming = true;
            } else if (tx.type === "send" && tx.to && tx.to !== "Unknown") {
                counterpart = tx.to;
                isIncoming = false;
            }

            if (counterpart) {
                if (!contactStats[counterpart]) {
                    contactStats[counterpart] = {
                        address: counterpart,
                        name: mockNames[counterpart.slice(0, 10)] || undefined,
                        txCount: 0,
                        sent: 0,
                        received: 0,
                        cashflow: 0,
                        lastTxTime: 0
                    };
                }

                contactStats[counterpart].txCount++;
                if (timestamp > contactStats[counterpart].lastTxTime) {
                    contactStats[counterpart].lastTxTime = timestamp;
                }

                if (isIncoming) {
                    contactStats[counterpart].received += amount;
                    contactStats[counterpart].cashflow += amount;
                } else {
                    contactStats[counterpart].sent += amount;
                    contactStats[counterpart].cashflow -= amount;
                }
            }
        })

        // Generate last 6 months
        const today = new Date()
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1)
            const year = d.getFullYear()
            const month = (d.getMonth() + 1).toString().padStart(2, '0')
            return {
                key: `${year}-${month}`,
                display: d.toLocaleString('en-US', { month: 'short' })
            }
        })

        const cashflow: MonthlyCashflow[] = last6Months.map(({ key, display }) => {
            const data = monthlyData[key] || { inFlow: 0, outFlow: 0 }
            return {
                month: display,
                inFlow: data.inFlow,
                outFlow: data.outFlow,
                netFlow: data.inFlow - data.outFlow
            }
        })

        const expenses: ExpenseCategory[] = Object.entries(expenseCategories)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name, value]) => ({ name, value }))

        // Sort Frequent Contacts (descending by txCount)
        const frequentContacts = Object.values(contactStats)
            .sort((a, b) => b.txCount - a.txCount)
            .slice(0, 5); 

        // Get this month's and last month's net for comparison
        const thisMonthNetFlow = cashflow.length > 0 ? cashflow[cashflow.length - 1].netFlow : 0
        const lastMonthNetFlow = cashflow.length > 1 ? cashflow[cashflow.length - 2].netFlow : 0

        // Get current month's transaction count
        const currentMonthKey = last6Months[last6Months.length - 1].key
        const thisMonthData = monthlyData[currentMonthKey]
        const thisMonthTransactionCount = thisMonthData
            ? processedTransactions.filter(tx => getMonthYearKey(tx.timestampMs || Date.now()) === currentMonthKey).length
            : 0

        // Calculate month-over-month percentage change
        const monthOverMonthChange = lastMonthNetFlow !== 0
            ? ((thisMonthNetFlow - lastMonthNetFlow) / Math.abs(lastMonthNetFlow)) * 100
            : (thisMonthNetFlow > 0 ? 100 : thisMonthNetFlow < 0 ? -100 : 0)

        return {
            cashflowData: cashflow.length > 0 ? cashflow : [{ month: 'No Data', inFlow: 0, outFlow: 0, netFlow: 0 }],
            expensesData: expenses.length > 0 ? expenses : [{ name: 'No Expenses', value: 0 }],
            frequentContacts,
            totals: {
                totalInFlow,
                totalOutFlow,
                totalNetFlow: totalInFlow - totalOutFlow,
                thisMonthNetFlow,
                thisMonthTransactionCount,
                monthOverMonthChange,
                inFlowTransactionCount,
                outFlowTransactionCount
            }
        }
    }, [transactionData, account?.address])

    return { cashflowData, expensesData, frequentContacts, totals, isLoading }
}
