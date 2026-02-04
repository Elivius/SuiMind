"use client"

import { Wallet, Bell, Check, X } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import GooeyNav from "@/components/ui/gooey-nav"
import { navigation } from "@/lib/constants"
import { WalletConnectButton } from "@/components/ui/wallet-connect-button"
import { SuiMindLogo, MindyAILogo } from "@/components/icons"
import { usePaymentRequests } from "@/hooks";
import { useState, useEffect, useRef } from "react";
import { playSound } from "@/lib/sound-effects";


export function Header() {
    const pathname = usePathname()

    // Determine active nav index based on current path
    const { pendingRequests, isLoading, hasUnread, onTransactionSuccess, rejectedRequests, paidNotifications } = usePaymentRequests();    
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
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

    return (
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
                        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden flex-shrink-0 transition-transform active:scale-95 duration-200">
                            <SuiMindLogo />
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
                            <Button variant="ghost" size="icon" className=" relative text-white/70 hover:text-white hover:bg-white/10 w-9 h-9 sm:w-10 sm:h-10" onClick={() => setShowDropdown(!showDropdown)}>
                                <Bell className="w-5 h-5" />
                                {hasUnread && (
                                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                                )}
                            </Button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-[100] overflow-hidden">
                                    {/* Header */}
                                    <div className="px-4 py-3 border-b border-white/10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-white">Payment Requests</h3>
                                            {pendingRequests.length > 0 && (
                                                <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                                                    {pendingRequests.length} pending
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                {/* Request List */}
                                <div className="max-h-80 overflow-y-auto">
                                    {pendingRequests.length === 0 ? (
                                        <div className="px-4 py-8 text-center">
                                            <Bell className="w-8 h-8 text-white/20 mx-auto mb-2" />
                                            <p className="text-sm text-white/50">No pending requests</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-white/5">
                                            {pendingRequests.map((req) => {
                                                const isSelected = selectedRequestId === req.id
                                                return (
                                                <div key={req.id}>
                                                    <button
                                                    type="button"
                                                    className="w-full px-4 py-3 hover:bg-white/5 transition-colors text-left cursor-pointer"
                                                    onClick={() => setSelectedRequestId(isSelected ? null : req.id)}
                                                    >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-[#6FBEE5] font-mono truncate">
                                                            {req.requester.slice(0, 6)}...{req.requester.slice(-4)}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <p className="text-lg font-semibold text-emerald-400">
                                                            {req.amountSui} SUI
                                                            </p>
                                                        </div>
                                                        </div>
                                                        <div className="shrink-0">
                                                        <svg
                                                            className={`w-4 h-4 text-white/40 transition-transform ${isSelected ? "rotate-180" : ""}`}
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                        </div>
                                                    </div>
                                                    </button>
                                                    
                                                    {isSelected && (
                                                        <div className="px-4 pb-3 flex items-center gap-2 bg-white/5">
                                                            <Button
                                                            size="sm"
                                                            className="flex-1 h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
                                                            onClick={() => {
                                                                window.dispatchEvent(new CustomEvent('PAY_REQUEST', { detail: req }));
                                                                setShowDropdown(false);
                                                            }}
                                                            >
                                                            <Check className="w-4 h-4 mr-1.5" />
                                                            Pay
                                                            </Button>
                                                            <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="flex-1 h-9 border-red-500/50 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-medium bg-transparent"
                                                            onClick={() => {
                                                                setSelectedRequestId(null);
                                                                window.dispatchEvent(new CustomEvent('REJECT_REQUEST', {detail: req.id}));
                                                            }}
                                                            >
                                                            <X className="w-4 h-4 mr-1.5" />
                                                            Reject
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {paidNotifications.length > 0 && (
                                        <div className="px-4 py-2 bg-emerald-500/10 border-y border-white/10 mt-2">
                                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Received Payments</p>
                                        </div>
                                    )}
                                    {paidNotifications.map((noti) => (
                                        <div key={noti.id} className="px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="text-xs text-white/50">{noti.paid_by.slice(0,6)}... paid you</p>
                                                    <p className="text-sm font-bold text-emerald-400">+{noti.amountSui} SUI</p>
                                                </div>
                                                <button 
                                                    onClick={() => window.dispatchEvent(new CustomEvent('CLEAR_NOTIFICATION', { detail: noti.id }))}
                                                    className="ml-2 p-1 hover:bg-white/10 rounded-full text-white/20"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {rejectedRequests.length > 0 && (
                                        <div className="px-4 py-2 bg-red-500/10 border-b border-white/10 mt-2">
                                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Sent Requests (Rejected)</p>
                                        </div>
                                    )}
                                    {rejectedRequests.map((rej) => (
                                        <div key={rej.id} className="px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                            <p className="text-xs text-white/50">Your request to {rej.rejected_by.slice(0,6)}... was declined</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-sm font-bold text-white/30 line-through">{rej.amountSui} SUI</p>
                                                <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-400 font-bold uppercase">Rejected</span>
                                            </div>
                                            </div>
                                            {/* Dismiss Button */}
                                            <button 
                                            onClick={() => window.dispatchEvent(new CustomEvent('CLEAR_NOTIFICATION', { detail: rej.id }))}
                                            className="ml-2 p-1 hover:bg-white/10 rounded-full text-white/20"
                                            >
                                            <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                        

                        <WalletConnectButton />
                    </div>
                </div>
            </div>
        </header>
    )
}