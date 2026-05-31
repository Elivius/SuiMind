/*
Use to execute transactions:
- Transfer SUI
- Create Payment Request
- Reject Payment Request
- Delete Payment Request (Clear Notification)
*/

import { useState } from "react";
import { useSignTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { graphql } from '@mysten/sui/graphql/schemas/latest';
import { toast } from "sonner";
import { gqlClient } from "@/lib/sui-client";
import { buildTransferTx, buildCreatePaymentRequestTx, buildRejectRequestTx, buildDeleteNotificationTx } from "@/lib/tx-builders";

const EXECUTE_TRANSACTION = graphql(`
  mutation ExecuteTransaction($transactionDataBcs: Base64!, $signatures: [Base64!]!) {
    executeTransaction(transactionDataBcs: $transactionDataBcs, signatures: $signatures) {
      effects {
        status
        transaction {
          digest
        }
      }
    }
  }
`);

interface TransferParams {
    amount: string;
    recipient: string;
    paymentRequestId?: string;
    walletBalance: number;
}

interface RequestParams {
    amount: string;
    recipient: string;
    code?: string;
}

export function useTransactionManager() {
    const account = useCurrentAccount();
    const { mutateAsync: signTransaction } = useSignTransaction();
    const [isSending, setIsSending] = useState(false);

    // --- Helper to execute via GraphQL ---
    const executeViaGraphQL = async (bytes: string, signature: string) => {
        const result = await gqlClient.query({
            query: EXECUTE_TRANSACTION,
            variables: {
                transactionDataBcs: bytes,
                signatures: [signature],
            },
        });

        if (result.errors && result.errors.length > 0) {
            console.error("GraphQL Top-Level Error:", result.errors);
            throw new Error(`RPC Submission Error: ${result.errors[0].message}`);
        }

        const execution = result.data?.executeTransaction;

        const statusObj = execution?.effects?.status;
        // Check if status is a string "SUCCESS" or an object with status "success"
        const isSuccess = statusObj === 'SUCCESS' ||
            (typeof statusObj === 'object' && statusObj !== null && 'status' in statusObj && (statusObj as any).status === 'success');

        if (!isSuccess) {
            const digest = execution?.effects?.transaction?.digest || "unknown";
            const errorMsg = (typeof statusObj === 'object' && statusObj !== null && 'error' in statusObj)
                ? `${(statusObj as any).error} (Digest: ${digest})`
                : `Transaction failed on-chain (Digest: ${digest})`;
            throw new Error(errorMsg);
        }

        return execution;
    };

    // --- 1. Transfer SUI ---
    const transferSui = async ({ amount, recipient, paymentRequestId, walletBalance }: TransferParams) => {
        if (!account) {
            toast.error("Please connect your wallet first.");
            return false;
        }
        if (!recipient.startsWith('0x')) {
            toast.error("Please enter a valid Sui address.");
            return false;
        }
        const val = parseFloat(amount);
        if (val <= 0) {
            toast.error("Please enter an amount greater than 0.");
            return false;
        }
        if (val > walletBalance) {
            toast.error("Insufficient balance.");
            return false;
        }

        setIsSending(true);
        try {
            const amountInMist = Math.floor(val * 1_000_000_000);
            const tx = buildTransferTx({
                sender: account.address,
                recipient,
                amountMist: amountInMist,
                paymentRequestId,
            });

            const { bytes, signature } = await signTransaction({ transaction: tx });
            const execution = await executeViaGraphQL(bytes, signature);

            return execution;
        } catch (e: any) {
            console.error("Transfer Error:", e);
            toast.error(e.message || "Transfer failed");
            return false;
        } finally {
            setIsSending(false);
        }
    };

    // --- 2. Create Payment Request ---
    const createPaymentRequest = async ({ amount, recipient, code }: RequestParams) => {
        if (!account) return false;
        if (!recipient.startsWith('0x')) {
            toast.error("Invalid address");
            return false;
        }

        setIsSending(true);
        try {
            const amountInMist = Math.floor(parseFloat(amount) * 1_000_000_000);
            const expirationTimestamp = Date.now() + (24 * 60 * 60 * 1000);
            const requestCode = code || "REQ-ABCD-" + Date.now();

            const tx = buildCreatePaymentRequestTx({
                sender: account.address,
                recipient,
                amountMist: amountInMist,
                code: requestCode,
                expirationTimestamp,
            });

            const { bytes, signature } = await signTransaction({ transaction: tx });
            const execution = await executeViaGraphQL(bytes, signature);

            return execution;
        } catch (e: any) {
            console.error("Request failed:", e);
            toast.error(`Error: ${e.message}`);
            return false;
        } finally {
            setIsSending(false);
        }
    };

    // --- 3. Reject Request ---
    const rejectRequest = async (requestId: string) => {
        if (!account) {
            toast.error("Please connect your wallet first.");
            return false;
        }

        setIsSending(true);
        try {
            const tx = buildRejectRequestTx({ requestId });

            const { bytes, signature } = await signTransaction({ transaction: tx });
            await executeViaGraphQL(bytes, signature);

            toast.success("Request rejected successfully.");
            return true;
        } catch (e: any) {
            console.error("Rejection Error:", e);
            toast.error(`System Error: ${e.message}`);
            return false;
        } finally {
            setIsSending(false);
        }
    };

    // --- 4. Delete Notification (Paid/Reject) ---
    const deleteNotification = async (objectId: string, type: 'paid' | 'reject') => {
        if (!account) return false;

        setIsSending(true);
        try {
            const tx = buildDeleteNotificationTx({ objectId, type });

            const { bytes, signature } = await signTransaction({ transaction: tx });
            await executeViaGraphQL(bytes, signature);

            return true;
        } catch (e) {
            console.error(`Failed to clear ${type} notification:`, e);
            return false;
        } finally {
            setIsSending(false);
        }
    };

    return {
        isSending,
        transferSui,
        createPaymentRequest,
        rejectRequest,
        deleteNotification
    };
}
