"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useSignTransaction, useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID } from "@/lib/config";
import { SuiGraphQLClient } from '@mysten/sui/graphql'
import { graphql } from '@mysten/sui/graphql/schemas/latest'
import { usePaymentRequests } from '@/hooks';



const TransactionContext = createContext<any>(null);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
    const [isSending, setIsSending] = useState(false);
    const { mutateAsync: signTransaction } = useSignTransaction();
    const client = useSuiClient();
    const account = useCurrentAccount();
    const { pendingRequests, hasUnread, refetch, onTransactionSuccess } = usePaymentRequests();
    const [showSendModal, setShowSendModal] = useState(false);
    const [activeRequest, setActiveRequest] = useState<any>(null);

    const gqlClient = new SuiGraphQLClient({
        url: 'https://graphql.testnet.sui.io/graphql', // Testnet
        });

    const EXECUTE_TRANSACTION = graphql(`
    mutation ExecuteTransaction($transactionDataBcs: Base64!, $signatures: [Base64!]!) {
        executeTransaction(transactionDataBcs: $transactionDataBcs, signatures: $signatures) {
        errors
        effects {
            status
            transaction {    # Digest lives here now
            digest
            }
        }
        }
    }`);

    const runTransaction = async (tx: Transaction) => {
        const { bytes, signature } = await signTransaction({ transaction: tx });
        const result = await gqlClient.query({
        query: EXECUTE_TRANSACTION,
        variables: { transactionDataBcs: bytes, signatures: [signature] },
        });
        return result.data?.executeTransaction;
    };

    const handleSend = async (recipient: string, amount: string, requestId?: string) => {
        if (!account) { alert("Please connect your wallet."); return; }
        
        setIsSending(true);
        try {
        const tx = new Transaction();
        const amountInMist = Math.floor(parseFloat(amount) * 1_000_000_000);
        const [coin] = tx.splitCoins(tx.gas, [amountInMist]);
        tx.transferObjects([coin], recipient);

        if (requestId) {
            tx.moveCall({
            target: `${PACKAGE_ID}::request::settle_payment_request`,
            arguments: [tx.object(requestId)],
            });
        }

        const execution = await runTransaction(tx);
        const status = execution?.effects?.status;
        const digest = execution?.effects?.transaction?.digest;

        if (status === 'SUCCESS' ) {
            alert(`Success! Digest: ${digest}`);
            await onTransactionSuccess();
            return {success: true, digest: execution?.effects?.transaction?.digest};
        }
        return { success: false };
        } catch (e) {
            console.error(e);
            alert("handleSend error");
            return { success: false };
        } finally {
            setIsSending(false);
        }
    };

    const handleRequest = async (requestRecipient: string, requestAmount: string) => {
        if (!account) return;
        if (!requestRecipient.startsWith('0x')) { alert("Invalid address"); return; }

        setIsSending(true);
        try {
            const tx = new Transaction();
            const MODULE_NAME = "request";
            const FUNCTION_NAME = "create_payment_request";
            const amountInMist = Math.floor(parseFloat(requestAmount) * 1_000_000_000);
            const expirationTimestamp = Date.now() + (24 * 60 * 60 * 1000);

            tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
            arguments: [
                tx.pure.address(requestRecipient),
                tx.pure.u64(amountInMist),
                tx.pure.string("REQ-ABCD-" + Date.now()),
                tx.pure.u64(expirationTimestamp),
            ],
            });


            const execution = await runTransaction(tx);

            if (execution?.effects?.status === 'SUCCESS') {
                alert("Request Object sent successfully!");
                return { success: true };
            }
        } catch (e: any) {
            console.error("Request failed:", e);
            alert(`Error: ${e.message}`);
            return { success: false };
        } finally {
            setIsSending(false);
        }
        };


        useEffect(() => {
            const handlePayFromHeader = (e: any) => {
            setActiveRequest(e.deatials);
            setShowSendModal(true);
            window.addEventListener('PAY_REQUEST', handlePayFromHeader);
            };
        
            window.addEventListener('PAY_REQUEST', handlePayFromHeader);
            return () => window.removeEventListener('PAY_REQUEST', handlePayFromHeader);
        }, []);

        useEffect(() => {
            const handleRejectRequest = async (event: any) => {
            const requestId = event.detail;

            if (!account) {
                alert("Please connect your wallet first.");
                return;
            }

            setIsSending(true);
            try {
                const tx = new Transaction();

                tx.moveCall({
                target: `${PACKAGE_ID}::request::reject_request`,
                arguments: [tx.object(requestId)],
                });

                const execution = await runTransaction(tx);
                if (execution?.effects?.status === 'SUCCESS') {
                    await onTransactionSuccess();
                    alert("Request rejected successfully.");
                    refetch();
                }
            } catch (e: any) {
                console.error("Rejection Error:", e);
                alert(`System Error: ${e.message}`);
            } finally {
                setIsSending(false);
            }
            };

            window.addEventListener('REJECT_REQUEST', handleRejectRequest);
            return () => window.removeEventListener('REJECT_REQUEST', handleRejectRequest);
        }, [account, signTransaction, gqlClient, refetch]);

        useEffect(() => {
            const handleClearNotification = async (event: any, type: 'paid' | 'reject') => {
            if (!account) return;
            setIsSending(true);
            try {
                const tx = new Transaction();
                const targetFunction = type === 'paid' ? 'delete_paid' : 'delete_reject';
                tx.moveCall({
                    target: `${PACKAGE_ID}::request::${targetFunction}`,
                    arguments: [tx.object(event.detail)],
                });
                await runTransaction(tx);
                await onTransactionSuccess();
                refetch();
            } catch (e) { console.error(`Clear ${type} failed:`, e); }
            finally { setIsSending(false); }
            };

            const onClearPaid = (e: any) => handleClearNotification(e, 'paid');
            const onClearReject = (e: any) => handleClearNotification(e, 'reject');

            window.addEventListener('CLEAR_PAID_NOTIFICATION', onClearPaid);
            window.addEventListener('CLEAR_REJECT_NOTIFICATION', onClearReject);

            return () => {
                window.removeEventListener('CLEAR_PAID_NOTIFICATION', onClearPaid);
                window.removeEventListener('CLEAR_REJECT_NOTIFICATION', onClearReject);
            };
        }, [account, client, signTransaction]);

        

    return (
        <TransactionContext.Provider value={{ handleSend, isSending, handleRequest }}>
        {children}
        </TransactionContext.Provider>
    );
}

export const useTransactions = () => useContext(TransactionContext); 