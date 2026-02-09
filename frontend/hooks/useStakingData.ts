import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";

export interface StakingData {
    avgApy: number;
    maxApy: number;
    epoch: string;
}

export function useStakingData() {
    const client = useSuiClient();

    return useQuery({
        queryKey: ["staking-data"],
        queryFn: async (): Promise<StakingData> => {
            const validatorsApy = await client.getValidatorsApy();

            // Calculate average APY
            const apys = validatorsApy.apys.map((a) => a.apy);

            if (apys.length === 0) {
                return { avgApy: 0, maxApy: 0, epoch: validatorsApy.epoch };
            }

            const avgApy = apys.reduce((sum, a) => sum + a, 0) / apys.length;
            const maxApy = Math.max(...apys);

            return {
                avgApy: avgApy * 100, // Convert to percentage
                maxApy: maxApy * 100, // Convert to percentage
                epoch: validatorsApy.epoch
            };
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
}
