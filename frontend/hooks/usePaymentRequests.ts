import { useSuiClientQuery, useCurrentAccount } from "@mysten/dapp-kit";

export function usePaymentRequests() {
    const account = useCurrentAccount();

    const { data: ownedObjects, refetch } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address || '',
    filter: {
      StructType: "0x674096762076f86223cd5cf569e248c5dce523309aebe350fc89d8e3a25cffe0::request::PaymentRequest",
    },
    options: { showContent: true }
    }, {
        enabled: !!account?.address,
        gcTime: 0,        // Garbage collect immediately
        staleTime: 0,     // Data is old immediately
        refetchOnMount: true,
        //refetchInterval: 10000, // Auto-check every 10 seconds
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
        refetch
    };
}