// Use to fetch if the current user has any pending payment requests

import { useSuiClientQuery, useCurrentAccount } from "@mysten/dapp-kit";
import { useQueryClient } from '@tanstack/react-query';
import { PACKAGE_ID } from "@/lib/config";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

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
            StructType: `${PACKAGE_ID}::request::PaymentRequest`,
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

    // Fetch remarks for pending requests
    const [remarks, setRemarks] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchRemarks = async () => {
            const newRemarks: Record<string, string> = {};
            const promises = pendingRequests.map(async (req: any) => {
                if (!req.requestCode) return;
                try {
                    const docSnap = await getDoc(doc(db, "request_remarks", req.requestCode));
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        newRemarks[req.id] = data.remark;
                    }
                } catch (e) {
                    console.error("Error fetching remark:", e);
                }
            });
            await Promise.all(promises);
            setRemarks(newRemarks);
        };

        if (pendingRequests.length > 0) {
            fetchRemarks();
        }
    }, [pendingRequests.length]); // Re-run when request count changes

    const pendingRequestsWithRemarks = pendingRequests.map(req => ({
        ...req,
        remark: remarks[req.id] || ''
    }));

    const { data: paidData, refetch: refetchPaid } = useSuiClientQuery('getOwnedObjects', {
        owner: account?.address || '',
        filter: { StructType: `${PACKAGE_ID}::request::PaidNotification` },
        options: { showContent: true }
    }, { enabled: !!account?.address });

    const paidNotifications = paidData?.data?.map((obj: any) => {
        const fields = (obj.data?.content as any).fields;
        return {
            id: obj.data?.objectId,
            paid_by: fields.paid_by,
            amountSui: Number(fields.amount) / 1_000_000_000,
            request_code: fields.request_code
        };
    }) || [];

    const { data: rejectedData, refetch: refetchRejected } = useSuiClientQuery('getOwnedObjects', {
        owner: account?.address as string,
        filter: { StructType: `${PACKAGE_ID}::request::RejectedPayment` },
        options: { showContent: true }
    });

    const rejectedRequests = rejectedData?.data?.map(obj => {
        const fields = (obj.data?.content as any).fields;
        return {
            id: obj.data?.objectId,
            rejected_by: fields.rejected_by,
            amountSui: Number(fields.amount) / 1_000_000_000,
            request_code: fields.request_code
        };
    }) || [];




    return {
        pendingRequests: pendingRequestsWithRemarks,
        isLoading,
        rejectedRequests,
        paidNotifications,
        hasUnread: pendingRequests.length > 0 || rejectedRequests.length > 0 || paidNotifications.length > 0,
        onTransactionSuccess,
        refetch: () => { refetchRejected(); refetch(); refetchPaid(); }
    };
}