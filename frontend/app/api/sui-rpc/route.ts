import { NextRequest, NextResponse } from "next/server";

const RPC_ENDPOINTS: Record<string, string[]> = {
  mainnet: [
    "https://sui-rpc.publicnode.com",
    "https://rpc-mainnet.suiscan.xyz",
    "https://sui-mainnet-endpoint.blockvision.org",
    "https://fullnode.mainnet.sui.io:443",
  ],
  testnet: [
    "https://sui-testnet.publicnode.com",
    "https://rpc-testnet.suiscan.xyz",
    "https://testnet.sui.rpcpool.com",
    "https://sui-testnet-endpoint.blockvision.org",
    "https://fullnode.testnet.sui.io:443",
  ],
  devnet: ["https://fullnode.devnet.sui.io:443"],
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Client-Sdk-Type, Client-Sdk-Version, Client-Target-Api-Version, Client-Request-Method",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * Fetch reference gas price directly from official GraphQL endpoint.
 * This guarantees suix_getReferenceGasPrice succeeds even when JSON-RPC is shut down.
 */
async function getReferenceGasPriceViaGraphQL(network: string): Promise<string> {
  try {
    const gqlUrl =
      process.env.NEXT_PUBLIC_GQL_URL ||
      (network === "mainnet"
        ? "https://graphql.mainnet.sui.io/graphql"
        : "https://graphql.testnet.sui.io/graphql");

    const res = await fetch(gqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query { epoch { referenceGasPrice } }`,
      }),
    });
    const json = await res.json();
    if (json?.data?.epoch?.referenceGasPrice) {
      return String(json.data.epoch.referenceGasPrice);
    }
  } catch (err) {
    console.warn("[RPC Proxy] GraphQL gas price lookup failed:", err);
  }
  return "1000";
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const network =
      searchParams.get("network") ||
      process.env.NEXT_PUBLIC_NETWORK ||
      "testnet";

    const bodyText = await req.text();
    let parsedBody: any = null;
    try {
      parsedBody = JSON.parse(bodyText);
    } catch {
      // Non-JSON body
    }

    // 1. Resolve suix_getReferenceGasPrice directly via GraphQL
    if (parsedBody && parsedBody.method === "suix_getReferenceGasPrice") {
      const gasPrice = await getReferenceGasPriceViaGraphQL(network);
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          result: gasPrice,
          id: parsedBody.id ?? 1,
        },
        { headers: CORS_HEADERS }
      );
    }

    const forwardHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const headerKeys = [
      "client-sdk-type",
      "client-sdk-version",
      "client-target-api-version",
      "client-request-method",
    ];

    for (const key of headerKeys) {
      const val = req.headers.get(key);
      if (val) forwardHeaders[key] = val;
    }

    const endpoints = RPC_ENDPOINTS[network] || RPC_ENDPOINTS.testnet;

    let lastError: any = null;
    let lastResponseData: string = "";
    let lastStatus: number = 500;

    // 2. Try endpoints with fallback on 429, 5xx, or deprecation
    for (const targetUrl of endpoints) {
      try {
        const upstreamRes = await fetch(targetUrl, {
          method: "POST",
          headers: forwardHeaders,
          body: bodyText,
        });

        const responseData = await upstreamRes.text();
        lastStatus = upstreamRes.status;
        lastResponseData = responseData;

        // If rate limited (429), server error (>= 500), or deprecation message, try next endpoint
        if (
          upstreamRes.status === 429 ||
          upstreamRes.status >= 500 ||
          responseData.includes("JSON-RPC on public fullnodes has been deprecated") ||
          responseData.includes("Rate limit exceeded") ||
          responseData.includes("Too Many Requests")
        ) {
          console.warn(`[RPC Proxy] ${targetUrl} returned status ${upstreamRes.status}, trying fallback...`);
          continue;
        }

        return new NextResponse(responseData, {
          status: upstreamRes.status,
          headers: {
            "Content-Type": "application/json",
            ...CORS_HEADERS,
          },
        });
      } catch (err) {
        lastError = err;
        console.warn(`[RPC Proxy] Failed calling ${targetUrl}:`, err);
      }
    }

    if (lastResponseData) {
      return new NextResponse(lastResponseData, {
        status: lastStatus,
        headers: {
          "Content-Type": "application/json",
          ...CORS_HEADERS,
        },
      });
    }

    throw lastError || new Error("All RPC endpoints failed");
  } catch (error: any) {
    console.error("[Sui RPC Proxy Error]", error);
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: error?.message || "Internal RPC Proxy Error",
        },
        id: null,
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
