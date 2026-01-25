# 📑 Project Specification: SuiMind

**Subtitle:** The World’s First Proactive DeFAI Financial Agent  
**Version:** 2.0 (Integrated Security & Intelligence)  
**Target Platform:** Sui Network (Mainnet)  
**Core Engine:** Google Gemini 2.0 Flash + CertiK/AML Security APIs

## 1. Product Vision & Market Strategy (PM Perspective)

### 1.1 The Mission
To demystify the blockchain by providing a Proactive Financial Co-pilot that transforms complex on-chain "objects" into human-centric intelligence. We are moving from the era of "reading balances" to the era of "Intent-Based Finance."

### 1.2 The "Sui Opportunity"
Unlike Ethereum’s account-based model, Sui’s Object-Centric Model allows assets to have rich, on-chain metadata. SuiMind leverages this by using Gemini 2.0 Flash to interpret these objects—tracking their history, parent-child relationships, and value—providing a level of detail generic trackers cannot match.

### 1.3 Strategic Objectives
*   **Accessibility:** Onboard users via zkLogin (Google/Twitch) so they never see a seed phrase.
*   **Security:** Reduce wallet drains by 90% through real-time AI simulation and AML screening.
*   **Capital Efficiency:** Automatically identify idle assets and suggest high-yield shifts in real-time.

## 2. Functional Requirements (The "What")

### 2.1 AI-Powered Semantic Layer
*   **[FR-1] Semantic Transaction Parsing:**
    *   *Logic:* Translates raw SuiTransactionBlockResponse into plain language.
    *   *Example:* "You swapped 100 SUI for 150 USDC on Cetus (Saved $0.50 via optimized routing)."
*   **[FR-2] Natural Language CFO (Chat):**
    *   *Requirement:* A chat interface for queries like "How much gas did I spend on NFTs this week?" or "Am I at risk of liquidation on Scallop?"

### 2.2 Proactive Agentic & Security Features
*   **[FR-3] Proactive Risk Guard (Simulation):**
    *   *Requirement:* A "Dry-Run" simulation showing what leaves and enters the wallet before signing.
*   **[FR-4] Yield Optimization Engine:**
    *   *Requirement:* Real-time scanning of Sui protocols (Navi, Scallop, etc.) to alert users of better interest rates.
*   **[FR-5] High-Risk & AML Screening (The Protection Layer):**
    *   *Requirement:* Before any transaction, SuiMind must scan the Target Address and Contract using security APIs (e.g., CertiK SkyInsights or Chainalysis).
    *   *Functionality:* Detect if an address is associated with Money Laundering (AML), known hacks, sanctioned entities, or unverified "Rugpull" contracts.

## 3. UI/UX Design Specification (Designer Perspective)

### 3.1 Design Language: "The Flow"
The UI moves away from "Bank App" density toward an "Assistant" feel.
*   **Visual Style:** Glassmorphism—semi-transparent cards with "Sui Blue" (#001B39 to #6FBEE5) gradients.
*   **Typography:** Plus Jakarta Sans for modern, professional readability.

### 3.2 Key UI Components
| Component | Interaction Detail |
| :--- | :--- |
| **The Universal Command Bar** | A floating central bar for text/voice commands (e.g., "Send 10 SUI to Elivius"). |
| **The Security Shield** | A 3D animated icon that pulses Red for high AML risk and Green for verified entities. |
| **The Simulation Overlay** | A bottom-sheet that appears before signing, providing a human translation of the risk. |

## 4. Technical Architecture (Developer Perspective)

### 4.1 The Security Data Pipeline

$$Intent \rightarrow [Scan: AML/CertiK] \rightarrow [Simulate: Sui RPC] \rightarrow [Reason: Gemini 2.0] \rightarrow UI$$

*   **Identity:** User logs in via zkLogin.
*   **Screening:** The middleware calls CertiK SkyInsights API to get a risk score (0-100) for the target address.
*   **Context Preparation:** Formats the risk score + raw transaction JSON into a "Context Packet."
*   **Inference:** Gemini 2.0 Flash generates a summary: "Warning: This address is linked to a recent exploit. Signing will likely result in total loss."

### 4.2 Tech Stack
*   **Frontend:** Next.js (App Router), Tailwind CSS v4, Framer Motion.
*   **Sui Integration:** @mysten/sui.js for on-chain data.
*   **AI Engine:** Google Gemini 2.0 Flash (Bidirectional streaming for low latency).
*   **Security Feeds:** CertiK SkyInsights (Audit/Risk) + AML Bot (Compliance).

## 5. Why SuiMind is "Outstanding"
*   **The "Safety Wall":** While other wallets allow you to send money to a scammer, SuiMind stops you by searching CertiK databases automatically.
*   **Speed of Thought:** Using Gemini 2.0 Flash ensures the "Security Report" is ready in <1 second, fitting perfectly into the transaction flow.
*   **No Knowledge Barrier:** It feels like using a messaging app, making DeFi accessible to everyone from software engineers to retail beginners.