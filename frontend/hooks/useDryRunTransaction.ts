/*
 * useDryRunTransaction - Hook to perform transaction dry runs
 * Returns estimated gas cost for a transaction before execution.
 */

import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { buildTransferTx, buildCreatePaymentRequestTx } from "@/lib/tx-builders";
import type { TransactionDetails } from "@/components/transactionModal/TransactionConfirmModal";

export interface DryRunResult {
    estimatedGas: number; // In MIST
    estimatedGasSui: number; // In SUI
    computationCost: string;
    storageCost: string;
    storageRebate: string;
}

interface UseDryRunTransactionParams {
    details: TransactionDetails | null;
}

export function useDryRunTransaction({ details }: UseDryRunTransactionParams) {
    const client = useSuiClient();
    const account = useCurrentAccount();

    return useQuery({
        queryKey: ["dry-run", details?.type, details?.recipient, details?.amount, account?.address],
        queryFn: async (): Promise<DryRunResult | null> => {
            if (!details || !account?.address) return null;

            // Only support TRANSFER_SUI for now (as per user's request)
            if (details.type !== 'TRANSFER_SUI') return null;

            const amount = typeof details.amount === 'string' ? parseFloat(details.amount) : details.amount;
            if (!amount || amount <= 0 || !details.recipient) return null;

            const amountMist = Math.floor(amount * 1_000_000_000);

            const tx = buildTransferTx({
                sender: account.address,
                recipient: details.recipient,
                amountMist,
            });

            // Build the transaction bytes for dry run
            const txBytes = await tx.build({ client });
            const base64Bytes = Buffer.from(txBytes).toString('base64');

            const result = await client.dryRunTransactionBlock({
                transactionBlock: base64Bytes,
            });

            const gasUsed = result.effects.gasUsed;
            const computationCost = BigInt(gasUsed.computationCost);
            const storageCost = BigInt(gasUsed.storageCost);
            const storageRebate = BigInt(gasUsed.storageRebate);

            // Total gas = computation + storage - rebate
            const totalGasMist = Number(computationCost + storageCost - storageRebate);

            return {
                estimatedGas: totalGasMist,
                estimatedGasSui: totalGasMist / 1_000_000_000,
                computationCost: gasUsed.computationCost,
                storageCost: gasUsed.storageCost,
                storageRebate: gasUsed.storageRebate,
            };
        },
        enabled: !!details && details.type === 'TRANSFER_SUI' && !!account?.address && !!details.recipient && (typeof details.amount === 'number' ? details.amount > 0 : parseFloat(details.amount || '0') > 0),
        staleTime: 1000 * 30, // 30 seconds
        refetchOnWindowFocus: false,
        retry: 1,
    });
}
