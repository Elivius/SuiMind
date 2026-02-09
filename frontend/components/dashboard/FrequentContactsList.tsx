"use client";

import { Card } from "@/components/ui";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, MoreHorizontal, Copy, ExternalLink, Pin } from "lucide-react";
import { formatSuiAmount, truncateAddress } from "@/lib/utils";
import type { FrequentContact } from "@/types/insights";

interface Props {
    contacts: FrequentContact[];
}

export function FrequentContactsList({ contacts }: Props) {
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
                    contacts.map((contact, idx) => {
                        const displayName = contact.name || truncateAddress(contact.address);
                        const displayInitials = (contact.name?.charAt(0) || contact.address.charAt(2) || "?").toUpperCase();

                        return (
                            <div key={contact.address} className="group p-5 rounded-3xl bg-[#111] border border-white/5 hover:border-white/10 transition-all">
                                {/* Header: Avatar + Name + Txs */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-slate-950 relative
                                    ${idx === 0 ? 'bg-emerald-400' : idx === 1 ? 'bg-[#6FBEE5]' : 'bg-purple-400'}
                                 `}>
                                            {displayInitials}
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#111] rounded-full flex items-center justify-center">
                                                <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-emerald-400' : idx === 1 ? 'bg-[#6FBEE5]' : 'bg-purple-400'}`} />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg leading-tight">{displayName}</h3>
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
                        )
                    })
                )}
            </div>
        </Card>
    );
}
