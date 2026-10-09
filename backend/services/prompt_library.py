"""
FinPilot Prompt Library
Centralized, versioned prompts for all Gemini calls.
Both members add prompts here — never inline in module files.
"""


def cash_forecast_prompt(days: int, forecast_summary: dict) -> str:
    """Prompt for Cash Flow Forecaster executive explanation."""
    return f"""
You are an expert financial advisor. A small business owner is reviewing their 30-day cash flow forecast.

Forecast Summary:
- Forecast horizon: {days} days
- Starting cash balance: ${forecast_summary.get('starting_cash', 0):,.2f}
- Projected total income: ${forecast_summary.get('projected_income', 0):,.2f}
- Projected total expenses: ${forecast_summary.get('projected_expenses', 0):,.2f}
- Projected ending balance: ${forecast_summary.get('ending_balance', 0):,.2f}
- Days until cash runs low (below $5,000): {forecast_summary.get('days_to_low_cash', 'N/A')}
- Pending unpaid invoices: ${forecast_summary.get('pending_invoices', 0):,.2f}

Please write a concise (3-4 sentence) executive summary of the cash flow situation, highlighting:
1. Whether the business is in a healthy or risky cash position.
2. The single most important action the owner should take this week.
3. Any red flags visible in the numbers.

Keep the tone professional but easy to understand for a non-financial audience. Do not use bullet points.
"""


def credit_score_prompt(score: int, factors: dict) -> str:
    """Prompt for Credit Readiness Score improvement advice."""
    return f"""
You are a business credit specialist advising a small business owner.

Their FinPilot Credit Readiness Score is: {score}/100

Score breakdown:
- Revenue Consistency Score: {factors.get('revenue_consistency', 0)}/30
- Profit Margin Score: {factors.get('profit_margin', 0)}/25
- Invoice Payment Behavior Score: {factors.get('payment_behavior', 0)}/25
- Expense Control Score: {factors.get('expense_control', 0)}/20

Provide exactly 3 specific, actionable tips to improve their credit readiness score.
Format each tip as a single sentence starting with an action verb.
Focus on what they can realistically do in the next 90 days.
Do not repeat the scores back; focus entirely on advice.
"""


def anomaly_guard_prompt(anomalies: list) -> str:
    """Prompt for Anomaly Guard alert explanation."""
    anomaly_text = "\n".join(
        [f"- {a.get('date', 'N/A')}: {a.get('description', 'Unknown anomaly')} (Amount: ${a.get('amount', 0):,.2f})"
         for a in anomalies[:10]]
    )
    return f"""
You are a financial fraud analyst. Review the following flagged transactions from a small business ledger:

{anomaly_text}

For each anomaly, briefly explain in one sentence why it was flagged and what the business owner should do. 
Respond in plain language without technical jargon.
"""


def tax_assistant_prompt(tax_summary: dict) -> str:
    """Prompt for Tax Assistant advisory."""
    return f"""
You are a US small business tax advisor. Based on the following financial data:

- Total Revenue YTD: ${tax_summary.get('revenue_ytd', 0):,.2f}
- Total Expenses YTD: ${tax_summary.get('expenses_ytd', 0):,.2f}
- Estimated Net Profit: ${tax_summary.get('net_profit', 0):,.2f}
- Estimated Tax Rate (Self-Employment + Income): 30%
- Estimated Tax Liability: ${tax_summary.get('estimated_tax', 0):,.2f}

Provide 2-3 short, practical tax optimization tips the business owner can use before year end.
Do not give specific legal advice — frame as general guidance.
"""
