"""
FinPilot — Member A Module: Scenario Planner

Runs a Monte Carlo financial simulation covering cash runway, procurement spend,
and credit risk limits based on variable parameters (sales growth/drop, hiring payroll,
and raw material price fluctuations).

FUNCTION CONTRACT:
  run_monte_carlo_simulation(params: dict) -> dict
    Input:  dict with optional keys:
            - 'sales_change_pct': float (e.g., -15.0 or 20.0)
            - 'hiring_count': int (e.g., 3)
            - 'hiring_monthly_cost': float (default 4500.0)
            - 'procurement_cost_pct': float (e.g., 10.0)
            - 'days': int (default 30)
            - 'simulations': int (default 500)
    Output: Pure Python dict (JSON-serializable) containing:
            - 'projections': list of {date, baseline, p10, p25, p50, p75, p90}
            - 'impact_summary': KPI summary dict
            - 'ai_analysis': Gemini-generated executive risk analysis
            - 'params_applied': dict of normalized parameters

UI RULE: Pure Python and Pandas/NumPy. No UI framework imports.
"""
from pathlib import Path
from datetime import datetime, timedelta, date
import pandas as pd
import numpy as np

from backend.modules.a_modules.cash_forecast import (
    forecast_cash,
    _load_transactions,
    _compute_daily_averages,
    _get_starting_cash,
    LOW_CASH_THRESHOLD,
)
from backend.services.gemini_wrapper import ask_gemini
from backend.services.prompt_library import scenario_planner_prompt

DATA_DIR = Path(__file__).parents[2] / "data"


def _get_procurement_daily_average(txn: pd.DataFrame) -> float:
    """Calculates baseline daily procurement/supplier payments over the last 90 days."""
    cutoff = txn["date"].max() - pd.Timedelta(days=90)
    recent = txn[txn["date"] >= cutoff]
    n_days = max((recent["date"].max() - recent["date"].min()).days, 1)
    
    supp_payments = recent[
        (recent["type"] == "expense") & (recent["category"] == "Supplier Payment")
    ]["amount"].sum()
    
    return float(supp_payments / n_days) if supp_payments > 0 else 1200.0


def run_monte_carlo_simulation(params: dict | None = None) -> dict:
    """
    Executes a multi-variable Monte Carlo simulation against baseline financial forecasts.

    Args:
        params: dict of parameter shifts.
            - sales_change_pct: % change in sales (-50% to +50%)
            - hiring_count: headcount additions (0 to 20)
            - hiring_monthly_cost: monthly salary per hire (default 4500.0)
            - procurement_cost_pct: % shift in material costs (-30% to +50%)
            - days: simulation horizon in days (default 30, max 90)
            - simulations: number of random paths (default 500, max 1000)

    Returns:
        dict: Complete Monte Carlo projections and risk analysis.
    """
    if params is None:
        params = {}

    # Normalize parameters
    sales_change_pct = float(params.get("sales_change_pct", 0.0))
    hiring_count = int(params.get("hiring_count", 0))
    hiring_monthly_cost = float(params.get("hiring_monthly_cost", 4500.0))
    procurement_cost_pct = float(params.get("procurement_cost_pct", 0.0))
    receivables_delay_days = int(params.get("receivables_delay_days", 0))
    days = max(7, min(int(params.get("days", 30)), 90))
    n_sims = max(100, min(int(params.get("simulations", 500)), 1000))

    # 1. Obtain deterministic baseline forecast
    baseline_result = forecast_cash(days=days)
    baseline_forecast = baseline_result.get("forecast", [])
    baseline_summary = baseline_result.get("summary", {})
    baseline_ending_cash = float(baseline_summary.get("ending_balance", 0.0))

    # 2. Extract operational baselines
    txn = _load_transactions()
    avg_income, avg_expenses = _compute_daily_averages(txn)
    starting_cash = _get_starting_cash(txn)
    daily_procurement_base = _get_procurement_daily_average(txn)
    daily_other_expenses = max(0.0, avg_expenses - daily_procurement_base)

    # 3. Apply scenario parameter shifts (including dynamic live demo custom inflows/outflows)
    custom_inflow = float(params.get("custom_inflow", 0.0))
    custom_outflow = float(params.get("custom_outflow", 0.0))
    daily_custom_inflow = custom_inflow / float(days) if custom_inflow != 0 else 0.0
    daily_custom_outflow = custom_outflow / float(days) if custom_outflow != 0 else 0.0

    shifted_avg_income = max(0.0, (avg_income + daily_custom_inflow) * (1.0 + sales_change_pct / 100.0))
    shifted_daily_procurement = max(0.0, daily_procurement_base * (1.0 + procurement_cost_pct / 100.0))
    daily_addl_payroll = max(0.0, hiring_count * (hiring_monthly_cost / 30.0))
    shifted_avg_expenses = max(0.0, daily_other_expenses + shifted_daily_procurement + daily_addl_payroll + daily_custom_outflow)

    # 4. Vectorized Monte Carlo Stochastic Engine (NumPy)
    rng = np.random.default_rng(seed=101)

    # Lognormal/normal stochastic multipliers for income and expense volatility
    vol_income = 0.12
    vol_expense = 0.08
    noise_inc = rng.normal(1.0, vol_income, size=(n_sims, days))
    noise_exp = rng.normal(1.0, vol_expense, size=(n_sims, days))

    # Daily simulated cash flows
    sim_income = np.maximum(0.0, shifted_avg_income * noise_inc)

    # Receivables collection shift (delay slows inflows early, acceleration boosts early)
    if receivables_delay_days != 0:
        delay_factor = max(-0.5, min(float(receivables_delay_days) * 0.025, 0.5))
        day_indices = np.linspace(1.0, 0.2, days)
        delay_modifiers = 1.0 - (delay_factor * day_indices)
        sim_income = np.maximum(0.0, sim_income * delay_modifiers)

    sim_expenses = np.maximum(0.0, shifted_avg_expenses * noise_exp)
    daily_net = sim_income - sim_expenses

    # Cumulative cash balance trajectories across all trials
    cum_cash = starting_cash + np.cumsum(daily_net, axis=1)

    # 5. Extract Percentile Bands (P10, P25, P50, P75, P90)
    p10_series = np.percentile(cum_cash, 10, axis=0)
    p25_series = np.percentile(cum_cash, 25, axis=0)
    p50_series = np.percentile(cum_cash, 50, axis=0)
    p75_series = np.percentile(cum_cash, 75, axis=0)
    p90_series = np.percentile(cum_cash, 90, axis=0)

    # Align dates with baseline
    today = date.today()
    projections = []
    for t in range(days):
        day_date = (today + timedelta(days=t + 1)).isoformat()
        base_bal = baseline_forecast[t]["projected_balance"] if t < len(baseline_forecast) else float(starting_cash)

        projections.append({
            "date": day_date,
            "baseline": round(float(base_bal), 2),
            "p10": round(float(p10_series[t]), 2),
            "p25": round(float(p25_series[t]), 2),
            "p50": round(float(p50_series[t]), 2),
            "p75": round(float(p75_series[t]), 2),
            "p90": round(float(p90_series[t]), 2),
        })

    # 6. Calculate Impact Summaries & Risk Metrics
    ending_p10 = round(float(p10_series[-1]), 2)
    ending_p50 = round(float(p50_series[-1]), 2)
    ending_p90 = round(float(p90_series[-1]), 2)
    net_cash_impact = round(ending_p50 - baseline_ending_cash, 2)

    # Shortfall probability: % of simulation paths that breach the low cash safety buffer ($5,000)
    min_balances_per_trial = np.min(cum_cash, axis=1)
    shortfall_trials = np.sum(min_balances_per_trial < LOW_CASH_THRESHOLD)
    shortfall_probability = round(float((shortfall_trials / n_sims) * 100.0), 1)

    # Procurement & hiring cumulative dollar delta
    procurement_cost_delta = round(float((shifted_daily_procurement - daily_procurement_base) * days), 2)
    hiring_cost_delta = round(float(daily_addl_payroll * days), 2)
    total_expense_delta = round(float((shifted_avg_expenses - avg_expenses) * days), 2)

    # Credit risk rating
    if shortfall_probability >= 35.0 or ending_p50 < LOW_CASH_THRESHOLD:
        credit_risk_impact = "High Liquidity Stress (Buffer Breach Likely)"
        risk_color = "red"
    elif shortfall_probability >= 15.0 or net_cash_impact < -15000:
        credit_risk_impact = "Moderate Exposure (Credit Line Drawdown Recommended)"
        risk_color = "amber"
    else:
        credit_risk_impact = "Low Exposure (Robust Debt Service & Working Capital)"
        risk_color = "emerald"

    impact_summary = {
        "baseline_ending_cash": round(baseline_ending_cash, 2),
        "ending_cash_p50": ending_p50,
        "ending_cash_p10": ending_p10,
        "ending_cash_p90": ending_p90,
        "net_cash_impact": net_cash_impact,
        "shortfall_probability": shortfall_probability,
        "procurement_cost_delta": procurement_cost_delta,
        "hiring_cost_delta": hiring_cost_delta,
        "total_expense_delta": total_expense_delta,
        "credit_risk_impact": credit_risk_impact,
        "risk_color": risk_color,
        "horizon_days": days,
        "simulations_count": n_sims,
        "receivables_delay_days": receivables_delay_days,
    }

    normalized_params = {
        "sales_change_pct": sales_change_pct,
        "hiring_count": hiring_count,
        "hiring_monthly_cost": hiring_monthly_cost,
        "procurement_cost_pct": procurement_cost_pct,
        "receivables_delay_days": receivables_delay_days,
        "days": days,
        "simulations": n_sims,
    }

    # 7. Gemini AI Executive Explanation
    prompt = scenario_planner_prompt(normalized_params, impact_summary)

    fallback_analysis = (
        f"### EXECUTIVE SCENARIO ANALYSIS & MONTE CARLO FINDINGS\n\n"
        f"#### 1. Runway & Liquidity Trajectory\n"
        f"Under the tested scenario ({sales_change_pct:+.1f}% sales, +{hiring_count} hires, {procurement_cost_pct:+.1f}% procurement), "
        f"the business is projected to achieve a median ending cash balance (P50) of **${ending_p50:,.2f}**, representing a "
        f"**${net_cash_impact:+,.2f}** shift against the baseline projection of **${baseline_ending_cash:,.2f}**. In the conservative 10th percentile "
        f"stress case (P10), the ending cash reserves hold at **${ending_p10:,.2f}**, reflecting a **{shortfall_probability}%** probability "
        f"of dipping below the statutory $5,000 minimum operating buffer.\n\n"
        f"#### 2. Sensitivity & Cost Drivers\n"
        f"Cost pressures are primarily driven by a **${procurement_cost_delta:+,.2f}** shift in raw material procurement and an additional "
        f"**${hiring_cost_delta:,.2f}** in operational payroll. The overall credit risk profile is assessed as **{credit_risk_impact}**. "
        f"{'Revenue expansion successfully buffers operating expenditures.' if net_cash_impact >= 0 else 'Rising expense drag outpaces current revenue gains; working capital preservation is advised.'}\n\n"
        f"#### 3. Strategic Recommendations\n"
        f"- **Working Capital Management:** {'Ensure standby credit facilities are pre-approved if market demand drops below target.' if shortfall_probability > 10 else 'Operating cash generation is self-sufficient; surplus may be reinvested.'}\n"
        f"- **Headcount Sequencing:** Sequence the {hiring_count} new additions in 30-day phases tied to cleared monthly cash flow milestones.\n"
        f"- **Procurement Hedging:** Lock in supplier pricing on raw material contracts to mitigate the projected ${abs(procurement_cost_delta):,.2f} variance."
    )

    ai_analysis = ask_gemini(prompt=prompt, fallback=fallback_analysis)

    return {
        "projections": projections,
        "impact_summary": impact_summary,
        "ai_analysis": ai_analysis,
        "params_applied": normalized_params,
    }
