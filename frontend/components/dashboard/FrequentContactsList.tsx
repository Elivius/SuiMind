"use client";

import { Card } from "@/components/ui";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, MoreHorizontal, Copy, ExternalLink, Pin } from "lucide-react";
import { formatSuiAmount, truncateAddress } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface Props {
    transactions: any[];
}

export function FrequentContactsList({ transactions }: Props) {
    const account = useCurrentAccount();
    const currentAddress = account?.address;

    const contacts = useMemo(() => {
        if (!currentAddress || !transactions) return [];

        const stats: Record<string, {
            address: string;
            name?: string;
            txCount: number; // This one is total transaction num
            sent: number;
            received: number;
            cashflow: number; 
            lastTxTime: number;
        }> = {};

        transactions.forEach(tx => {
            // We only care about P2P transfers for contacts, not system stuff usually
            // But let's include everything where there is a 'counterparty'
            let counterpart = "";
            let amount = tx.amount || 0;
            let isIncoming = false;

            if (tx.type === "receive" && tx.from && tx.from !== "Unknown") {
                counterpart = tx.from;
                isIncoming = true;
            } else if (tx.type === "send" && tx.to && tx.to !== "Unknown") {
                counterpart = tx.to;
                isIncoming = false;
            }

            if (!counterpart) return;

            if (!stats[counterpart]) {
                stats[counterpart] = {
                    address: counterpart,
                    txCount: 0,
                    sent: 0,
                    received: 0,
                    cashflow: 0,
                    lastTxTime: 0
                };
            }

            stats[counterpart].txCount++;
            // We need timestamp for sorting "recent" maybe? For "Frequent", count is king.
            // But `transactions` passed in are already sorted by time usually?
            
            if (isIncoming) {
                stats[counterpart].received += amount;
                stats[counterpart].cashflow += amount;
            } else {
                stats[counterpart].sent += amount;
                stats[counterpart].cashflow -= amount; 
            }
        });

        // Mock Names for Demo
        const mockNames: Record<string, string> = {
            "0x1a2b3c4d": "Alex Morgan", // Example (won't match real addresses likely, but good for structure)
        };

        // Sort by transaction count desc
        return Object.values(stats)
            .sort((a, b) => b.txCount - a.txCount)
            .slice(0, 3) // Top 3
            .map(c => ({
                ...c,
                name: mockNames[c.address.slice(0, 10)] || `User ${c.address.slice(0, 4)}`,
                displayName: mockNames[c.address.slice(0, 10)] || truncateAddress(c.address)
            }));

    }, [transactions, currentAddress]);

    // If no contacts, show empty state or fallback?
    // Use mock data if empty for visual fidelity to the requested design?
    // The user request shows specific names and data. I should likely hardcode SOME mock data if real data is empty, 
    // OR just render the real data. Given "Hackathon", let's render real data but robustly handle empty.

    // Actually, to match the "Design" exactly, I might need to mock if there are 0 contacts.
    // But let's stick to real logic first.

    return (
        <Card className="border-white/20 backdrop-blur-xl bg-white/5 lg:h-[70vh] flex flex-col">
            <div className="p-6 pb-2 flex-shrink-0">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Frequent Contacts</h2>
                        <p className="text-white/40 text-sm font-medium">People you transact with the most</p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all text-sm font-bold flex items-center gap-2">
                        <Pin className="w-4 h-4" />
                        Pin Address
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-0 space-y-4">
                {contacts.length === 0 ? (
                    <div className="text-center text-white/40 py-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <MoreHorizontal className="w-8 h-8 text-white/20" />
                        </div>
                        <p>No frequent contacts yet</p>
                    </div>
                ) : (
                    contacts.map((contact, idx) => (
                        <div key={contact.address} className="group p-5 rounded-3xl bg-[#111] border border-white/5 hover:border-white/10 transition-all">
                            {/* Header: Avatar + Name + Txs */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-slate-950 relative
                                ${idx === 0 ? 'bg-emerald-400' : idx === 1 ? 'bg-[#6FBEE5]' : 'bg-purple-400'}
                             `}>
                                        {contact.name.charAt(0)}
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#111] rounded-full flex items-center justify-center">
                                            <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-emerald-400' : idx === 1 ? 'bg-[#6FBEE5]' : 'bg-purple-400'}`} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg leading-tight">{contact.displayName}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-white/40 text-xs font-mono">{truncateAddress(contact.address)}</span>
                                            <button className="text-white/20 hover:text-white transition-colors">
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-white/40 text-xs font-bold mb-1">{contact.txCount} txns</span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                                {/* Sent */}
                                <div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Sent</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                            <ArrowUpRight className="w-3 h-3 text-red-400" />
                                        </div>
                                        <span className="text-white font-bold text-sm">{formatSuiAmount(contact.sent, 2)} SUI</span>
                                    </div>
                                </div>

                                {/* Received */}
                                <div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Received</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                            <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
                                        </div>
                                        <span className="text-white font-bold text-sm">{formatSuiAmount(contact.received, 2)} SUI</span>
                                    </div>
                                </div>

                                {/* Cashflow */}
                                <div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Cashflow</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${contact.cashflow >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                            {contact.cashflow >= 0 ? (
                                                <TrendingUp className="w-3 h-3 text-emerald-400" />
                                            ) : (
                                                <TrendingDown className="w-3 h-3 text-red-400" />
                                            )}
                                        </div>
                                        <span className={`font-bold text-sm ${contact.cashflow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {contact.cashflow > 0 ? '+' : ''}{formatSuiAmount(contact.cashflow, 2)} SUI
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
