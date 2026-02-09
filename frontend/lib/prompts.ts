/**
 * AI Insight Context Keys
 * Used for caching insights in localStorage
 */
export const HOME_PAGE_INSIGHTS = "home_page_insights";
export const HOME_PAGE_SUGGESTIONS = "home_page_suggestions";
export const INSIGHTS_PAGE_SUGGESTIONS = "insights_page_suggestions";

/**
 * Prompt Generators
 */

interface HomeContextData {
    balance: number;
    totalExpenses: number;
    expenseCategories: Array<{ name: string; amount: string | number }>;
    recentActivity: Array<{
        type: string;
        label: string;
        amount: number;
        time: string;
        gas_fee: string;
    }>;
    stakingApy?: number;
}

interface InsightsPageContextData {
    balance: number;
    netFlow: number;
    monthOverMonthChange: number;
    topExpenses: Array<{ name: string; value: number }>;
    stakingApy?: number;
}

/**
 * Generates the prompt for the Home page AI insight
 * Focus: Strategy for growth (e.g., staking) and risk reduction
 */
export const getHomeInsightsContextPrompt = (data: HomeContextData) => {
    const stakingInfo = data.stakingApy
        ? `Current Staking APY: ~${data.stakingApy.toFixed(2)}%`
        : "";

    return `
          Analyze my current financial snapshot to help me grow my balance and reduce risk:
          - Available Balance: $${data.balance.toLocaleString()}
          - Monthly Expenses: $${data.totalExpenses}
          - Expense Categories: ${data.expenseCategories.map(e => `${e.name} ($${e.amount})`).join(', ')}
          - Recent Activity: ${data.recentActivity.map(a => `${a.time}: ${a.label} of ${a.amount} SUI`).join('; ')}
          ${stakingInfo ? `- ${stakingInfo}` : ''}

          Provide a 1-sentence strategic insight. Focus on how I can increase my balance (e.g., suggestions for staking if APY is attractive or better capital efficiency) or reduce risk.
          Format: "Your current balance is [balance] SUI. Based on [analysis], we suggest [strategy to increase balance/reduce risk]. You could potentially [outcome]."
      `;
};

/**
 * Generates the prompt for the Home page AI suggestions
 * Focus: Actionable advice on spending, gas fees, and financial health
 */
export const getHomeSuggestionsContextPrompt = (data: HomeContextData) => {
    const stakingInfo = data.stakingApy
        ? `Current Staking APY: ~${data.stakingApy.toFixed(2)}%`
        : "";

    return `
          Analyze my financial snapshot below to provide 4 specific, actionable suggestions.
          Concentrate on identifying:
          1. Abusive or excessive spending in specific categories.
          2. High total gas fees if applicable.
          3. Opportunities for better financial health based on recent activity.
          4. Yield opportunities if balance allows (Use Staking APY: ${data.stakingApy ? data.stakingApy.toFixed(2) + '%' : 'Unknown'}).

          Financial Snapshot:
          - Available Balance: $${data.balance.toLocaleString()}
          - Total Monthly Expenses: $${data.totalExpenses}
          - Expense Categories: ${data.expenseCategories.map(e => `${e.name} ($${e.amount})`).join(', ')}
          - Recent Activity Detail: ${data.recentActivity.map(a => `${a.time}: ${a.label} (${a.amount} SUI), Gas: ${a.gas_fee}`).join('; ')}
          ${stakingInfo ? `- ${stakingInfo}` : ''}

          Return the suggestions as a JSON array of objects. Each object MUST have:
          - id: index number (1 to 4)
          - title: short descriptive title
          - description: 1-2 sentences of specific advice (e.g., "Your gas fees are high, try batching transactions")
          - icon: a single relevant emoji
          - risk: "high", "medium", or "low"

          IMPORTANT: Return ONLY the JSON array, nothing else.
      `;
};

/**
 * Generates the prompt for the Insights page AI suggestion
 * Focus: Cashflow analysis, staking opportunities, and financial health
 */
export const getInsightsPageContextPrompt = (data: InsightsPageContextData) => {
    const stakingInfo = data.stakingApy
        ? `Current Staking APY: ~${data.stakingApy.toFixed(2)}%`
        : "";

    return `
        Analyze my current financial status to provide a strategic recommendation.
        
        Financial Context:
        - Current Wallet Balance: ${data.balance.toLocaleString()} SUI
        - Net Cash Flow (this month): ${data.netFlow.toFixed(4)} SUI
        - Month-over-Month Change: ${data.monthOverMonthChange.toFixed(2)}%
        - Top Expenses: ${data.topExpenses.map(e => `${e.name} (${e.value})`).join(', ')}
        ${stakingInfo ? `- ${stakingInfo}` : ''}

        Task:
        Provide a specific, actionable suggestion to improve my financial position.
        Focus on:
        1. **Staking/DeFi**: If I have a significant balance, suggest staking or lending (e.g., "Stake your [amount] SUI to earn ~${data.stakingApy ? data.stakingApy.toFixed(2) : '6'}% APY").
        2. **Cash Flow**: If net flow is negative, suggest reducing specific top expenses.
        3. **Growth**: If net flow is positive, suggest reinvesting the surplus.

        Format your response as a JSON object with the following fields:
        - "highlightedText": A short, catchy phrase highlighting the opportunity (e.g., "Earn ${data.stakingApy ? data.stakingApy.toFixed(1) : '6.8'}% APY on Staking").
        - "body": A 1-2 sentence explanation of why this is a good move and how much I could potentially earn or save.

        IMPORTANT: Return ONLY the JSON object. Do not include markdown formatting or extra text.
    `;
};