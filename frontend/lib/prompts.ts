/**
 * AI Insight Context Keys
 * Used for caching insights in localStorage
 */
export const HOME_PAGE_INSIGHTS = "home_page_insights";
export const HOME_PAGE_SUGGESTIONS = "home_page_suggestions";

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
}

/**
 * Generates the prompt for the Home page AI insight
 * Focus: Strategy for growth (e.g., staking) and risk reduction
 */
export const getHomeInsightsContextPrompt = (data: HomeContextData) => {
    return `
          Analyze my current financial snapshot to help me grow my balance and reduce risk:
          - Available Balance: $${data.balance.toLocaleString()}
          - Monthly Expenses: $${data.totalExpenses}
          - Expense Categories: ${data.expenseCategories.map(e => `${e.name} ($${e.amount})`).join(', ')}
          - Recent Activity: ${data.recentActivity.map(a => `${a.time}: ${a.label} of ${a.amount} SUI`).join('; ')}

          Provide a 1-sentence strategic insight. Focus on how I can increase my balance (e.g., suggestions for staking or better capital efficiency) or reduce risk.
          Format: "Your current balance is [balance] SUI. Based on [analysis], we suggest [strategy to increase balance/reduce risk]. You could potentially [outcome]."
      `;
};

/**
 * Generates the prompt for the Home page AI suggestions
 * Focus: Actionable advice on spending, gas fees, and financial health
 */
export const getHomeSuggestionsContextPrompt = (data: HomeContextData) => {
    return `
          Analyze my financial snapshot below to provide 4 specific, actionable suggestions.
          Concentrate on identifying:
          1. Abusive or excessive spending in specific categories.
          2. High total gas fees if applicable.
          3. Opportunities for better financial health based on recent activity.

          Financial Snapshot:
          - Available Balance: $${data.balance.toLocaleString()}
          - Total Monthly Expenses: $${data.totalExpenses}
          - Expense Categories: ${data.expenseCategories.map(e => `${e.name} ($${e.amount})`).join(', ')}
          - Recent Activity Detail: ${data.recentActivity.map(a => `${a.time}: ${a.label} (${a.amount} SUI), Gas: ${a.gas_fee}`).join('; ')}

          Return the suggestions as a JSON array of objects. Each object MUST have:
          - id: index number (1 to 4)
          - title: short descriptive title
          - description: 1-2 sentences of specific advice (e.g., "Your gas fees are high, try batching transactions")
          - icon: a single relevant emoji
          - priority: "high", "medium", or "low"

          IMPORTANT: Return ONLY the JSON array, nothing else.
      `;
};
