"""
FinPilot — Member A Module: Cash Flow Forecaster

FUNCTION CONTRACT:
  forecast_cash(days: int) -> dict
    Input:  Number of days to forecast ahead.
    Output: Pure Python dict (JSON-serializable) containing:
            - 'forecast':       list of {date, projected_balance, income, expenses}
            - 'summary':        high-level KPI dict
            - 'ai_explanation': Gemini-generated executive text (str)
            - 'low_cash_alert': bool — True if balance dips below $5,000
            - 'low_cash_day':   str date or None

UI RULE: This function must NOT import any UI framework (Streamlit, React, etc.).
         The API layer (main.py) calls this function and serializes the result.
"""
from pathlib import Path
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

from backend.services.gemini_wrapper import ask_gemini
from backend.services.prompt_library import cash_forecast_prompt

DATA_DIR = Path(__file__).parents[2] / "data"
LOW_CASH_THRESHOLD = 5_000.0


def _load_transactions() -> pd.DataFrame:
    path = DATA_DIR / "transactions.csv"
    df = pd.read_csv(path, parse_dates=["date"])
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
    return df


def _load_invoices() -> pd.DataFrame:
    path = DATA_DIR / "invoices.csv"
    df = pd.read_csv(path, parse_dates=["due_date"])
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0)
    return df


def _compute_daily_averages(txn: pd.DataFrame) -> tuple[float, float]:
    """
    Compute the last-90-day average daily income and expenses
    to use as the baseline projection rate.
    """
    cutoff = txn["date"].max() - pd.Timedelta(days=90)
    recent = txn[txn["date"] >= cutoff]
    n_days = max((recent["date"].max() - recent["date"].min()).days, 1)

    avg_income   = recent[recent["type"] == "income"]["amount"].sum() / n_days
    avg_expenses = recent[recent["type"] == "expense"]["amount"].sum() / n_days
    return avg_income, avg_expenses


def _get_starting_cash(txn: pd.DataFrame) -> float:
    """Approximate current cash: total income - total expenses."""
    income   = txn[txn["type"] == "income"]["amount"].sum()
    expenses = txn[txn["type"] == "expense"]["amount"].sum()
    return max(income - expenses, 0.0)


def _get_pending_invoices(inv: pd.DataFrame) -> float:
    """Sum of unpaid/overdue invoices not yet received."""
    pending = inv[inv["status"].isin(["unpaid", "overdue"])]
    return pending["amount"].sum()


def forecast_cash(days: int = 30) -> dict:
    """
    Project cash flow over the next `days` days.

    Args:
        days: Forecast horizon in days (default 30).

    Returns:
        dict with keys: forecast, summary, ai_explanation, low_cash_alert, low_cash_day
    """
    days = max(1, min(days, 365))  # clamp to 1–365

    txn = _load_transactions()
    inv = _load_invoices()

    avg_income, avg_expenses = _compute_daily_averages(txn)
    starting_cash = _get_starting_cash(txn)
    pending_invoices = _get_pending_invoices(inv)

    # Add a random-walk noise factor (±10%) for realism
    rng = np.random.default_rng(seed=42)
    noise_income   = rng.normal(1.0, 0.10, days)
    noise_expenses = rng.normal(1.0, 0.08, days)

    forecast_rows = []
    balance = starting_cash
    low_cash_alert = False
    low_cash_day   = None
    today = datetime.today().date()

    for i in range(days):
        day_date     = today + timedelta(days=i + 1)
        day_income   = round(avg_income   * noise_income[i],   2)
        day_expenses = round(avg_expenses * noise_expenses[i], 2)
        balance      = round(balance + day_income - day_expenses, 2)

        if balance < LOW_CASH_THRESHOLD and not low_cash_alert:
            low_cash_alert = True
            low_cash_day   = day_date.isoformat()

        forecast_rows.append({
            "date":               day_date.isoformat(),
            "projected_balance":  balance,
            "income":             day_income,
            "expenses":           day_expenses,
            "net_daily":          round(day_income - day_expenses, 2),
        })

    total_projected_income   = sum(r["income"] for r in forecast_rows)
    total_projected_expenses = sum(r["expenses"] for r in forecast_rows)
    ending_balance           = forecast_rows[-1]["projected_balance"]

    summary = {
        "starting_cash":      round(starting_cash, 2),
        "projected_income":   round(total_projected_income, 2),
        "projected_expenses": round(total_projected_expenses, 2),
        "ending_balance":     round(ending_balance, 2),
        "days_to_low_cash":   low_cash_day or "N/A",
        "pending_invoices":   round(pending_invoices, 2),
        "avg_daily_income":   round(avg_income, 2),
        "avg_daily_expenses": round(avg_expenses, 2),
    }

    prompt         = cash_forecast_prompt(days, summary)
    ai_explanation = ask_gemini(prompt)

    return {
        "forecast":       forecast_rows,
        "summary":        summary,
        "ai_explanation": ai_explanation,
        "low_cash_alert": low_cash_alert,
        "low_cash_day":   low_cash_day,
    }
