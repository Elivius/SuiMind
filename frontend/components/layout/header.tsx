"use client"

import { Bell, Check, X } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import GooeyNav from "@/components/ui/gooey-nav"
import { navigation } from "@/lib/constants"
import { WalletConnectButton } from "@/components/ui/wallet-connect-button"
import { SuiMindLogo } from "@/components/icons"
import { SendTransactionModal } from "@/components/transactionModal";
import { usePaymentRequests, useTransactionManager, useGetBalances } from "@/hooks";
import { useState, useEffect, useRef } from "react";
import { playSound } from "@/lib/sound-effects";
import { motion, AnimatePresence } from "motion/react";
import { mistToSui, truncateAddress } from "@/lib/utils";


export function Header() {
    const pathname = usePathname()

    // Determine active nav index based on current path
    const { pendingRequests, isLoading, hasUnread, onTransactionSuccess, refetch, rejectedRequests, paidNotifications } = usePaymentRequests();
    const { transferSui, rejectRequest, deleteNotification } = useTransactionManager();
    const { data: balanceData } = useGetBalances();
    const walletBalance = balanceData?.totalBalance ? mistToSui(balanceData.totalBalance) : 0;

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedPaymentRequest, setSelectedPaymentRequest] = useState<{ id: string; requester: string; amountSui: string; remark?: string } | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const activeIndex = navigation.findIndex(item => pathname === item.href)

    const dropdownRef = useRef<HTMLDivElement>(null)
    const prevRequestsCount = useRef(0)
    const isFirstLoad = useRef(true)

    // Play sound when new notifications arrive
    useEffect(() => {
        if (isLoading) return;

        if (isFirstLoad.current) {
            prevRequestsCount.current = pendingRequests.length;
            isFirstLoad.current = false;
            return;
        }

        if (pendingRequests.length > prevRequestsCount.current) {
            playSound('notification');
        }
        prevRequestsCount.current = pendingRequests.length;
    }, [pendingRequests, isLoading]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
                setSelectedRequestId(null)
            }
        }

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showDropdown])

    const openPaymentConfirmation = (req: { id: string; requester: string; amountSui: string; remark?: string }) => {
        setSelectedPaymentRequest(req);
        setShowConfirmModal(true);
        setShowDropdown(false);
    };

    const handleConfirmPayment = async () => {
        if (!selectedPaymentRequest) return;
        setIsProcessingPayment(true);
        try {
            const success = await transferSui({
                amount: selectedPaymentRequest.amountSui,
                recipient: selectedPaymentRequest.requester,
                paymentRequestId: selectedPaymentRequest.id,
                walletBalance
            });
            if (success) {
                await onTransactionSuccess();
                refetch();
                // Don't close modal here - let the success screen show first
                // Modal will close when user clicks "Done" via onClose callback
            }
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleReject = async (id: string) => {
        const success = await rejectRequest(id);
        if (success) {
            playSound('rejected');
            await onTransactionSuccess();
            refetch();
            setSelectedRequestId(null);
        }
    };

    const handleClearPaid = async (id: string) => {
        const success = await deleteNotification(id, 'paid');
        if (success) {
            await onTransactionSuccess();
            refetch();
        }
    };

    const handleClearReject = async (id: string) => {
        const success = await deleteNotification(id, 'reject');
        if (success) {
            await onTransactionSuccess();
            refetch();
        }
    };

    return (
        <>
            <header className="border-b border-white/10 backdrop-blur-xl bg-white/5 fixed top-0 left-0 right-0 z-40">
                <div className="w-full px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link
                            href="/home"
                            onClick={(e) => {
                                if (pathname === "/home") {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                            className="flex items-center gap-2 sm:gap-3 flex-shrink-0 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-14 h-14 sm:w-14 sm:h-14 rounded-2xl overflow-hidden flex-shrink-0 transition-transform active:scale-95 duration-200">
                                <SuiMindLogo className="w-13 h-13" />
                            </div>
                            <h1 className="text-lg sm:text-2xl font-bold">SuiMind</h1>
                        </Link>

                        {/* Center Nav - Desktop only */}
                        <div className="hidden min-[1025px]:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ height: '45px' }}>
                            <GooeyNav
                                items={navigation}
                                particleCount={5}
                                particleDistances={[90, 10]}
                                particleR={100}
                                initialActiveIndex={activeIndex >= 0 ? activeIndex : 0}
                                animationTime={600}
                                timeVariance={300}
                                colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                            />
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div ref={dropdownRef} className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`relative w-9 h-9 sm:w-10 sm:h-10 transition-colors ${showDropdown ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <Bell className={`w-5 h-5 transition-transform duration-300 ${showDropdown ? 'scale-110' : ''}`} />
                                    {hasUnread && (
                                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                                    )}
                                </Button>

                                <AnimatePresence>
                                    {showDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                            transition={{ type: "spring", damping: 25, stiffness: 400 }}
                                            className="absolute right-0 mt-3 w-80 sm:w-[420px] bg-[#0A111F] border border-white/10 rounded-[2.5rem] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.9)] z-[100] overflow-hidden"
                                        >
                                            {/* Header */}
                                            <div className="px-6 py-5 border-b border-white/5 bg-white/5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Bell className="w-4 h-4 text-[#6FBEE5]" />
                                                        <h3 className="text-base font-bold text-white tracking-tight">Notifications</h3>
                                                    </div>
                                                    {(pendingRequests.length > 0 || paidNotifications.length > 0 || rejectedRequests.length > 0) && (
                                                        <span className="px-2.5 py-1 text-[10px] font-black bg-white/10 text-white/50 rounded-full uppercase tracking-widest">
                                                            {pendingRequests.length + paidNotifications.length + rejectedRequests.length} Total
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Request List */}
                                            <div className="max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                                                {pendingRequests.length === 0 && paidNotifications.length === 0 && rejectedRequests.length === 0 ? (
                                                    <div className="px-6 py-16 text-center">
                                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                                            <Bell className="w-8 h-8 text-white/10" />
                                                        </div>
                                                        <p className="text-sm text-white/40 font-medium">No new activity</p>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y divide-white/5">
                                                        {/* Pending Requests Section */}
                                                        {pendingRequests.map((req) => {
                                                            const isSelected = selectedRequestId === req.id
                                                            return (
                                                                <motion.div
                                                                    layout
                                                                    key={req.id}
                                                                    className={`transition-colors duration-300 ${isSelected ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'}`}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        className="w-full px-6 py-5 text-left cursor-pointer group"
                                                                        onClick={() => setSelectedRequestId(isSelected ? null : req.id)}
                                                                    >
                                                                        <div className="flex items-start justify-between gap-4">
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-2 mb-1">
                                                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                                                        <Check className="w-3 h-3 text-emerald-400" />
                                                                                    </div>
                                                                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Payment Request</p>
                                                                                </div>
                                                                                <p className="text-sm font-bold text-white mb-0.5">
                                                                                    Request from {truncateAddress(req.requester)}
                                                                                </p>
                                                                                {req.remark && req.remark !== 'No remark' && (
                                                                                    <p className="text-s text-white mb-1 italic">
                                                                                        <span className="text-white not-italic">Category:</span>{'\"'}{req.remark}{'\"'}
                                                                                    </p>
                                                                                )}
                                                                                <p className="text-xl font-black text-white tracking-tight">
                                                                                    {req.amountSui} <span className="text-xs text-[#6FBEE5] font-bold ml-1 uppercase">SUI</span>
                                                                                </p>
                                                                            </div>
                                                                            <div className={`mt-2 p-1.5 rounded-lg border border-white/5 ${isSelected ? 'bg-[#6FBEE5]/20 border-[#6FBEE5]/30' : 'bg-white/5'}`}>
                                                                                <svg
                                                                                    className={`w-4 h-4 ${isSelected ? "text-[#6FBEE5]" : "text-white/20"} ${isSelected ? "rotate-180" : ""}`}
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    stroke="currentColor"
                                                                                >
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                    </button>

                                                                    <AnimatePresence initial={false}>
                                                                        {isSelected && (
                                                                            <motion.div
                                                                                initial={{ height: 0, opacity: 0 }}
                                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                                exit={{ height: 0, opacity: 0 }}
                                                                                transition={{
                                                                                    height: { duration: 0.35, ease: [0.23, 1, 0.32, 1] },
                                                                                    opacity: { duration: 0.2, delay: 0.1 }
                                                                                }}
                                                                                className="overflow-hidden"
                                                                            >
                                                                                <div className="px-6 pb-6 pt-2">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <Button
                                                                                            size="sm"
                                                                                            className="flex-1 h-11 bg-[#6FBEE5] hover:bg-[#5DAED5] text-white text-sm font-black rounded-xl shadow-lg shadow-[#6FBEE5]/20 group relative overflow-hidden"
                                                                                            onClick={() => openPaymentConfirmation({ ...req, amountSui: String(req.amountSui) })}
                                                                                        >
                                                                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                                                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                                                                <Check className="w-4 h-4" />
                                                                                                PAY NOW
                                                                                            </span>
                                                                                        </Button>
                                                                                        <Button
                                                                                            size="sm"
                                                                                            variant="ghost"
                                                                                            className="flex-1 h-11 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-black rounded-xl border border-red-500/20"
                                                                                            onClick={() => handleReject(req.id)}
                                                                                        >
                                                                                            <X className="w-4 h-4 mr-1.5" />
                                                                                            REJECT
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </motion.div>
                                                            )
                                                        })}

                                                        {/* Received Payments Section */}
                                                        {paidNotifications.length > 0 && (
                                                            <div className="bg-emerald-500/5 px-6 py-2 border-y border-emerald-500/10">
                                                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Received Payments</p>
                                                            </div>
                                                        )}
                                                        {paidNotifications.map((noti) => (
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                key={noti.id}
                                                                className="px-6 py-4 hover:bg-emerald-500/[0.02] flex items-center justify-between group"
                                                            >
                                                                <div className="flex-1">
                                                                    <p className="text-xs text-white font-medium mb-1">
                                                                        {truncateAddress(noti.paid_by)} paid you
                                                                    </p>
                                                                    <p className="text-lg font-black text-emerald-400">
                                                                        +{noti.amountSui} <span className="text-[10px] text-emerald-400/50 ml-1">SUI</span>
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleClearPaid(noti.id)}
                                                                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/20 hover:text-white transition-all"
                                                                    title="Dismiss"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </motion.div>
                                                        ))}

                                                        {/* Rejected Requests Section */}
                                                        {rejectedRequests.length > 0 && (
                                                            <div className="bg-red-500/5 px-6 py-2 border-y border-red-500/10">
                                                                <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Declined Requests</p>
                                                            </div>
                                                        )}
                                                        {rejectedRequests.map((rej) => (
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                key={rej.id}
                                                                className="px-6 py-4 hover:bg-red-500/[0.02] flex items-center justify-between group"
                                                            >
                                                                <div className="flex-1">
                                                                    <p className="text-xs text-white font-medium mb-1">
                                                                        Request to {truncateAddress(rej.rejected_by)} was <span className="text-red-400 font-bold">declined</span>
                                                                    </p>
                                                                    <div className="flex items-center gap-3">
                                                                        <p className="text-lg font-black text-white/20 line-through tracking-tight">
                                                                            {rej.amountSui} SUI
                                                                        </p>
                                                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-500/10 text-red-400 uppercase tracking-widest border border-red-500/20">
                                                                            Declined
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        if (rej.id) handleClearReject(rej.id);
                                                                    }}
                                                                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/20 hover:text-white transition-all"
                                                                    title="Dismiss"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer - Branding or Actions */}
                                            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5">
                                                <p className="text-[10px] text-center text-white font-bold uppercase tracking-[0.3em]">
                                                    SuiMind Notifications
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>


                            <WalletConnectButton />
                        </div>
                    </div>
                </div>
            </header>

            {/* Payment Confirmation Modal */}
            <SendTransactionModal
                isOpen={showConfirmModal}
                onClose={() => { setShowConfirmModal(false); setSelectedPaymentRequest(null); }}
                isSending={isProcessingPayment}
                onConfirm={handleConfirmPayment}
                walletBalance={walletBalance}
                initialRecipient={selectedPaymentRequest?.requester || ''}
                initialAmount={selectedPaymentRequest?.amountSui?.toString() || ''}
                initialRemark={selectedPaymentRequest?.remark !== 'No remark' ? selectedPaymentRequest?.remark : ''}
                skipToConfirm={true}
                aiMessage={selectedPaymentRequest ? `Fulfilling payment request${selectedPaymentRequest.remark && selectedPaymentRequest.remark !== 'No remark' ? `: ${selectedPaymentRequest.remark}` : ''}` : undefined}
                showAiBadge={false}
            />
        </>
    )
}