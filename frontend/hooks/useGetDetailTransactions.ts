// Use to get more detail transactions - for reccent activity / transaction history

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { graphql } from '@mysten/sui/graphql/schemas/latest';
import { gqlClient } from "@/lib/sui-client";

const GET_DETAIL_TRANSACTIONS_QUERY = graphql(`
query getDetailTransactions($address: SuiAddress!, $limit: Int = 5, $before: String) {
  transactions(last: $limit, before: $before, filter: {affectedAddress: $address}) {
    pageInfo {
      hasPreviousPage
    }
    edges {
      cursor
      node {
        digest
        gasInput {
          gasPrice
          gasBudget
          gasSponsor {
            address
          }
        }
        effects {
          timestamp
          status
          gasEffects {
            gasSummary {
              computationCost
              storageCost
              storageRebate
              nonRefundableStorageFee
            }
          }
          balanceChangesJson
        }
      }
    }
  }
}
`);

export function useGetDetailTransactions(limit: number = 5, before?: string) {
  const account = useCurrentAccount();
  const address = account?.address;

  return useQuery({
    queryKey: ["get-detail-transactions", address, limit, before],
    queryFn: async () => {
      if (!address) return { transactions: [], pageInfo: { hasPreviousPage: false } };

      const result = await gqlClient.query({
        query: GET_DETAIL_TRANSACTIONS_QUERY,
        variables: {
          address,
          limit,
          before
        },
      });

      const edges = result.data?.transactions?.edges ?? [];
      const pageInfo = result.data?.transactions?.pageInfo ?? { hasPreviousPage: false };

      const transactions = edges.map((edge: any) => ({
        ...edge.node,
        cursor: edge.cursor
      })).reverse();

      return {
        transactions,
        pageInfo
      };
    },
    enabled: !!address,
  });
}