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

// SUI amount formatter: up to 4 decimals, trims trailing zeros (11.0000 → 11)
export function formatSuiAmount(value: number, maxDecimals = 4): string {
  const formatted = value.toFixed(maxDecimals)
  return parseFloat(formatted).toString()
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

function safelyParseTimestamp(input: string | number | Date | null | undefined): number {
  if (!input) return Date.now();
  if (input instanceof Date) return input.getTime();

  const asNum = Number(input);
  if (!isNaN(asNum)) return asNum;

  const parsed = new Date(input).getTime();
  return isNaN(parsed) ? Date.now() : parsed;
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

  const status = node.effects?.status === "SUCCESS" ? "Completed" : "Failed";

  // 5. Calculate Gas Fee
  let gasFeeDisplay = "0 SUI";
  const gasSummary = node.effects?.gasEffects?.gasSummary;
  if (gasSummary) {
    const compCost = Number(gasSummary.computationCost || 0);
    const storageCost = Number(gasSummary.storageCost || 0);
    const storageRebate = Number(gasSummary.storageRebate || 0);
    const netGasFee = compCost + storageCost - storageRebate;
    gasFeeDisplay = `${mistToSui(Math.max(0, netGasFee)).toLocaleString("en-US", { maximumFractionDigits: 4 })} SUI`;
  }

  const timestampMs = safelyParseTimestamp(node.effects?.timestamp);

  return {
    id: node.digest,
    type,
    amount: Number(mistToSui(Math.abs(rawAmountMIST))),
    usd: "$0.00", // Need real price feed
    time: formatRelativeTime(timestampMs),
    timestampMs,
    // Only set 'from' if receiving (or explicit from), 'to' if sending
    from: type === "receive" ? counterpartyLabel : null,
    to: type === "send" ? counterpartyLabel : null,
    status,
    gas_fee: gasFeeDisplay,
  };
}

export function formatRelativeTime(dateInput: string | number | Date): string {
  const ms = safelyParseTimestamp(dateInput);
  const date = new Date(ms);

  if (isNaN(date.getTime())) return "Invalid Date";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);

  // Future check (clock skew)
  if (diffSecs < 0) return "Just now";

  if (diffSecs < 60) return `${diffSecs} sec${diffSecs !== 1 ? 's' : ''} ago`;

  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;

  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} hr${diffHrs !== 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

  return date.toLocaleString();
}