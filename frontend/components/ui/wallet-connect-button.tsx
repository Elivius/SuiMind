"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    useConnectWallet,
    useCurrentAccount,
    useDisconnectWallet,
    useWallets,
} from "@mysten/dapp-kit";
import { isEnokiWallet } from "@mysten/enoki";
import { Wallet, ChevronDown, LogOut, Copy, Check } from "lucide-react";
import { truncateAddress } from "@/lib/utils";

export function WalletConnectButton() {
    const currentAccount = useCurrentAccount();
    const { mutate: connect, isPending } = useConnectWallet();
    const { mutate: disconnect } = useDisconnectWallet();
    const wallets = useWallets().filter((wallet) => !isEnokiWallet(wallet));
    const router = useRouter();

    const [showWalletList, setShowWalletList] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const walletListRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                setShowAccountMenu(false);
            }
            if (walletListRef.current && !walletListRef.current.contains(event.target as Node)) {
                setShowWalletList(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleConnect = (wallet: (typeof wallets)[number]) => {
        connect(
            { wallet },
            {
                onSuccess: () => setShowWalletList(false),
            }
        );
    };

    const handleCopyAddress = () => {
        if (currentAccount?.address) {
            navigator.clipboard.writeText(currentAccount.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Disconnecting state - show loading
    if (isDisconnecting) {
        return (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm text-gray-400 font-medium rounded-lg border border-gray-700">
                <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                <span className="text-sm">Disconnecting...</span>
            </div>
        );
    }

    // Connected state - show account info
    if (currentAccount) {
        return (
            <div className="relative" ref={accountMenuRef}>
                <button
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm text-white font-medium rounded-lg border border-gray-700 hover:border-cyan-500/50 hover:bg-gray-700/80 transition-all duration-200"
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-sm">{truncateAddress(currentAccount.address)}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Account dropdown */}
                {showAccountMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="p-3 border-b border-gray-700">
                            <p className="text-xs text-gray-400 mb-1">Connected</p>
                            <p className="text-sm text-white font-mono">
                                {truncateAddress(currentAccount.address)}
                            </p>
                        </div>
                        <div className="p-1">
                            <button
                                onClick={handleCopyAddress}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-emerald-400" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                                {copied ? "Copied!" : "Copy Address"}
                            </button>
                            <button
                                onClick={() => {
                                    setIsDisconnecting(true);
                                    setShowAccountMenu(false);
                                    disconnect();
                                    router.push("/login");
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Disconnect
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Not connected - show connect button
    return (
        <div className="relative w-full" ref={walletListRef}>
            <button
                onClick={() => setShowWalletList(!showWalletList)}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-3 py-4 sm:py-5 px-6 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-bold text-base sm:text-lg rounded-2xl shadow-lg shadow-[#9945FF]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>{isPending ? "Connecting..." : "Connect Sui Wallet"}</span>
            </button>

            {/* Wallet selection dropdown */}
            {showWalletList && !isPending && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">Select Wallet</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Connect with one of your installed wallets
                        </p>
                    </div>
                    <div className="p-2 max-h-64 overflow-y-auto">
                        {wallets.length > 0 ? (
                            wallets.map((wallet) => (
                                <button
                                    key={wallet.name}
                                    onClick={() => handleConnect(wallet)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-white hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    {wallet.icon ? (
                                        <img
                                            src={wallet.icon}
                                            alt={wallet.name}
                                            className="w-8 h-8 rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center">
                                            <Wallet className="w-4 h-4 text-gray-400" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium">{wallet.name}</span>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-400">No wallets detected</p>
                                <a
                                    href="https://suiwallet.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-cyan-400 hover:underline mt-1 inline-block"
                                >
                                    Install Sui Wallet →
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}