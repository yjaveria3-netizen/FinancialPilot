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
    """Prompt for Tax Assistant accountant executive summary."""
    breakdown_lines = "\n".join(
        [f"  * {cat}: ${amt:,.2f}" for cat, amt in tax_summary.get("deductibles_breakdown", {}).items()]
    )
    deadlines_lines = "\n".join(
        [f"  * {dl.get('event')}: Due {dl.get('due_date')} ({dl.get('days_remaining')} days remaining)"
         for dl in tax_summary.get("filing_deadlines", [])[:4]]
    )
    return f"""
You are a senior Corporate Tax Director and CPA specializing in manufacturing, industrial supply chain, and garment-factory operations.
Review the following financial tax status report for the enterprise:

FINANCIAL POSITION:
- Gross Revenue YTD: ${tax_summary.get('revenue_ytd', 0):,.2f}
- Total Eligible Deductions: ${tax_summary.get('deductible_total', 0):,.2f}
- Net Taxable Operating Income: ${tax_summary.get('net_taxable_income', 0):,.2f}
- Estimated Total Tax Liability Due: ${tax_summary.get('estimated_tax_due', 0):,.2f}
- Prior Tax Withholdings / Remittances Paid: ${tax_summary.get('prior_tax_paid', 0):,.2f}
- Effective Corporate Tax Rate Provision: {tax_summary.get('effective_tax_rate', 26.0):.1f}%

DEDUCTIBLE EXPENSE BREAKDOWN:
{breakdown_lines}

UPCOMING COMPLIANCE DEADLINES:
{deadlines_lines}

Write a formal, comprehensive, 3-section Executive Tax Summary tailored specifically for the company's external CPA and internal accounting department:

1. EXECUTIVE SUMMARY & TAX LIABILITY POSTURE:
   Provide an executive-level synopsis of the business's current taxable operating posture, margin resilience, and net estimated tax liability due.

2. DEDUCTIBLE CLASSIFICATION & AUDIT READINESS:
   Analyze the deductible schedule (raw material COGS, direct manufacturing payroll, plant facility rent, utilities, and marketing). Note GAAP capitalization vs Section 162 ordinary expense considerations, inventory/fabric depreciation write-offs, and compliance recommendations.

3. UPCOMING FILING & REGULATORY COMPLIANCE ROADMAP:
   Outline exact priority steps to meet the upcoming quarterly and annual filing deadlines, verify payroll tax (Form 941) reconciliations, and ensure estimated tax safe harbor provisions are satisfied.

Tone: Authoritative, audit-ready, analytical, and structured with clear section headers. Do not use generic disclaimers.
"""
