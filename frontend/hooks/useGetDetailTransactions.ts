// Get more detail transactions
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { graphql } from '@mysten/sui/graphql/schemas/latest';
import { gqlClient } from "@/lib/sui-client";

const GET_TRANSACTIONS_QUERY = graphql(`
query getTransactions($address: SuiAddress!, $limit: Int = 5, $before: String) {
  transactions(last: $limit, before: $before, filter: {affectedAddress: $address}) {
    pageInfo {
      hasPreviousPage
      startCursor
    }
    nodes {
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
`);

export function useGetDetailTransactions(limit: number = 5, before?: string) {
  const account = useCurrentAccount();
  const address = account?.address;

  return useQuery({
    queryKey: ["get-detail-transactions", address, limit, before],
    queryFn: async () => {
      if (!address) return { nodes: [], pageInfo: { hasPreviousPage: false, startCursor: null } };

      const result = await gqlClient.query({
        query: GET_TRANSACTIONS_QUERY,
        variables: {
          address,
          limit,
          before
        },
      });

      const transactions = result.data?.transactions?.nodes ?? [];
      const pageInfo = result.data?.transactions?.pageInfo ?? { hasPreviousPage: false, startCursor: null };

      return {
        nodes: [...transactions].reverse(),
        pageInfo
      };
    },
    enabled: !!address,
  });
}