import { useState } from "react";
import { useSignTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { graphql } from '@mysten/sui/graphql/schemas/latest';
import { Transaction } from '@mysten/sui/transactions';
import { toast } from "sonner";
import { PACKAGE_ID } from "@/lib/config";
import { playSound } from "@/lib/sound-effects";

// Setup GraphQL Client
const gqlClient = new SuiGraphQLClient({
    url: 'https://graphql.testnet.sui.io/graphql',
});

const EXECUTE_TRANSACTION = graphql(`
  mutation ExecuteTransaction($transactionDataBcs: Base64!, $signatures: [Base64!]!) {
    executeTransaction(transactionDataBcs: $transactionDataBcs, signatures: $signatures) {
      errors
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

        const execution = result.data?.executeTransaction;
        if (execution?.errors && execution.errors.length > 0) {
            throw new Error(`Execution Error: ${execution.errors[0]}`);
        }

        const statusObj = execution?.effects?.status;
        // Check if status is a string "SUCCESS" or an object with status "success"
        const isSuccess = statusObj === 'SUCCESS' ||
            (typeof statusObj === 'object' && statusObj !== null && 'status' in statusObj && (statusObj as any).status === 'success');

        if (!isSuccess) {
            const errorMsg = (typeof statusObj === 'object' && statusObj !== null && 'error' in statusObj)
                ? (statusObj as any).error
                : "Transaction failed on-chain";
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
            const tx = new Transaction();
            const amountInMist = Math.floor(val * 1_000_000_000);

            const [coin] = tx.splitCoins(tx.gas, [amountInMist]);
            tx.transferObjects([coin], recipient);
            tx.setSender(account.address);

            if (paymentRequestId) {
                tx.moveCall({
                    target: `${PACKAGE_ID}::request::settle_payment_request`,
                    arguments: [tx.object(paymentRequestId)],
                });
            }

            const { bytes, signature } = await signTransaction({ transaction: tx });
            const execution = await executeViaGraphQL(bytes, signature);

            playSound('success');
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
    const createPaymentRequest = async ({ amount, recipient }: RequestParams) => {
        if (!account) return false;
        if (!recipient.startsWith('0x')) {
            toast.error("Invalid address");
            return false;
        }

        setIsSending(true);
        try {
            const tx = new Transaction();
            const MODULE_NAME = "request";
            const FUNCTION_NAME = "create_payment_request";
            const amountInMist = Math.floor(parseFloat(amount) * 1_000_000_000);
            const expirationTimestamp = Date.now() + (24 * 60 * 60 * 1000);

            tx.moveCall({
                target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
                arguments: [
                    tx.pure.address(recipient),
                    tx.pure.u64(amountInMist),
                    tx.pure.string("REQ-ABCD-" + Date.now()),
                    tx.pure.u64(expirationTimestamp),
                ],
            });

            const { bytes, signature } = await signTransaction({ transaction: tx });
            await executeViaGraphQL(bytes, signature);

            playSound('request_success');
            return true;
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
            const tx = new Transaction();
            tx.moveCall({
                target: `${PACKAGE_ID}::request::reject_request`,
                arguments: [tx.object(requestId)],
            });

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
            const tx = new Transaction();
            const func = type === 'paid' ? 'delete_paid' : 'delete_reject';

            tx.moveCall({
                target: `${PACKAGE_ID}::request::${func}`,
                arguments: [tx.object(objectId)],
            });

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
