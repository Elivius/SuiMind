"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { networkConfig } from "@/lib/network";
import { useRegisterEnokiWallets } from "@/hooks/useRegisterEnokiWallets";

const queryClient = new QueryClient();

interface ProvidersProps {
    children: React.ReactNode;
}

/**
 * Minimal wrapper component to call the Enoki registration hook.
 * Hooks can only be called inside components, so we need this wrapper.
 */
function EnokiWalletRegistration() {
    useRegisterEnokiWallets();
    return null;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork={process.env.NEXT_PUBLIC_NETWORK as "devnet" | "mainnet" | "testnet" | undefined}>
                <EnokiWalletRegistration />
                <WalletProvider autoConnect>
                    {children}
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
}