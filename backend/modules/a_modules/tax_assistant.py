"""
FinPilot — Member A Module: Tax and Compliance Assistant

Calculates estimated tax liability based on garment-factory business logic,
aggregates deductible operational expenses, compiles regulatory filing deadlines
with live countdowns, and generates an audit-ready Gemini AI executive summary for accountants.

FUNCTION CONTRACT:
  calculate_tax_estimates() -> dict
    Output: Pure Python dict (JSON-serializable) containing:
            - 'estimated_tax_due': float
            - 'deductible_total':   float
            - 'filing_deadlines':   list of {event, due_date, days_remaining, urgency, ...}
            - 'accountant_summary': str (Gemini AI output or CPA memorandum)
            - Additional breakdown metrics for UI:
              'revenue_ytd', 'net_taxable_income', 'prior_tax_paid',
              'corporate_tax', 'sales_tax', 'effective_tax_rate',
              'deductibles_breakdown'

UI RULE: Pure Python and Pandas. No UI framework imports.
"""
from pathlib import Path
from datetime import datetime, date, timedelta
import pandas as pd
import numpy as np

from backend.services.gemini_wrapper import ask_gemini
from backend.services.prompt_library import tax_assistant_prompt

DATA_DIR = Path(__file__).parents[2] / "data"


def _load_transactions() -> pd.DataFrame:
    path = DATA_DIR / "transactions.csv"
    if not path.exists():
        raise FileNotFoundError(f"Required CSV not found: {path}")
    df = pd.read_csv(path, parse_dates=["date"])
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
    return df


def _build_filing_deadlines(ref_date: date) -> list[dict]:
    """
    Constructs upcoming IRS and state regulatory tax deadlines with dynamic countdowns
    tailored to a garment manufacturing enterprise.
    """
    current_year = ref_date.year

    # Candidate regulatory deadlines
    raw_schedule = [
        {
            "id": "DL-FED-01",
            "event": "Q4 Corporate Estimated Tax Installment",
            "form": "IRS Form 1120-W",
            "category": "Federal Income Tax",
            "target_month": 12,
            "target_day": 15,
            "description": "Final quarterly corporate income tax prepayment to satisfy IRS safe-harbor rules.",
        },
        {
            "id": "DL-ST-02",
            "event": "State Sales & Use Tax Monthly Remittance",
            "form": "State Form ST-100",
            "category": "State & Local Tax",
            "target_month": ((ref_date.month % 12) + 1),
            "target_day": 20,
            "description": "Monthly sales tax reconciliation on taxable finished garments and retail distribution.",
        },
        {
            "id": "DL-PAY-03",
            "event": "Quarterly Federal Payroll & Labor Tax Return",
            "form": "IRS Form 941",
            "category": "Payroll & Labor",
            "target_month": 1,
            "target_day": 31,
            "description": "Quarterly withholding and FICA employer matching for sewing operators & factory staff.",
        },
        {
            "id": "DL-W2-04",
            "event": "Annual Wage & Contractor Reporting",
            "form": "Forms W-2 & 1099-NEC",
            "category": "Annual Information",
            "target_month": 1,
            "target_day": 31,
            "description": "Filing deadline for textile contractors, patternmakers, and salaried personnel.",
        },
        {
            "id": "DL-ANN-05",
            "event": "Annual Corporate Income Tax Return (COGS Schedule A)",
            "form": "IRS Form 1120",
            "category": "Federal Corporate Tax",
            "target_month": 3,
            "target_day": 15,
            "description": "Comprehensive annual return detailing manufacturing cost of goods sold (COGS) and inventory capitalization.",
        },
    ]

    deadlines = []
    for item in raw_schedule:
        # Determine year: if target date has passed in ref_date's year, roll over to next year
        target_year = current_year
        try:
            target_date = date(target_year, item["target_month"], item["target_day"])
        except ValueError:
            target_date = date(target_year, item["target_month"], 28)

        if target_date <= ref_date:
            target_year += 1
            try:
                target_date = date(target_year, item["target_month"], item["target_day"])
            except ValueError:
                target_date = date(target_year, item["target_month"], 28)

        days_remaining = (target_date - ref_date).days

        urgency = "Urgent" if days_remaining <= 30 else "Approaching" if days_remaining <= 60 else "Scheduled"

        deadlines.append({
            "id": item["id"],
            "event": item["event"],
            "form": item["form"],
            "category": item["category"],
            "due_date": target_date.strftime("%Y-%m-%d"),
            "days_remaining": days_remaining,
            "urgency": urgency,
            "description": item["description"],
        })

    # Sort deadlines by closest upcoming due date
    deadlines.sort(key=lambda d: d["days_remaining"])
    return deadlines


def calculate_tax_estimates() -> dict:
    """
    Aggregates revenues and deductible expenses from local transaction data,
    computes estimated corporate and sales tax liabilities based on garment-factory business logic,
    evaluates regulatory countdown deadlines, and invokes Gemini AI for an accountant executive summary.
    
    Returns:
        dict: Complete tax estimate model conforming to FinPilot API contract.
    """
    txn = _load_transactions()

    # 1. Aggregate Revenues
    income_txns = txn[txn["type"].astype(str).str.lower() == "income"]
    revenue_ytd = float(income_txns["amount"].sum())
    
    # Track revenue by category for reporting
    income_by_cat = income_txns.groupby("category")["amount"].sum().to_dict()
    sales_revenue = float(income_by_cat.get("Sales", 0.0))

    # 2. Aggregate Deductible Expenses (Garment-factory operational classifications)
    expense_txns = txn[txn["type"].astype(str).str.lower() == "expense"]
    expense_by_cat = expense_txns.groupby("category")["amount"].sum().to_dict()

    # Deductible operational categories:
    # - Supplier Payment: Raw materials, textiles, thread, trims (COGS)
    # - Salaries: Direct sewing labor, machine mechanics, administrative payroll
    # - Rent: Plant floor, warehouse, cutting room leases
    # - Utilities: Industrial steam, power, plant climate control
    # - Marketing: Apparel trade show exhibits, catalog photography, wholesale promotion
    deductible_categories = ["Supplier Payment", "Salaries", "Rent", "Utilities", "Marketing"]
    
    deductibles_breakdown = {
        cat: float(round(expense_by_cat.get(cat, 0.0), 2))
        for cat in deductible_categories
    }
    deductible_total = float(round(sum(deductibles_breakdown.values()), 2))

    # Prior taxes already remitted (e.g. quarterly withholdings or state prepayments in ledger)
    prior_tax_paid = float(round(expense_by_cat.get("Tax", 0.0), 2))

    # 3. Tax Liability Calculation (Standard Garment Manufacturing Logic)
    # Net Taxable Operating Income
    net_taxable_income = max(0.0, revenue_ytd - deductible_total)

    # Tax Rate Provisions:
    # - Federal Corporate Tax: 21%
    # - State Corporate Franchise Tax: 5% (Combined rate = 26%)
    # - Estimated Sales & Use Tax: ~4% on gross retail/commercial sales
    corp_tax_rate = 0.26
    corporate_tax = round(net_taxable_income * corp_tax_rate, 2)
    sales_tax = round(sales_revenue * 0.04, 2)
    
    total_tax_liability = round(corporate_tax + sales_tax, 2)
    estimated_tax_due = float(total_tax_liability)
    net_balance_due = float(round(max(0.0, total_tax_liability - prior_tax_paid), 2))
    
    effective_tax_rate = round((total_tax_liability / revenue_ytd * 100), 2) if revenue_ytd > 0 else 26.0

    # 4. Regulatory Filing Deadlines
    ref_date = date.today()
    filing_deadlines = _build_filing_deadlines(ref_date)

    # 5. Gemini AI Executive Summary for Accountants
    tax_summary_context = {
        "revenue_ytd": revenue_ytd,
        "deductible_total": deductible_total,
        "net_taxable_income": net_taxable_income,
        "estimated_tax_due": estimated_tax_due,
        "corporate_tax": corporate_tax,
        "sales_tax": sales_tax,
        "prior_tax_paid": prior_tax_paid,
        "net_balance_due": net_balance_due,
        "effective_tax_rate": effective_tax_rate,
        "deductibles_breakdown": deductibles_breakdown,
        "filing_deadlines": filing_deadlines,
    }

    prompt = tax_assistant_prompt(tax_summary_context)

    # Dynamic, audit-ready fallback memorandum in case Gemini API key is missing or offline
    cpa_fallback_summary = (
        f"### EXECUTIVE TAX MEMORANDUM & COMPLIANCE SUMMARY\n\n"
        f"**To:** Lead Corporate CPA & Financial Accounting Team  \n"
        f"**Entity:** FinPilot Garment Manufacturing Operations  \n"
        f"**Reporting Period:** Fiscal Year-to-Date (YTD)  \n"
        f"**Prepared by:** FinPilot Tax & Compliance Assistant Engine  \n\n"
        f"---\n\n"
        f"#### 1. Executive Summary & Tax Liability Posture\n"
        f"The company has generated **${revenue_ytd:,.2f}** in gross YTD revenues, offset by **${deductible_total:,.2f}** "
        f"in qualifying deductible operational expenditures, yielding a net taxable operating income of **${net_taxable_income:,.2f}**. "
        f"Based on statutory manufacturing guidelines, estimated total tax liability is projected at **${estimated_tax_due:,.2f}** "
        f"(comprising ${corporate_tax:,.2f} in corporate income tax at a 26.0% combined federal/state rate and ${sales_tax:,.2f} "
        f"in state sales & use tax provisions). With **${prior_tax_paid:,.2f}** in recorded prior tax remittances, "
        f"the estimated net outstanding balance due is **${net_balance_due:,.2f}**.\n\n"
        f"#### 2. Deductible Expense Classification & Audit Readiness\n"
        f"Operational deductions reflect standard garment manufacturing cost structures:\n"
        f"- **Raw Materials & Supplies (COGS):** ${deductibles_breakdown.get('Supplier Payment', 0):,.2f} in textile, trim, and fabric procurement. Under IRC Section 471, ensure strict closing inventory capitalization reconciliations.\n"
        f"- **Direct & Indirect Payroll:** ${deductibles_breakdown.get('Salaries', 0):,.2f} in plant floor sewing operators and supervisory wages. Reconciled with quarterly Form 941 filings.\n"
        f"- **Facility & Production Overhead:** ${deductibles_breakdown.get('Rent', 0):,.2f} in factory leases and ${deductibles_breakdown.get('Utilities', 0):,.2f} in industrial electricity, steam, and cutting power.\n"
        f"- **Wholesale Distribution & SG&A:** ${deductibles_breakdown.get('Marketing', 0):,.2f} in trade show exhibits and brand catalog distribution.\n\n"
        f"#### 3. Regulatory Filing Calendar & Safe-Harbor Action Plan\n"
        f"The primary priority is the upcoming **{filing_deadlines[0]['event']}** ({filing_deadlines[0]['form']}) due on **{filing_deadlines[0]['due_date']}** "
        f"({filing_deadlines[0]['days_remaining']} days remaining). To avoid late prepayment penalties, ensure quarterly installments satisfy IRS safe-harbor "
        f"(100% of prior-year liability or 90% of current-year projection). Maintain supporting vendor invoices for all COGS deductions exceeding $2,500."
    )

    accountant_summary = ask_gemini(prompt=prompt, fallback=cpa_fallback_summary)

    return {
        "estimated_tax_due": estimated_tax_due,
        "deductible_total": deductible_total,
        "filing_deadlines": filing_deadlines,
        "accountant_summary": accountant_summary,
        # Auxiliary structured data for frontend analytics cards
        "revenue_ytd": revenue_ytd,
        "net_taxable_income": net_taxable_income,
        "corporate_tax": corporate_tax,
        "sales_tax": sales_tax,
        "prior_tax_paid": prior_tax_paid,
        "net_balance_due": net_balance_due,
        "effective_tax_rate": effective_tax_rate,
        "deductibles_breakdown": deductibles_breakdown,
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
