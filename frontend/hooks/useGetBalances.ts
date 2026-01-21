import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { SUI_COIN_TYPE } from "@/lib/constants";

export function useGetBalances() {
    const account = useCurrentAccount();

    if (!account) {
        return { isLoading: false, isError: false, data: null, error: null, refetch: async () => null };
    }

    return useSuiClientQuery(
        "getBalance",
        {
            owner: account.address,
            coinType: SUI_COIN_TYPE,
        },
        { queryKey: ["balance", account.address] }
    );
}