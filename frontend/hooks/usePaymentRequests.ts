// Use to fetch if the current user has any pending payment requests

import { useSuiClientQuery, useCurrentAccount } from "@mysten/dapp-kit";
import { useQueryClient } from '@tanstack/react-query';
import { playSound } from "../lib/mindyaisounds";

export function usePaymentRequests() {
    const account = useCurrentAccount();
    const queryClient = useQueryClient();

    const onTransactionSuccess = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        queryClient.invalidateQueries();
    };

    const { data: ownedObjects, isLoading, refetch } = useSuiClientQuery('getOwnedObjects', {
        owner: account?.address || '',
        filter: {
            StructType: "0x5ae2ee3de630c587707ae71729e54e272cbab874a465ade2939ae8cf71d4c26d::request::PaymentRequest",
        },
        options: { showContent: true }
    }, {
        enabled: !!account?.address,
        gcTime: 0,
        staleTime: 0,
        refetchOnMount: true,
    });

    const pendingRequests = ownedObjects?.data?.map((obj: any) => {
        const fields = obj.data?.content?.fields;
        return {
            id: obj.data?.objectId,
            requester: fields.requester,
            recipient: fields.recipient,
            amountMist: fields.amount,
            amountSui: Number(fields.amount) / 1_000_000_000,
            requestCode: fields.request_code,
        };
    }).filter(req => req.recipient === account?.address) || [];

    return {
        pendingRequests,
        isLoading,
        hasUnread: pendingRequests.length > 0,
        onTransactionSuccess,
        playSound,
        refetch
    };
}