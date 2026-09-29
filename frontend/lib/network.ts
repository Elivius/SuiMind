import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

function getRpcUrl(network: "devnet" | "testnet" | "mainnet") {
  // In the browser, route through the same-origin Next.js proxy to eliminate CORS errors
  if (typeof window !== "undefined") {
    return `/api/sui-rpc?network=${network}`;
  }
  // During SSR or Node environments, fallback to the fullnode URL directly
  return getFullnodeUrl(network);
}

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getRpcUrl("devnet"),
    //   variables: {
    //     packageId: DEVNET_PACKAGE_ID,
    //   },
    },
    testnet: {
      url: getRpcUrl("testnet"),
    //   variables: {
    //     packageId: TESTNET_PACKAGE_ID,
    //   },
    },
    mainnet: {
      url: getRpcUrl("mainnet"),
    //   variables: {
    //     packageId: MAINNET_PACKAGE_ID,
    //   },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };