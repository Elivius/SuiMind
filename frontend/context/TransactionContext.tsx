"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useSignTransaction, useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID } from "@/lib/config";
import { SuiGraphQLClient } from '@mysten/sui/graphql'
import { graphql } from '@mysten/sui/graphql/schemas/latest'
import { usePaymentRequests } from '@/hooks';
import { motion as Motion, AnimatePresence } from "motion/react"
import {
  TrendingUp, ArrowUpRight, ArrowDownRight, ArrowDownLeft, Zap, Pencil, Eye, CheckCircle2,
  X, Repeat, ArrowDown, ArrowUp, Send, DownloadCloud, SendHorizontal,
  Plus, AtSign, Sparkles, Bot, Users, Square, Trash2, Bell, Scale, Minus,
  Wallet, Info, HelpingHand
} from "lucide-react"
import { playSound } from "@/lib/sound-effects"



const TransactionContext = createContext<any>(null);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
    const [isSending, setIsSending] = useState(false);
    const { mutateAsync: signTransaction } = useSignTransaction();
    const client = useSuiClient();
    const account = useCurrentAccount();
    const { pendingRequests, hasUnread, refetch, onTransactionSuccess } = usePaymentRequests();
    const [showNewSendUI, setShowSendUI] = useState(false);
    const [activeRequest, setActiveRequest] = useState<any>(null);
    const [showNewRequestUI, setShowRequestUI] = useState(false);
    const [showConfirmRequest, setShowConfirmRequest] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [requestRecipient, setRequestRecipient] = useState('');
    const [requestAmount, setRequestAmount] = useState('0.00');
    const [successMessage, setSuccessMessage] = useState("");
    
    
    

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
            setActiveRequest(e.detail);
            setShowSendUI(true);
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

        const onInternalRequestClick = async () => {
            const result = await handleRequest(requestRecipient, requestAmount);
            if (result?.success) {
              setShowRequestUI(false);
              setRequestAmount('0.00');
              setRequestRecipient('');
              playSound('request_success');
            }
          };

        

    return (
        <TransactionContext.Provider value={{ handleSend, isSending, handleRequest,activeRequest, setActiveRequest, showNewSendUI,setShowSendUI, showNewRequestUI,setShowRequestUI }}>
            {children}
                <AnimatePresence>
                    {showNewRequestUI && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => setShowRequestUI(false)}
                        />

                        <Motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative z-10 w-full max-w-lg overflow-hidden"
                        >
                        <div className="absolute inset-0 bg-[#0D1117]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl" />

                        <div className="relative p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-400/20 rounded-2xl flex items-center justify-center border border-emerald-400/30">
                                <ArrowDown className="w-6 h-6 text-emerald-300" />
                                </div>
                                <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Request SUI</h2>
                                <p className="text-emerald-300/80 text-sm font-medium">Create a payment link</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                setShowRequestUI(false);
                                setShowConfirmRequest(false);
                                setRequestRecipient('');
                                setRequestAmount('');
                                }}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                            >
                                <X className="w-6 h-6 text-white/40 group-hover:text-white" />
                            </button>
                            </div>

                            {showSuccess ? (
                            <Motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 space-y-8"
                            >
                                <div className="relative">
                                <Motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                    className="w-24 h-24 bg-emerald-400/20 rounded-full flex items-center justify-center border-2 border-emerald-400/50 shadow-[0_0_40px_rgba(52,211,153,0.2)]"
                                >
                                    <Motion.svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-emerald-400"
                                    >
                                    <Motion.path
                                        d="M20 6L9 17L4 12"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                                    />
                                    </Motion.svg>
                                </Motion.div>
                                <Motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="absolute inset-0 bg-emerald-400/30 rounded-full -z-10"
                                />
                                </div>

                                <div className="text-center space-y-2">
                                <h3 className="text-3xl font-black text-white tracking-tight">{successMessage}</h3>
                                <p className="text-emerald-400 font-medium">Request sent successfully</p>
                                </div>

                                <button
                                onClick={() => setShowRequestUI(false)}
                                className="w-full py-4 px-6 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] group relative overflow-hidden"
                                >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                <span className="relative z-10 flex items-center justify-center gap-3 text-2xl">
                                    Done
                                    <CheckCircle2 className="w-8 h-8" />
                                </span>
                                </button>
                            </Motion.div>
                            ) : (
                            <>
                                {/* Info Box */}
                                <div className="mb-8 p-5 bg-emerald-400/5 rounded-2xl border border-emerald-400/10 flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-emerald-300" />
                                </div>
                                <p className="text-emerald-300/80 text-sm font-medium">
                                    Requested assets will appear in your wallet once the recipient approves.
                                </p>
                                </div>

                                {!showConfirmRequest ? (
                                <>
                                    {/* Form Fields */}
                                    <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-white/50 text-xs font-bold uppercase tracking-widest mb-2.5 ml-1">
                                        Request From Address
                                        </label>
                                        <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="0x..."
                                            value={requestRecipient}
                                            onChange={(e) => setRequestRecipient(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/50 transition-all font-mono text-sm"
                                        />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-white/50 text-xs font-bold uppercase tracking-widest mb-2.5 ml-1">
                                        Amount to Request
                                        </label>
                                        <div className="relative">
                                        <input
                                            type="number"
                                            value={requestAmount}
                                            onChange={(e) => setRequestAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/50 transition-all text-3xl font-black"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                            <div className="flex flex-col border-r border-white/10 pr-4">
                                            <button
                                                onClick={() => setRequestAmount((prev) => (parseFloat(prev || '0') + 0.1).toFixed(2))}
                                                className="text-white/20 hover:text-emerald-400 transition-colors"
                                            >
                                                <ArrowUp className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => setRequestAmount((prev) => Math.max(0, parseFloat(prev || '0') - 0.1).toFixed(2))}
                                                className="text-white/20 hover:text-emerald-500 transition-colors"
                                            >
                                                <ArrowDown className="w-5 h-5" />
                                            </button>
                                            </div>
                                            <span className="text-emerald-400 font-black text-xl">SUI</span>
                                        </div>
                                        </div>
                                    </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 mt-10">
                                    <button
                                        onClick={() => {
                                        setShowRequestUI(false);
                                        setRequestRecipient('');
                                        setRequestAmount('');
                                        }}
                                        className="flex-1 py-4 px-6 rounded-2xl text-white/60 font-bold hover:bg-white/5 transition-all outline-none"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmRequest(true)}
                                        disabled={isSending || (parseFloat(requestAmount) || 0) <= 0 || !requestRecipient.startsWith('0x')}
                                        className="flex-[2] py-4 px-6 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                        <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                                        Next
                                        <ArrowUpRight className="w-5 h-5" />
                                        </span>
                                    </button>
                                    </div>
                                </>
                                ) : (
                                <>
                                    {/* Confirmation View */}
                                    <div className="space-y-6">
                                    <div className="p-6 bg-emerald-400/5 rounded-2xl border border-emerald-400/10 space-y-4">
                                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <span className="text-emerald-300/80 font-bold uppercase tracking-wider text-xs">Requesting</span>
                                        <span className="text-2xl font-black text-white">{requestAmount} SUI</span>
                                        </div>
                                        <div className="space-y-2">
                                        <span className="text-emerald-300/80 font-bold uppercase tracking-wider text-xs block">From Address</span>
                                        <span className="text-sm font-mono text-white break-all bg-black/40 p-3 rounded-xl block border border-white/5">
                                            {requestRecipient}
                                        </span>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20 flex items-start gap-3">
                                        <Sparkles className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-emerald-300/80 leading-relaxed">
                                        Once confirmed, a payment request will be sent to this address. You will receive the funds after they approve the transaction.
                                        </p>
                                    </div>
                                    </div>

                                    <div className="flex gap-4 mt-10">
                                    <button
                                        onClick={() => setShowConfirmRequest(false)}
                                        className="flex-1 py-4 px-6 rounded-2xl text-white/60 font-bold hover:bg-white/5 transition-all outline-none"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={onInternalRequestClick}
                                        disabled={isSending}
                                        className="flex-[2] py-4 px-6 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                        <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                                        {isSending ? (
                                            <>
                                            <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                                            Processing...
                                            </>
                                        ) : (
                                            <>
                                            Confirm Request
                                            <ArrowDown className="w-5 h-5" />
                                            </>
                                        )}
                                        </span>
                                    </button>
                                    </div>
                                </>
                                )}
                            </>
                            )}
                        </div>
                        </Motion.div>
                    </div>
                    )}
                </AnimatePresence>
        </TransactionContext.Provider>
        
    );
}

export const useTransactions = () => useContext(TransactionContext); 