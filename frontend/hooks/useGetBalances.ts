import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { SUI_COIN_TYPE } from "@/lib/constants";

export function useGetBalances() {
    const account = useCurrentAccount();

    return useSuiClientQuery(
        "getBalance",
        {
            owner: account?.address as string,
            coinType: SUI_COIN_TYPE,
        },
        {
            enabled: !!account,
            queryKey: ["balance", account?.address]
        }
    );
}