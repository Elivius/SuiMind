"use client";

import { Card } from "@/components/ui";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, MoreHorizontal, Copy, ExternalLink, Pin, Pencil, Check, X } from "lucide-react";
import { formatSuiAmount, truncateAddress } from "@/lib/utils";
import type { FrequentContact } from "@/types/insights";
import { useState, useRef, useEffect } from "react";
import { useAddressBook } from "@/hooks";
import { toast } from "sonner";

interface Props {
    contacts: FrequentContact[];
}

export function FrequentContactsList({ contacts }: Props) {
    const { contacts: addressBook, updateContactName } = useAddressBook();
    const [editingAddress, setEditingAddress] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingAddress && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingAddress]);

    const handleStartEdit = (contact: FrequentContact) => {
        setEditingAddress(contact.address);
        // Prioritize address book name, then contact name (if any), then empty
        setEditName(addressBook[contact.address] || contact.name || "");
    };

    const handleSaveEdit = async () => {
        if (!editingAddress) return;

        try {
            await updateContactName(editingAddress, editName.trim());
            toast.success("Contact name updated");
        } catch (error) {
            toast.error("Failed to update contact name");
        } finally {
            setEditingAddress(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingAddress(null);
        setEditName("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

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
                        // Use name from address book if available, otherwise will use the sui address
                        const savedName = addressBook[contact.address];
                        const displayName = savedName || contact.name || truncateAddress(contact.address);
                        const displayInitials = (displayName.charAt(0) || "?").toUpperCase();

                        const isEditing = editingAddress === contact.address;

                        return (
                            <div key={contact.address} className="group p-5 rounded-3xl bg-[#111] border border-white/5 hover:border-white/10 transition-all">
                                {/* Header: Avatar + Name + Txs */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-slate-950 relative
                                            ${idx === 0 ? 'bg-emerald-400' : idx === 1 ? 'bg-[#6FBEE5]' : 'bg-purple-400'}`}>
                                            {displayInitials}
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#111] rounded-full flex items-center justify-center">
                                                <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-emerald-400' : idx === 1 ? 'bg-[#6FBEE5]' : 'bg-purple-400'}`} />
                                            </div>
                                        </div>
                                        <div>
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        ref={inputRef}
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        onKeyDown={handleKeyDown}
                                                        className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white font-bold text-lg leading-tight focus:outline-none focus:border-white/40 w-[150px]"
                                                        onBlur={handleSaveEdit}
                                                    />
                                                    <button onClick={handleSaveEdit} className="p-1 hover:bg-white/10 rounded-full text-emerald-400">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={handleCancelEdit} className="p-1 hover:bg-white/10 rounded-full text-red-400">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="group/name flex items-center gap-2 cursor-pointer"
                                                    onDoubleClick={() => handleStartEdit(contact)}
                                                >
                                                    <h3 className="text-white font-bold text-lg leading-tight group-hover/name:text-blue-400 transition-colors" title="Double click to rename">
                                                        {displayName}
                                                    </h3>
                                                    <Pencil className="w-3 h-3 text-white/20 opacity-0 group-hover/name:opacity-100 transition-opacity" />
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-white/40 text-xs font-mono">{truncateAddress(contact.address)}</span>
                                                <button className="text-white/20 hover:text-white transition-colors" onClick={() => {
                                                    navigator.clipboard.writeText(contact.address);
                                                    toast.success("Address copied");
                                                }}>
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-white/40 text-xs font-bold mb-1">{contact.txCount} transactions</span>
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
