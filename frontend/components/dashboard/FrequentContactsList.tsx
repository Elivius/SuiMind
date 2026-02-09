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
    onSend: (address: string) => void;
    onRequest: (address: string) => void;
}

export function FrequentContactsList({ contacts, onSend, onRequest }: Props) {
    const { contacts: addressBook, pinnedContacts, updateContactName, pinContact, unpinContact } = useAddressBook();
    const [editingAddress, setEditingAddress] = useState<string | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [newPinAddress, setNewPinAddress] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const addInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingAddress && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingAddress]);

    useEffect(() => {
        if (isAddingMode && addInputRef.current) {
            addInputRef.current.focus();
        }
    }, [isAddingMode]);

    const handleStartEdit = (contact: FrequentContact) => {
        setEditingAddress(contact.address);
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

    const handleAddPin = async () => {
        if (!newPinAddress.trim()) return;

        if (!newPinAddress.startsWith("0x")) {
            toast.error("Invalid address format");
            return;
        }

        try {
            await pinContact(newPinAddress.trim());
            toast.success("Contact pinned");
            setNewPinAddress("");
            setIsAddingMode(false);
        } catch (error) {
            toast.error("Failed to pin contact");
        }
    };

    const handleUnpin = async (address: string) => {
        try {
            await unpinContact(address);
            toast.success("Contact unpinned");
        } catch (error) {
            toast.error("Failed to unpin contact");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    const handleAddKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddPin();
        } else if (e.key === 'Escape') {
            setIsAddingMode(false);
            setNewPinAddress("");
        }
    };

    // --- Data Preparation ---

    const pinnedList = (pinnedContacts || []).map(address => {
        const existingData = contacts.find(c => c.address === address);
        if (existingData) return { ...existingData, isPinned: true };

        // Reset if no input
        return {
            address,
            name: addressBook[address] || truncateAddress(address),
            txCount: 0,
            sent: 0,
            received: 0,
            cashflow: 0,
            lastTxTime: 0,
            isPinned: true
        } as FrequentContact & { isPinned: boolean };
    });

    const unpinnedList = contacts.filter(c => !pinnedContacts?.includes(c.address));
    const displayList = [...pinnedList, ...unpinnedList];


    return (
        <Card className="border-white/20 backdrop-blur-xl bg-white/5 lg:h-[70vh] flex flex-col">
            <div className="p-6 pb-2 flex-shrink-0">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Favourate Contacts</h2>
                        <p className="text-white/40 text-sm font-medium">Frequent & Pinned</p>
                    </div>

                    {isAddingMode ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                            <input
                                ref={addInputRef}
                                value={newPinAddress}
                                onChange={(e) => setNewPinAddress(e.target.value)}
                                onKeyDown={handleAddKeyDown}
                                placeholder="0x..."
                                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm w-[180px] focus:outline-none focus:border-[#6FBEE5] placeholder:text-white/20"
                            />
                            <button onClick={handleAddPin} className="p-2 bg-[#6FBEE5]/20 hover:bg-[#6FBEE5]/40 rounded-lg text-[#6FBEE5] transition-colors">
                                <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setIsAddingMode(false); setNewPinAddress(""); }} className="p-2 bg-red-500/10 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAddingMode(true)}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all text-sm font-bold flex items-center gap-2"
                        >
                            <Pin className="w-4 h-4" />
                            Add Address
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-0 space-y-4">
                {displayList.length === 0 ? (
                    <div className="text-center text-white/40 py-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <MoreHorizontal className="w-8 h-8 text-white/20" />
                        </div>
                        <p>No contacts yet</p>
                    </div>
                ) : (
                    displayList.map((contact, idx) => {
                        const savedName = addressBook[contact.address];
                        const displayName = savedName || contact.name || truncateAddress(contact.address);
                        const displayInitials = (displayName.charAt(0) || "?").toUpperCase();

                        const isEditing = editingAddress === contact.address;
                        const isPinned = pinnedContacts?.includes(contact.address);
                        const isSelected = selectedAddress === contact.address;

                        return (
                            <div
                                key={contact.address}
                                className={`group p-5 rounded-3xl bg-[#111] border transition-all relative overflow-hidden
                                    ${isSelected ? 'border-[#6FBEE5] bg-[#1a1a1a]' : 'border-white/5 hover:border-white/10'}
                                `}
                                onClick={() => !isEditing && setSelectedAddress(contact.address)}
                            >
                                {isPinned && (
                                    <div className="absolute top-3 right-3 text-[#6FBEE5] opacity-100 transition-opacity z-10">
                                        <Pin className="w-4 h-4 fill-current rotate-45" />
                                    </div>
                                )}

                                {/* Interaction Overlay */}
                                {isSelected && (
                                    <div className="absolute inset-0 z-20 bg-[#111]/90 backdrop-blur-sm flex items-center justify-center gap-3 animate-in fade-in duration-200">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onSend(contact.address); setSelectedAddress(null); }}
                                            className="px-4 py-2 bg-[#6FBEE5] hover:bg-[#5DAED5] text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105"
                                        >
                                            <ArrowUpRight className="w-4 h-4" /> Send
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onRequest(contact.address); setSelectedAddress(null); }}
                                            className="px-4 py-2 bg-[#34D399] hover:bg-[#2BBF88] text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105"
                                        >
                                            <ArrowDownLeft className="w-4 h-4" /> Request
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedAddress(null); }}
                                            className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors absolute top-2 right-2"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                {/* Header: Avatar + Name + Txs */}
                                <div className="flex items-start justify-between mb-1">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-slate-950 relative
                                            ${idx === 0 ? 'bg-emerald-400' : idx === 1 ? 'bg-[#6FBEE5]' : 'bg-purple-400'}`}>
                                            {displayInitials}
                                        </div>
                                        <div>
                                            {isEditing ? (
                                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
                                                    className="group/name flex items-center gap-2 cursor-pointer relative z-10"
                                                    onDoubleClick={(e) => { e.stopPropagation(); handleStartEdit(contact); }}
                                                >
                                                    <h3 className="text-white font-bold text-lg leading-tight group-hover/name:text-blue-400 transition-colors" title="Double click to rename">
                                                        {displayName}
                                                    </h3>
                                                    <Pencil className="w-3 h-3 text-white/20 opacity-0 group-hover/name:opacity-100 transition-opacity" />
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 mt-0.5 relative z-10">
                                                <span className="text-white/40 text-xs font-mono">{truncateAddress(contact.address)}</span>
                                                <button className="text-white/20 hover:text-white transition-colors" onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(contact.address);
                                                    toast.success("Address copied");
                                                }}>
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end pt-1 pr-6 relative z-10">
                                        {/* Unpin button (only visible on hover for pinned items) */}
                                        {isPinned && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleUnpin(contact.address); }}
                                                className="text-white/20 hover:text-red-400 transition-colors p-1"
                                                title="Unpin contact"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                        {!isPinned && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); pinContact(contact.address); }}
                                                className="text-white/10 hover:text-[#6FBEE5] transition-colors p-1 opacity-0 group-hover:opacity-100"
                                                title="Pin contact"
                                            >
                                                <Pin className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="pl-[64px]">
                                    <span className="text-white/40 text-xs font-bold">{contact.txCount} transactions</span>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </Card>
    );
}
