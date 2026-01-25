import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GQL_SUI_COIN_TYPE, MIST_PER_SUI } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// MIST to SUI conversion factor
export function mistToSui(mist: number | string | undefined | null): number {
  if (!mist) return 0;
  return Number(mist) / MIST_PER_SUI;
}

/**
 * Truncates a wallet/blockchain address for display
 * @example truncateAddress("0x7b62d94a0b62c5c37c7b62d94a0b62c57c75") => "0x7b62...7c75"
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4) {
  if (!address) return ""
  if (address.length <= startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

// ---- Process Transaction Helpers ----

export function calculateTxDisplay(rawAmountMist: number) {
  const rawAmountAbs = Math.abs(rawAmountMist);
  const amountInSui = mistToSui(rawAmountAbs).toLocaleString("en-US", { maximumFractionDigits: 4 });
  const isNegative = rawAmountMist < 0;
  return `${isNegative ? "-" : "+"}${amountInSui} SUI`;
}

export function getTransactionType(rawAmountMist: number) {
  if (rawAmountMist < 0) return "send";
  if (rawAmountMist > 0) return "receive";
  return "interaction";
}

export function findCounterparty(balanceChanges: any[], myAddress: string | undefined, type: string) {
  const otherPartyChange = balanceChanges.find((balanceChangesJson: any) =>
    (balanceChangesJson.coinType === GQL_SUI_COIN_TYPE) &&
    (balanceChangesJson.address !== myAddress)
  );

  let counterparty = "Unknown";
  if (otherPartyChange) {
    if (type === "send" && Number(otherPartyChange.amount) > 0) {
      counterparty = otherPartyChange.address;
    }
    else if (type === "receive" && Number(otherPartyChange.amount) < 0) {
      counterparty = otherPartyChange.address;
    }
  }
  return counterparty;
}

export function processTx(node: any, address?: string) {
  // 1. Extract Balance Changes
  const balanceChanges = node.effects?.balanceChangesJson ?? []

  // 2. Find SUI Change for THIS user
  const myChange = balanceChanges.find((balanceChangesJson: any) =>
    (balanceChangesJson.coinType === GQL_SUI_COIN_TYPE) &&
    (balanceChangesJson.address === address)
  );

  if (!myChange) return null;

  // 3. Calculate Amount & Type
  const rawAmountMIST = Number(myChange.amount);
  const amountDisplay = calculateTxDisplay(rawAmountMIST);
  const type = getTransactionType(rawAmountMIST);

  // 4. Find Counterparty
  const counterparty = findCounterparty(balanceChanges, address, type);
  const counterpartyLabel = truncateAddress(counterparty);

  return {
    id: node.digest,
    type,
    amount: amountDisplay,
    usd: "$0.00", // Need real price feed
    time: node.effects?.timestamp ? new Date(node.effects.timestamp).toLocaleString() : "Just now",
    // Only set 'from' if receiving (or explicit from), 'to' if sending
    from: type === "receive" ? counterpartyLabel : null,
    to: type === "send" ? counterpartyLabel : null,
  };
};