import { useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { graphql } from '@mysten/sui/graphql/schemas/latest';
import { gqlClient } from "@/lib/suiClient";

const GET_TRANSACTIONS_QUERY = graphql(`
query getTransactions($address: SuiAddress!, $limit: Int = 5, $before: String) {
  transactions(last: $limit, before: $before, filter: {affectedAddress: $address}) {
    pageInfo {
      hasPreviousPage
      endCursor
    }
    nodes {
      effects {
        timestamp
        balanceChangesJson
      }
    }
  }
}
`);

export function useGetTransactions(limit: number = 5, before?: string) {
    const account = useCurrentAccount();
    const address = account?.address;

    return useQuery({
        queryKey: ["get-transactions", address, limit, before],
        queryFn: async () => {
            if (!address) return [];

            const result = await gqlClient.query({
                query: GET_TRANSACTIONS_QUERY,
                variables: {
                    address,
                    limit,
                    before
                },
            });

            const transactions = result.data?.transactions?.nodes ?? [];

            return [...transactions].reverse();
        },
        enabled: !!address,
    });
}