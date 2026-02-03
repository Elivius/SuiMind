// Paginated transaction fetching for insights - fetches until 6-month boundary

import { useCurrentAccount } from "@mysten/dapp-kit"
import { useInfiniteQuery } from "@tanstack/react-query"
import { graphql } from '@mysten/sui/graphql/schemas/latest'
import { gqlClient } from "@/lib/sui-client"

const GET_INSIGHT_TRANSACTIONS_QUERY = graphql(`
query getInsightTransactions($address: SuiAddress!, $limit: Int = 50, $before: String) {
  transactions(last: $limit, before: $before, filter: {affectedAddress: $address}) {
    pageInfo {
      hasPreviousPage
      startCursor
    }
    nodes {
      effects {
        timestamp
        balanceChangesJson
      }
    }
  }
}
`)

const PAGE_SIZE = 50 // One time fetch 50 transactions
const MONTHS_TO_FETCH = 6 // Fetch 6 months of transactions

function getSixMonthsAgoTimestamp(): number {
    const date = new Date()
    date.setMonth(date.getMonth() - MONTHS_TO_FETCH)
    date.setDate(1) // Start of that month
    date.setHours(0, 0, 0, 0)
    return date.getTime()
}

export function useGetInsightTransactions() {
    const account = useCurrentAccount()
    const address = account?.address
    const sixMonthsAgo = getSixMonthsAgoTimestamp()

    const query = useInfiniteQuery({
        queryKey: ["get-insight-transactions", address],
        queryFn: async ({ pageParam }) => {
            if (!address) {
                return {
                    nodes: [],
                    pageInfo: { hasPreviousPage: false, startCursor: null },
                    reachedBoundary: true
                }
            }

            const result = await gqlClient.query({
                query: GET_INSIGHT_TRANSACTIONS_QUERY,
                variables: {
                    address,
                    limit: PAGE_SIZE,
                    before: pageParam || undefined
                },
            })

            const transactions = result.data?.transactions?.nodes ?? []
            const pageInfo = result.data?.transactions?.pageInfo ?? {
                hasPreviousPage: false,
                startCursor: null
            }

            // Check if oldest transaction in this batch is older than 6 months
            const reversedTransactions = [...transactions].reverse() // Oldest first
            const oldestTransactions = reversedTransactions[reversedTransactions.length - 1]
            const oldestTimestamp = oldestTransactions?.effects?.timestamp
                ? new Date(oldestTransactions.effects.timestamp).getTime()
                : Date.now()

            const reachedBoundary = oldestTimestamp < sixMonthsAgo

            return {
                transactions: reversedTransactions,
                pageInfo,
                reachedBoundary
            }
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => {
            // Stop if: no more pages OR we've gone past 6 months
            if (!lastPage.pageInfo.hasPreviousPage || lastPage.reachedBoundary) {
                return undefined
            }
            return lastPage.pageInfo.startCursor
        },
        enabled: !!address,
    })

    // Auto-fetch next pages until we have all 6-month data
    const { hasNextPage, isFetchingNextPage, fetchNextPage } = query

    // Trigger next page fetch if available and not already fetching
    if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
    }

    // Flatten all pages into single array, filter to 6-month window
    const allTransactions = query.data?.pages.flatMap(page => page.transactions) ?? []
    const filteredTransactions = allTransactions.filter(node => {
        const timestamp = node?.effects?.timestamp
            ? new Date(node.effects.timestamp).getTime()
            : Date.now()
        return timestamp >= sixMonthsAgo
    })

    return {
        data: { transactions: filteredTransactions },
        isLoading: query.isLoading || (hasNextPage && !query.data?.pages.some(p => p.reachedBoundary)),
        isFetchingMore: isFetchingNextPage,
        totalFetched: allTransactions.length
    }
}
