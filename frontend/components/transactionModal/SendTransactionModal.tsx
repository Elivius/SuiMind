/*
 * SendTransactionModal - Reusable Send SUI Modal
 * Extracted from home/page.tsx for reuse across the app
 * 
 * Screens: Form → Confirmation → Success
 * Supports: skipToConfirm for AI-initiated transactions
 */

"use client";

import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import {
    X, SendHorizontal, Zap, CheckCircle2, Wallet, ArrowUpRight,
    ArrowUp, ArrowDown, AtSign, MessageSquare, ChevronDown, ChevronUp,
    Utensils, Home, ShoppingCart, ShoppingBag, Pencil, Bot
} from "lucide-react";
import { truncateAddress } from "@/lib/utils";
import { TransactionConfirmModal } from "./TransactionConfirmModal";

interface SendTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletBalance: number;
    isSending: boolean;
    onConfirm: (data: { recipient: string; amount: string; remark?: string; remarkCategory?: string }) => Promise<void>;
    recentRecipients?: string[];
    initialRecipient?: string;
    initialAmount?: string;
    skipToConfirm?: boolean; // For bypassing form (AI-initiated) - directly to confirmation page
    aiMessage?: string;
    manualMessage?: string; // For non-AI flows (e.g., header payment requests)
    showAiBadge?: boolean; // Explicit control over AI badge visibility
    initialRemark?: string; // Pre-fill remark when skipping form
}

export function SendTransactionModal({
    isOpen,
    onClose,
    walletBalance,
    isSending,
    onConfirm,
    recentRecipients = [],
    initialRecipient = '',
    initialAmount = '',
    skipToConfirm = false,
    aiMessage,
    manualMessage,
    showAiBadge,
    initialRemark = '',
}: SendTransactionModalProps) {
    const [recipient, setRecipient] = useState(initialRecipient);
    const [amount, setAmount] = useState(initialAmount);
    const [showConfirm, setShowConfirm] = useState(skipToConfirm);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showRecentsDropdown, setShowRecentsDropdown] = useState(false);
    const [remark, setRemark] = useState('');
    const [remarkCategory, setRemarkCategory] = useState('');
    const [isRemarkOpen, setIsRemarkOpen] = useState(false);

    // Reset state when modal opens/closes or initial values change
    useEffect(() => {
        if (isOpen) {
            setRecipient(initialRecipient);
            setAmount(initialAmount);
            setRemark(initialRemark);
            setShowConfirm(skipToConfirm);
            setShowSuccess(false);
        } else {
            // Reset when closed
            setRecipient('');
            setAmount('');
            setShowConfirm(false);
            setShowSuccess(false);
            setRemark('');
            setRemarkCategory('');
            setIsRemarkOpen(false);
        }
    }, [isOpen, initialRecipient, initialAmount, skipToConfirm]);

    const handleConfirm = async () => {
        await onConfirm({ recipient, amount, remark, remarkCategory });
        setShowSuccess(true);
    };

    const handleClose = () => {
        setRecipient('');
        setAmount('');
        setShowConfirm(false);
        setShowSuccess(false);
        setRemark('');
        setRemarkCategory('');
        setIsRemarkOpen(false);
        onClose();
    };

    const isFormValid = (parseFloat(amount) || 0) > 0 &&
        (parseFloat(amount) || 0) <= walletBalance &&
        recipient.startsWith('0x');

    const remarkCategories = [
        { id: 'Food & Drink', icon: <Utensils className="w-3 h-3" /> },
        { id: 'Accommodation', icon: <Home className="w-3 h-3" /> },
        { id: 'Grocery', icon: <ShoppingCart className="w-3 h-3" /> },
        { id: 'Shop', icon: <ShoppingBag className="w-3 h-3" /> },
        { id: 'Other', icon: <Pencil className="w-3 h-3" /> }
    ];

    // When skipToConfirm is true, render TransactionConfirmModal directly without outer wrapper
    // This avoids double animations (outer modal + inner modal both animating)
    if (skipToConfirm && showConfirm) {
        // Show success screen after transaction completes
        if (showSuccess) {
            return (
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <Motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                                onClick={handleClose}
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
                                            <div className="w-12 h-12 bg-[#6FBEE5]/20 rounded-2xl flex items-center justify-center border border-[#6FBEE5]/30">
                                                <SendHorizontal className="w-6 h-6 text-[#6FBEE5]" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-white tracking-tight">Send SUI</h2>
                                                <p className="text-[#6FBEE5] text-sm font-medium">Quick and secure transfer</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleClose}
                                            className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                                        >
                                            <X className="w-6 h-6 text-white/40 group-hover:text-white" />
                                        </button>
                                    </div>

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
                                                className="w-24 h-24 bg-[#6FBEE5]/20 rounded-full flex items-center justify-center border-2 border-[#6FBEE5]/50 shadow-[0_0_40px_rgba(111,190,229,0.2)]"
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
                                                    className="text-[#6FBEE5]"
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
                                                className="absolute inset-0 bg-[#6FBEE5]/30 rounded-full -z-10"
                                            />
                                        </div>

                                        <div className="text-center space-y-2">
                                            <h3 className="text-3xl font-black text-white tracking-tight">Transaction Successful!</h3>
                                            <p className="text-[#6FBEE5] font-medium">Transaction completed successfully</p>
                                        </div>

                                        <button
                                            onClick={handleClose}
                                            className="w-full py-4 px-6 bg-[#6FBEE5] hover:bg-[#5DAED5] text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(111,190,229,0.3)] group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                            <span className="relative z-10 flex items-center justify-center gap-3 text-white text-2xl">
                                                Done
                                                <CheckCircle2 className="w-8 h-8 text-white" />
                                            </span>
                                        </button>
                                    </Motion.div>
                                </div>
                            </Motion.div>
                        </div>
                    )}
                </AnimatePresence>
            );
        }

        // Show confirmation modal
        return (
            <TransactionConfirmModal
                isOpen={isOpen}
                details={{
                    type: 'TRANSFER_SUI',
                    recipient,
                    amount,
                    remark
                }}
                walletBalance={walletBalance}
                isSending={isSending}
                onConfirm={handleConfirm}
                onCancel={handleClose}
                aiMessage={aiMessage}
                manualMessage={manualMessage}
                showAiBadge={showAiBadge ?? !!aiMessage}
            />
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={handleClose}
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
                                    <div className="w-12 h-12 bg-[#6FBEE5]/20 rounded-2xl flex items-center justify-center border border-[#6FBEE5]/30">
                                        <SendHorizontal className="w-6 h-6 text-[#6FBEE5]" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white tracking-tight">Send SUI</h2>
                                        {aiMessage ? (
                                            <div className="flex items-center gap-2 text-sm text-white/50">
                                                <Bot className="w-4 h-4" />
                                                <span>Initiated by Mindy AI</span>
                                            </div>
                                        ) : (
                                            <p className="text-[#6FBEE5] text-sm font-medium">Quick and secure transfer</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                                >
                                    <X className="w-6 h-6 text-white/40 group-hover:text-white" />
                                </button>
                            </div>

                            {/* Success Screen */}
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
                                            className="w-24 h-24 bg-[#6FBEE5]/20 rounded-full flex items-center justify-center border-2 border-[#6FBEE5]/50 shadow-[0_0_40px_rgba(111,190,229,0.2)]"
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
                                                className="text-[#6FBEE5]"
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
                                            className="absolute inset-0 bg-[#6FBEE5]/30 rounded-full -z-10"
                                        />
                                    </div>

                                    <div className="text-center space-y-2">
                                        <h3 className="text-3xl font-black text-white tracking-tight">Transaction Successful!</h3>
                                        <p className="text-[#6FBEE5] font-medium">Transaction completed successfully</p>
                                    </div>

                                    <button
                                        onClick={handleClose}
                                        className="w-full py-4 px-6 bg-[#6FBEE5] hover:bg-[#5DAED5] text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(111,190,229,0.3)] group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                        <span className="relative z-10 flex items-center justify-center gap-3 text-white text-2xl">
                                            Done
                                            <CheckCircle2 className="w-8 h-8 text-white" />
                                        </span>
                                    </button>
                                </Motion.div>
                            ) : (
                                <>
                                    {/* AI Message (if present) */}
                                    {aiMessage && (
                                        <div className="mb-6 p-4 rounded-xl border flex items-start gap-3 bg-[#6FBEE5]/10 border-[#6FBEE5]/20">
                                            <Bot className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#6FBEE5]" />
                                            <p className="text-sm leading-relaxed text-[#6FBEE5]">{aiMessage}</p>
                                        </div>
                                    )}

                                    {/* Available Balance */}
                                    <div className="mb-8 p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">Available Balance</p>
                                            <p className="text-2xl font-black text-white">
                                                {walletBalance.toLocaleString("en-US", {
                                                    minimumFractionDigits: 4,
                                                    maximumFractionDigits: 4
                                                })}
                                                <span className="text-lg font-bold text-[#6FBEE5] ml-2">SUI</span>
                                            </p>
                                        </div>
                                        <div className="bg-[#6FBEE5]/10 p-3 rounded-xl border border-[#6FBEE5]/20">
                                            <Wallet className="w-6 h-6 text-[#6FBEE5]" />
                                        </div>
                                    </div>

                                    {!showConfirm ? (
                                        <>
                                            {/* Form Fields */}
                                            <div className="space-y-6">
                                                <div className="group">
                                                    <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2.5 ml-1">
                                                        Recipient Address
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="0x..."
                                                            value={recipient}
                                                            onFocus={() => setShowRecentsDropdown(true)}
                                                            onBlur={() => setTimeout(() => setShowRecentsDropdown(false), 200)}
                                                            onChange={(e) => setRecipient(e.target.value)}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#6FBEE5]/30 focus:border-[#6FBEE5]/50 transition-all font-mono text-sm"
                                                        />

                                                        {/* Recent Recipients Dropdown */}
                                                        {showRecentsDropdown && recentRecipients.length > 0 && (
                                                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                                                                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Recipients</p>
                                                                </div>
                                                                {recentRecipients.map((addr) => (
                                                                    <button
                                                                        key={addr}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setRecipient(addr);
                                                                            setShowRecentsDropdown(false);
                                                                        }}
                                                                        className="w-full px-4 py-3 text-left text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                                                                    >
                                                                        <AtSign className="w-4 h-4 text-gray-300" />
                                                                        <span className="font-mono">{truncateAddress(addr)}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="group">
                                                    <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2.5 ml-1">
                                                        Amount
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={amount}
                                                            onChange={(e) => setAmount(e.target.value)}
                                                            placeholder="0.00"
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#6FBEE5]/30 focus:border-[#6FBEE5]/50 transition-all text-3xl font-black"
                                                        />
                                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                                            <div className="flex flex-col border-r border-white/10 pr-4">
                                                                <button
                                                                    onClick={() => setAmount((prev) => (parseFloat(prev || '0') + 0.1).toFixed(2))}
                                                                    className="text-white/20 hover:text-[#6FBEE5] transition-colors"
                                                                >
                                                                    <ArrowUp className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setAmount((prev) => Math.max(0, parseFloat(prev || '0') - 0.1).toFixed(2))}
                                                                    className="text-white/20 hover:text-[#6FBEE5] transition-colors"
                                                                >
                                                                    <ArrowDown className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                            <span className="text-[#6FBEE5] font-black text-xl">SUI</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Collapsible Remark Section */}
                                            <div className="mb-6 mt-6 border border-white/10 rounded-2xl overflow-hidden transition-all bg-white/5">
                                                <button
                                                    onClick={() => setIsRemarkOpen(!isRemarkOpen)}
                                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                                                        <MessageSquare className="w-4 h-4 text-[#6FBEE5]" />
                                                        <span>Add a remark</span>
                                                        {remark && (
                                                            <span className="bg-[#6FBEE5]/20 text-[#6FBEE5] text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                Added
                                                            </span>
                                                        )}
                                                    </div>
                                                    {isRemarkOpen ? (
                                                        <ChevronUp className="w-4 h-4 text-white/40" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-white/40" />
                                                    )}
                                                </button>

                                                <AnimatePresence>
                                                    {isRemarkOpen && (
                                                        <Motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-4 pt-0 space-y-4">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {remarkCategories.map((cat) => (
                                                                        <button
                                                                            key={cat.id}
                                                                            onClick={() => {
                                                                                setRemarkCategory(cat.id);
                                                                                if (cat.id !== 'Other') {
                                                                                    setRemark(cat.id);
                                                                                } else {
                                                                                    setRemark('');
                                                                                }
                                                                            }}
                                                                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${remarkCategory === cat.id
                                                                                ? 'bg-[#6FBEE5] border-[#6FBEE5] text-white shadow-[0_0_15px_rgba(111,190,229,0.3)]'
                                                                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white'
                                                                                }`}
                                                                        >
                                                                            {cat.icon}
                                                                            {cat.id}
                                                                        </button>
                                                                    ))}
                                                                </div>

                                                                {remarkCategory === 'Other' && (
                                                                    <div className="relative">
                                                                        <textarea
                                                                            value={remark}
                                                                            onChange={(e) => {
                                                                                if (e.target.value.length <= 50) {
                                                                                    setRemark(e.target.value);
                                                                                }
                                                                            }}
                                                                            placeholder="Type your remark..."
                                                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#6FBEE5]/50 focus:border-[#6FBEE5]/50 transition-all resize-none h-20"
                                                                        />
                                                                        <div className="absolute bottom-2 right-2 text-[10px] text-white/40 font-mono">
                                                                            {remark.length}/50
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-4 mt-10">
                                                <button
                                                    onClick={handleClose}
                                                    className="flex-1 py-4 px-6 rounded-2xl text-white/60 font-bold hover:bg-white/5 transition-all outline-none"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => setShowConfirm(true)}
                                                    disabled={isSending || !isFormValid}
                                                    className="flex-[2] py-4 px-6 bg-[#6FBEE5] hover:bg-[#5DAED5] text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(111,190,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                                    <span className="relative z-10 flex items-center justify-center gap-2 text-xl text-white">
                                                        Next
                                                        <ArrowUpRight className="w-7 h-7 text-white" />
                                                    </span>
                                                </button>
                                            </div>

                                            {/* Remark Preview Badge */}
                                            {remark && (
                                                <Motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-4 flex justify-center"
                                                >
                                                    <div className="bg-[#6FBEE5]/10 border border-[#6FBEE5]/20 rounded-full px-4 py-1.5 flex items-center gap-2">
                                                        {remarkCategory === 'Food & Drink' && <Utensils className="w-3 h-3 text-[#6FBEE5]" />}
                                                        {remarkCategory === 'Accommodation' && <Home className="w-3 h-3 text-[#6FBEE5]" />}
                                                        {remarkCategory === 'Grocery' && <ShoppingCart className="w-3 h-3 text-[#6FBEE5]" />}
                                                        {remarkCategory === 'Shop' && <ShoppingBag className="w-3 h-3 text-[#6FBEE5]" />}
                                                        {(remarkCategory === 'Other' || !remarkCategory) && <MessageSquare className="w-3 h-3 text-[#6FBEE5]" />}
                                                        <span className="text-xs font-medium text-[#6FBEE5]">{remark}</span>
                                                    </div>
                                                </Motion.div>
                                            )}
                                        </>
                                    ) : (
                                        <TransactionConfirmModal
                                            isOpen={true}
                                            details={{
                                                type: 'TRANSFER_SUI',
                                                recipient,
                                                amount,
                                                remark
                                            }}
                                            walletBalance={walletBalance}
                                            isSending={isSending}
                                            onConfirm={handleConfirm}
                                            onCancel={() => setShowConfirm(false)}
                                            aiMessage={aiMessage}
                                            manualMessage={manualMessage}
                                            showAiBadge={showAiBadge ?? !!aiMessage}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
