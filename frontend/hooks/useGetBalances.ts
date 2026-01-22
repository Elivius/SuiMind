import { useCurrentAccount } from "@mysten/dapp-kit";
import { SUI_COIN_TYPE } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { graphql } from '@mysten/sui/graphql/schemas/latest';
import { gqlClient } from "@/lib/suiClient";

const GET_BALANCE_QUERY = graphql(`
  query getBalance($address: String!, $coinType: String) {
    address(address: $address) {
      balance(coinType: $coinType) {
        totalBalance
      }
    }
  }
`);

export function useGetBalances() {
  const account = useCurrentAccount();
  const address = account?.address;

  return useQuery({
    queryKey: ["get-balance", address],
    queryFn: async () => {
      if (!address) return null;

      const result = await gqlClient.query({
        query: GET_BALANCE_QUERY,
        variables: {
          address,
          coinType: SUI_COIN_TYPE,
        },
      });

      return result.data?.address?.balance;
    },
    enabled: !!address, // Only run if address exists
  });
}