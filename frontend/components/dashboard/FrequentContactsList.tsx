"use client";

import { Card } from "@/components/ui";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, MoreHorizontal, Copy, ExternalLink, Pin, Pencil, Check, X, UserPlus, Star } from "lucide-react";
import { formatSuiAmount, truncateAddress } from "@/lib/utils";
import type { FrequentContact } from "@/types/insights";
import { useState, useRef, useEffect } from "react";
import { useAddressBook } from "@/hooks";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface Props {
    contacts: FrequentContact[];
    onSend: (address: string) => void;
    onRequest: (address: string) => void;
}

export function FrequentContactsList({ contacts, onSend, onRequest }: Props) {
    const { contacts: addressBook, pinnedContacts, updateContactName, pinContact, unpinContact } = useAddressBook();
    const [editingAddress, setEditingAddress] = useState<string | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [newPinAddress, setNewPinAddress] = useState("");
    const [inputError, setInputError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const addInputRef = useRef<HTMLInputElement>(null);
    const justFinishedEditing = useRef(false);

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
        } catch (error) {
            toast.error("Failed to update contact name");
        } finally {
            setEditingAddress(null);
            justFinishedEditing.current = true;
            setTimeout(() => {
                justFinishedEditing.current = false;
            }, 100);
        }
    };

    const handleCancelEdit = () => {
        setEditingAddress(null);
        setEditName("");
        justFinishedEditing.current = true;
        setTimeout(() => {
            justFinishedEditing.current = false;
        }, 100);
    };

    const handleAddPin = async () => {
        if (!newPinAddress.trim()) return;
        if (!newPinAddress.startsWith("0x")) {
            setInputError(true);
            setTimeout(() => setInputError(false), 2000);
            return;
        }
        try {
            await pinContact(newPinAddress.trim());
            setNewPinAddress("");
            setIsAddingMode(false);
        } catch (error) {
            toast.error("Failed to pin contact");
        }
    };

    const handleUnpin = async (address: string) => {
        try {
            await unpinContact(address);
        } catch (error) {
            toast.error("Failed to unpin contact");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSaveEdit();
        else if (e.key === 'Escape') handleCancelEdit();
    };

    const handleAddKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAddPin();
        else if (e.key === 'Escape') {
            setIsAddingMode(false);
            setNewPinAddress("");
        }
    };

    const pinnedList = (pinnedContacts || []).map(address => {
        const existingData = contacts.find(c => c.address === address);
        if (existingData) return { ...existingData, isPinned: true };
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
    const displayList = [...pinnedList, ...unpinnedList].slice(0, 5);

    return (
        <Card className="border-white/20 backdrop-blur-xl bg-white/5 lg:h-[70vh] flex flex-col overflow-hidden">
            {/* Header section with glassmorphism accent */}
            <div className="p-6 pb-2 flex-shrink-0 relative">


                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-white">Frequent Contact</h2>

                    </div>

                    <div className="flex items-center gap-3 h-12">
                        <AnimatePresence mode="wait">
                            {isAddingMode ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        ref={addInputRef}
                                        value={newPinAddress}
                                        onChange={(e) => { setNewPinAddress(e.target.value); setInputError(false); }}
                                        onKeyDown={handleAddKeyDown}
                                        placeholder="Paste address (0x...)"
                                        className={`bg-[#0A0A0B] border rounded-2xl px-4 py-2.5 text-white text-sm w-[220px] focus:outline-none transition-all placeholder:text-white/10 ${inputError ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse" : "border-white/10 focus:border-[#6FBEE5]/50"}`}
                                    />
                                    <button
                                        onClick={handleAddPin}
                                        className="p-2.5 bg-[#6FBEE5] text-white rounded-xl shadow-[0_0_15px_rgba(111,190,229,0.3)] hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => { setIsAddingMode(false); setNewPinAddress(""); }}
                                        className="p-2.5 bg-white/5 hover:bg-white/10 text-white/50 rounded-xl transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsAddingMode(true)}
                                    className="px-5 py-2.5 rounded-2xl bg-[#6FBEE5]/10 border border-[#6FBEE5]/20 text-[#6FBEE5] hover:bg-[#6FBEE5]/20 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#6FBEE5]/5"
                                >
                                    <Pin className="w-4 h-4" />
                                    Add Address
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* List section */}
            <div className="flex-1 overflow-hidden px-6 pb-6 space-y-2">
                {displayList.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10">
                        <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-6">
                            <Star className="w-10 h-10 text-white/10" />
                        </div>
                        <h3 className="text-white/60 font-bold uppercase tracking-widest text-sm">No contacts captured</h3>
                        <p className="text-white/20 text-xs mt-2 max-w-[200px]">Recent interactions or pinned addresses will appear here.</p>
                    </div>
                ) : (
                    displayList.map((contact, idx) => {
                        const savedName = addressBook[contact.address];
                        const displayName = savedName || contact.name || truncateAddress(contact.address);
                        const displayInitials = (displayName.charAt(0) || "?").toUpperCase();

                        const isEditing = editingAddress === contact.address;
                        const isPinned = pinnedContacts?.includes(contact.address);
                        const isSelected = selectedAddress === contact.address;

                        // Vibrant color palettes for avatars
                        const palettes = [
                            "bg-gradient-to-br from-[#6FBEE5] to-[#3B82F6] text-white",
                            "bg-gradient-to-br from-[#34D399] to-[#059669] text-white",
                            "bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-white",
                            "bg-gradient-to-br from-[#F472B6] to-[#DB2777] text-white",
                            "bg-gradient-to-br from-[#FBBF24] to-[#D97706] text-white"
                        ];
                        const palette = palettes[idx % palettes.length];

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={contact.address}
                                className={`group relative p-4 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer
                                    ${isSelected
                                        ? 'bg-[#0A0A0B] border-transparent'
                                        : 'bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]'}
                                `}
                                onClick={(e) => {
                                    if (isEditing || justFinishedEditing.current) return;
                                    setSelectedAddress(isSelected ? null : contact.address);
                                }}
                            >
                                {/* Quick interactions on click */}
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
                                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                            className="absolute inset-2 z-20 bg-[#0A0A0B] flex items-center justify-center gap-4 pl-12 pr-16"
                                        >
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onSend(contact.address); setSelectedAddress(null); }}
                                                className="flex-1 h-14 bg-[#6FBEE5] hover:bg-[#5DAED5] text-white rounded-[1.2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transform transition-all hover:scale-[1.03] active:scale-95"
                                            >
                                                <ArrowUpRight className="w-4 h-4" /> Send
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onRequest(contact.address); setSelectedAddress(null); }}
                                                className="flex-1 h-14 bg-[#34D399] hover:bg-[#2BBF88] text-white rounded-[1.2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transform transition-all hover:scale-[1.03] active:scale-95"
                                            >
                                                <ArrowDownLeft className="w-4 h-4" /> Request
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedAddress(null); }}
                                                className="p-3 hover:bg-white/10 rounded-full text-white/30 hover:text-white transition-colors absolute top-2 right-2"
                                            >
                                                <X className="w-6 h-6 text-white" />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex items-center justify-between pointer-events-none group-data-[editing=true]:pointer-events-auto">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black shadow-lg shadow-black/20 shrink-0 relative ${palette}`}>
                                            {displayInitials}
                                            {isPinned && (
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0A0A0B] border border-white/10 rounded-full flex items-center justify-center">
                                                    <Pin className="w-3 h-3 text-[#6FBEE5] fill-current rotate-45" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            {isEditing ? (
                                                <div className="flex items-center gap-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        ref={inputRef}
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        onKeyDown={handleKeyDown}
                                                        className="bg-white/10 border border-[#6FBEE5]/50 rounded-xl px-3 py-1.5 text-white font-black text-lg w-[180px] focus:outline-none"
                                                        onBlur={handleSaveEdit}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <div
                                                        className="flex items-center gap-2 pointer-events-auto"
                                                        onDoubleClick={(e) => { e.stopPropagation(); handleStartEdit(contact); }}
                                                    >
                                                        <h3 className="text-white font-black text-lg tracking-tight truncate leading-tight group-hover:text-[#6FBEE5] transition-colors">
                                                            {displayName}
                                                        </h3>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleStartEdit(contact); }}
                                                            className="p-1 opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity"
                                                        >
                                                            <Pencil className="w-3 h-3 text-white" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-2 pointer-events-auto">
                                                        <span className="text-white/50 text-xs font-black uppercase tracking-widest group-hover:text-white transition-colors">{truncateAddress(contact.address)}</span>
                                                        <button
                                                            className="text-white/30 hover:text-white transition-colors p-1.5 bg-white/5 hover:bg-white/10 rounded-lg ml-1"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(contact.address);
                                                                setCopiedAddress(contact.address);
                                                                setTimeout(() => setCopiedAddress(null), 2000);
                                                            }}
                                                        >
                                                            {copiedAddress === contact.address ? (
                                                                <Check className="w-4 h-4 text-emerald-400" />
                                                            ) : (
                                                                <Copy className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end shrink-0 pointer-events-auto">
                                        <div className="flex items-center gap-3">
                                            {isPinned ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleUnpin(contact.address); }}
                                                    className="p-2 bg-[#6FBEE5]/10 hover:bg-red-500/20 text-[#6FBEE5] hover:text-red-400 rounded-xl transition-all"
                                                    title="Unpin"
                                                >
                                                    <Pin className="w-4 h-4 fill-current rotate-45" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); pinContact(contact.address); }}
                                                    className="p-2 hover:bg-[#6FBEE5]/20 text-white/5 group-hover:text-[#6FBEE5]/40 hover:text-[#6FBEE5] rounded-xl transition-all"
                                                    title="Pin"
                                                >
                                                    <Pin className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="mt-2 text-right">
                                            <p className="text-white font-black text-sm">
                                                {contact.txCount} <span className="text-white/50 font-black uppercase text-[10px] tracking-widest">Transactions</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Background design element */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />
                            </motion.div>
                        );
                    })
                )}
            </div>


        </Card>
    );
}
