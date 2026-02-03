// Use to fetch if the current user has any pending payment requests

import { useSuiClientQuery, useCurrentAccount } from "@mysten/dapp-kit";
import { useQueryClient } from '@tanstack/react-query';

export function usePaymentRequests() {
    const account = useCurrentAccount();
    const queryClient = useQueryClient();

    const onTransactionSuccess = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        queryClient.invalidateQueries(); 
    };

    const { data: ownedObjects, refetch } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address || '',
    filter: {
      StructType: "0xfd4c560a06b6b00fe7a6b43abbaeab016ba7db07082bd817143ad21c2b3e5299::request::PaymentRequest",
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
    }).filter(req => req.recipient === account?.address)  || [];

    

    return {
        pendingRequests,
        hasUnread: pendingRequests.length > 0,
        onTransactionSuccess,
        refetch
    };
}