/*
 * Unified Transaction Confirmation Modal
 * Reusable for both manual transactions (home page) and AI-initiated transactions (Mindy AI)
 */

"use client";

import { motion as Motion, AnimatePresence } from "motion/react";
import {
    X, SendHorizontal, Zap, CheckCircle2, Wallet,
    ArrowDown, Bot, Sparkles, OctagonAlert
} from "lucide-react";

// Transaction types
export type TransactionType = 'TRANSFER_SUI' | 'CREATE_PAYMENT_REQUEST' | 'REJECT_PAYMENT_REQUEST';

export interface TransactionDetails {
    type: TransactionType;
    recipient?: string;
    amount?: number | string;
    remark?: string;
    request_id?: string;
}

interface TransactionConfirmModalProps {
    isOpen: boolean;
    details: TransactionDetails | null;
    walletBalance?: number;
    isSending: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    // Optional: For AI-initiated transactions
    aiMessage?: string;
    // Optional: For manual transactions (e.g., payment requests from header)
    manualMessage?: string;
    showAiBadge?: boolean;
}

export function TransactionConfirmModal({
    isOpen,
    details,
    walletBalance = 0,
    isSending,
    onConfirm,
    onCancel,
    aiMessage,
    manualMessage,
    showAiBadge = false,
}: TransactionConfirmModalProps) {
    if (!details) return null;

    const amount = typeof details.amount === 'string' ? parseFloat(details.amount) : details.amount;
    const isTransfer = details.type === 'TRANSFER_SUI';
    const isPaymentRequest = details.type === 'CREATE_PAYMENT_REQUEST';

    // Theme colors & configuration
    const accentColor = isTransfer ? '#6FBEE5' : isPaymentRequest ? '#34d399' : '#f87171';

    // Header configuration
    const getHeader = () => {
        if (isTransfer) {
            return {
                title: "Send SUI",
                subtitle: "Quick and secure transfer",
                icon: <SendHorizontal className="w-6 h-6 text-[#6FBEE5]" />,
                iconBg: "bg-[#6FBEE5]/20 border-[#6FBEE5]/30",
                textColor: "text-[#6FBEE5]"
            };
        }
        if (isPaymentRequest) {
            return {
                title: "Request SUI",
                subtitle: "Create a payment request",
                icon: <ArrowDown className="w-6 h-6 text-emerald-300" />,
                iconBg: "bg-emerald-400/20 border-emerald-400/30",
                textColor: "text-emerald-300/80"
            };
        }
        return {
            title: "Confirm Transaction",
            subtitle: "Please verify details",
            icon: <Wallet className="w-6 h-6 text-white" />,
            iconBg: "bg-white/10 border-white/20",
            textColor: "text-white/60"
        };
    };

    const headerConfig = getHeader();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onCancel}
                    />

                    {/* Modal */}
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative z-10 w-full max-w-lg border border-white/10 rounded-3xl shadow-2xl overflow-hidden bg-[#0D1117]/95 backdrop-blur-2xl"
                    >

                        <div className="relative p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${headerConfig.iconBg}`}>
                                        {headerConfig.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white tracking-tight">{headerConfig.title}</h2>
                                        <p className={`text-sm font-medium ${headerConfig.textColor}`}>
                                            {headerConfig.subtitle}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onCancel}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                                >
                                    <X className="w-6 h-6 text-white/40 group-hover:text-white" />
                                </button>
                            </div>

                            {/* AI Message (optional) */}
                            {aiMessage && (
                                <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${isPaymentRequest ? "bg-emerald-400/10 border-emerald-400/20" : "bg-[#6FBEE5]/10 border-[#6FBEE5]/20"
                                    }`}>
                                    <Bot className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPaymentRequest ? "text-emerald-300" : "text-[#6FBEE5]"
                                        }`} />
                                    <p className={`text-sm leading-relaxed ${isPaymentRequest ? "text-emerald-300" : "text-[#6FBEE5]"
                                        }`}>
                                        {aiMessage}
                                    </p>
                                </div>
                            )}

                            {/* Manual Message (optional) - for non-AI flows like header payment requests */}
                            {manualMessage && !aiMessage && (
                                <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${isPaymentRequest ? "bg-emerald-400/10 border-emerald-400/20" : "bg-[#6FBEE5]/10 border-[#6FBEE5]/20"
                                    }`}>
                                    <OctagonAlert className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPaymentRequest ? "text-emerald-300" : "text-[#6FBEE5]"
                                        }`} />
                                    <p className={`text-sm leading-relaxed ${isPaymentRequest ? "text-emerald-300" : "text-[#6FBEE5]"
                                        }`}>
                                        {manualMessage}
                                    </p>
                                </div>
                            )}

                            {/* Available Balance or Info Box */}
                            {isPaymentRequest ? (
                                <div className="mb-8 p-5 bg-emerald-400/5 rounded-2xl border border-emerald-400/10 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-5 h-5 text-emerald-300" />
                                    </div>
                                    <p className="text-emerald-300/80 text-sm font-medium">
                                        Requested assets will appear in your wallet once the recipient approves.
                                    </p>
                                </div>
                            ) : (
                                <div className="mb-8 p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">Available Balance</p>
                                        <p className="text-2xl font-black text-white">
                                            {walletBalance.toLocaleString("en-US", {
                                                minimumFractionDigits: 4,
                                                maximumFractionDigits: 4
                                            })}
                                            <span className="text-lg font-bold ml-2" style={{ color: accentColor }}>SUI</span>
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl border" style={{ borderColor: `${accentColor}33`, backgroundColor: `${accentColor}1A` }}>
                                        <Wallet className="w-6 h-6" style={{ color: accentColor }} />
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="space-y-6">
                                {/* Details Box */}
                                <div className={`p-6 rounded-2xl border space-y-4 ${isPaymentRequest
                                    ? 'bg-emerald-400/5 border-emerald-400/10'
                                    : 'bg-white/5 border-white/10'
                                    }`}>
                                    {/* Amount Row */}
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <span className={`font-bold uppercase tracking-wider text-xs ${isPaymentRequest ? 'text-emerald-300/80' : 'text-white'
                                            }`}>
                                            {isTransfer ? 'Sending' : isPaymentRequest ? 'Requesting' : 'Details'}
                                        </span>
                                        <span className="text-2xl font-black text-white">{amount} SUI</span>
                                    </div>

                                    {/* Address Row */}
                                    {details.recipient && (
                                        <div className="space-y-2">
                                            <span className={`font-bold uppercase tracking-wider text-xs block ${isPaymentRequest ? 'text-emerald-300/80' : 'text-white'
                                                }`}>
                                                {isTransfer ? 'To Recipient' : isPaymentRequest ? 'From Address' : 'Address'}
                                            </span>
                                            <span className="text-sm font-mono text-white break-all bg-black/40 p-3 rounded-xl block border border-white/5">
                                                {details.recipient}
                                            </span>
                                        </div>
                                    )}

                                    {/* Remark Row (Optional) */}
                                    {details.remark && (
                                        <div className="flex justify-between items-center pt-2">
                                            <span className={`font-bold uppercase tracking-wider text-xs ${isPaymentRequest ? 'text-emerald-300/80' : 'text-white'
                                                }`}>Remark</span>
                                            <span className="text-sm text-white/50">{details.remark}</span>
                                        </div>
                                    )}

                                    {/* Fee Row (Transfer only) */}
                                    {isTransfer && (
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-white font-bold uppercase tracking-wider text-xs">Estimated Fee</span>
                                            <span className="text-sm text-[#6FBEE5] font-bold">~0.002 SUI</span>
                                        </div>
                                    )}
                                </div>

                                {/* Warning / Info Box */}
                                {isPaymentRequest ? (
                                    <div className="bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20 flex items-start gap-3">
                                        <Sparkles className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-emerald-300/80 leading-relaxed">
                                            Once confirmed, a payment request will be sent to this address. You will receive the funds after they approve the transaction.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-[#6FBEE5]/10 p-4 rounded-xl border border-[#6FBEE5]/20 flex items-start gap-3">
                                        <Zap className="w-5 h-5 text-[#6FBEE5] flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-[#6FBEE5] leading-relaxed">
                                            {isTransfer
                                                ? 'Transactions on Sui are permanent. Please double-check the recipient address before confirming.'
                                                : 'This action cannot be undone.'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 mt-10">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 py-4 px-6 rounded-2xl text-white/60 font-bold hover:bg-white/5 transition-all outline-none"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isSending || (isTransfer && (amount || 0) > walletBalance)}
                                    className={`flex-[2] py-4 px-6 font-black rounded-2xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden ${isPaymentRequest
                                        ? 'bg-emerald-400 hover:bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                                        : 'bg-[#6FBEE5] hover:bg-[#5DAED5] text-white shadow-[0_0_20px_rgba(111,190,229,0.3)]'
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                    <span className={`relative z-10 flex items-center justify-center gap-2 text-xl ${isPaymentRequest ? 'text-slate-950' : 'text-white'
                                        }`}>
                                        {isSending ? (
                                            <>
                                                <div className={`w-7 h-7 border-3 rounded-full animate-spin ${isPaymentRequest
                                                    ? 'border-black/20 border-t-black'
                                                    : 'border-white/30 border-t-white'
                                                    }`} />
                                                {isPaymentRequest ? 'Processing...' : 'Sending...'}
                                            </>
                                        ) : (
                                            <>
                                                {isTransfer ? 'Confirm Send' : isPaymentRequest ? 'Confirm Request' : 'Confirm'}
                                                {isTransfer ? (
                                                    <SendHorizontal className="w-7 h-7 text-white" />
                                                ) : isPaymentRequest ? (
                                                    <ArrowDown className="w-5 h-5" />
                                                ) : (
                                                    <CheckCircle2 className="w-5 h-5" />
                                                )}
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>

                            {/* AI Badge Footer */}
                            {showAiBadge && (
                                <div className="mt-8 flex items-center justify-center gap-2 opacity-40">
                                    <Bot className="w-4 h-4 text-white" />
                                    <span className="text-xs font-medium text-white uppercase tracking-widest">
                                        Transaction Initiated by Mindy AI
                                    </span>
                                </div>
                            )}
                        </div>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
