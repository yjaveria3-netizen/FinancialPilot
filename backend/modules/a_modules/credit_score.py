"""
FinPilot — Member A Module: Credit Readiness Score

FUNCTION CONTRACT:
  calculate_credit_score() -> dict
    Input:  None (reads CSVs from /data).
    Output: Pure Python dict (JSON-serializable) containing:
            - 'score':        int (0–100)
            - 'grade':        str (A/B/C/D/F)
            - 'factors':      dict of sub-scores
            - 'breakdown':    list of {factor, score, max_score, explanation}
            - 'ai_advice':    Gemini improvement tips (str)

UI RULE: This function must NOT import any UI framework.
"""
from pathlib import Path
import pandas as pd
import numpy as np

from backend.services.gemini_wrapper import ask_gemini
from backend.services.prompt_library import credit_score_prompt

DATA_DIR = Path(__file__).parents[2] / "data"


def _load_transactions() -> pd.DataFrame:
    df = pd.read_csv(DATA_DIR / "transactions.csv", parse_dates=["date"])
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
    return df


def _load_invoices() -> pd.DataFrame:
    df = pd.read_csv(DATA_DIR / "invoices.csv")
    df["due_date"] = pd.to_datetime(df["due_date"], errors="coerce")
    if "paid_date" in df.columns:
        df["paid_date"] = pd.to_datetime(df["paid_date"], errors="coerce")
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
    return df


def _score_revenue_consistency(txn: pd.DataFrame) -> tuple[float, str]:
    """
    Score 0–30: How consistent is monthly revenue?
    Uses coefficient of variation (lower CV = higher score).
    """
    income = txn[txn["type"] == "income"].copy()
    income["month"] = income["date"].dt.to_period("M")
    monthly = income.groupby("month")["amount"].sum()

    if len(monthly) < 2:
        return 10.0, "Insufficient data for consistency scoring."

    cv = monthly.std() / monthly.mean() if monthly.mean() > 0 else 1.0
    # CV of 0 → 30 pts; CV of 1+ → 0 pts
    score = max(0, 30 * (1 - min(cv, 1.0)))
    explanation = (
        f"Revenue CV of {cv:.2%} — "
        + ("Excellent consistency." if cv < 0.15 else
           "Good consistency." if cv < 0.30 else
           "Moderate variability. Stabilize monthly revenue." if cv < 0.60 else
           "High variability. Lenders see inconsistent income as risky.")
    )
    return round(score, 1), explanation


def _score_profit_margin(txn: pd.DataFrame) -> tuple[float, str]:
    """
    Score 0–25: Average net profit margin over last 6 months.
    """
    cutoff = txn["date"].max() - pd.Timedelta(days=180)
    recent = txn[txn["date"] >= cutoff]
    income   = recent[recent["type"] == "income"]["amount"].sum()
    expenses = recent[recent["type"] == "expense"]["amount"].sum()

    if income == 0:
        return 5.0, "No revenue data in last 6 months."

    margin = (income - expenses) / income
    # margin of 30%+ → 25 pts; negative → 0 pts
    score = max(0, min(25, 25 * (margin / 0.30)))
    explanation = (
        f"Net margin of {margin:.1%} — "
        + ("Excellent profitability." if margin >= 0.30 else
           "Good margin." if margin >= 0.15 else
           "Thin margin. Reduce expenses or raise prices." if margin >= 0 else
           "Operating at a loss. Immediate action required.")
    )
    return round(score, 1), explanation


def _score_payment_behavior(inv: pd.DataFrame) -> tuple[float, str]:
    """
    Score 0–25: How reliably do customers pay invoices on time?
    """
    paid = inv[inv["status"] == "paid"].copy()
    total_invoices = len(inv[inv["status"].isin(["paid", "overdue", "unpaid"])])

    if total_invoices == 0:
        return 10.0, "No invoice payment data found."

    on_time_rate = len(paid) / total_invoices if total_invoices > 0 else 0
    overdue_rate = len(inv[inv["status"] == "overdue"]) / total_invoices

    score = max(0, 25 * on_time_rate - 5 * overdue_rate)
    explanation = (
        f"{on_time_rate:.0%} of invoices paid, {overdue_rate:.0%} overdue — "
        + ("Excellent payment collection." if on_time_rate >= 0.85 else
           "Good collection rate." if on_time_rate >= 0.70 else
           "Improve collections process — many invoices unpaid.")
    )
    return round(min(score, 25), 1), explanation


def _score_expense_control(txn: pd.DataFrame) -> tuple[float, str]:
    """
    Score 0–20: Is the business controlling its expenses vs. revenue growth?
    Measures expense-to-income ratio trend.
    """
    txn["month"] = txn["date"].dt.to_period("M")
    monthly = txn.groupby(["month", "type"])["amount"].sum().unstack(fill_value=0)

    if "income" not in monthly.columns or "expense" not in monthly.columns:
        return 10.0, "Insufficient data for expense control scoring."

    ratios = monthly["expense"] / monthly["income"].replace(0, np.nan)
    ratios = ratios.dropna()

    if len(ratios) < 2:
        return 10.0, "Too few months of data."

    avg_ratio = ratios.mean()
    # ratio < 0.6 → excellent; ratio > 1.0 → zero
    score = max(0, min(20, 20 * (1 - (avg_ratio - 0.6) / 0.4))) if avg_ratio >= 0.6 else 20.0
    explanation = (
        f"Expense/Income ratio of {avg_ratio:.0%} — "
        + ("Excellent cost discipline." if avg_ratio < 0.60 else
           "Good expense control." if avg_ratio < 0.75 else
           "Expenses are high relative to revenue." if avg_ratio < 1.0 else
           "Spending exceeds income — critical issue.")
    )
    return round(score, 1), explanation


def _grade(score: int) -> str:
    if score >= 85: return "A"
    if score >= 70: return "B"
    if score >= 55: return "C"
    if score >= 40: return "D"
    return "F"


def calculate_credit_score() -> dict:
    """
    Evaluate financial health and return a credit readiness score.

    Returns:
        dict with keys: score, grade, factors, breakdown, ai_advice
    """
    txn = _load_transactions()
    inv = _load_invoices()

    rev_score,  rev_exp  = _score_revenue_consistency(txn)
    mar_score,  mar_exp  = _score_profit_margin(txn)
    pay_score,  pay_exp  = _score_payment_behavior(inv)
    exp_score,  exp_exp  = _score_expense_control(txn)

    total = int(rev_score + mar_score + pay_score + exp_score)
    total = max(0, min(100, total))

    factors = {
        "revenue_consistency": round(rev_score, 1),
        "profit_margin":       round(mar_score, 1),
        "payment_behavior":    round(pay_score, 1),
        "expense_control":     round(exp_score, 1),
    }

    breakdown = [
        {"factor": "Revenue Consistency", "score": rev_score, "max_score": 30, "explanation": rev_exp},
        {"factor": "Profit Margin",       "score": mar_score, "max_score": 25, "explanation": mar_exp},
        {"factor": "Payment Behavior",    "score": pay_score, "max_score": 25, "explanation": pay_exp},
        {"factor": "Expense Control",     "score": exp_score, "max_score": 20, "explanation": exp_exp},
    ]

    prompt     = credit_score_prompt(total, factors)
    ai_advice  = ask_gemini(prompt)

    return {
        "score":     total,
        "grade":     _grade(total),
        "factors":   factors,
        "breakdown": breakdown,
        "ai_advice": ai_advice,
    }
