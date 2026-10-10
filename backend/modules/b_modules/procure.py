"""
ProcureAI (Member B)

Pure Python, no web code. main.py calls get_procurement_plan() and returns the dict as JSON.
Python does ALL the math. Gemini only explains the numbers in plain words.

Forecast input: a pandas DataFrame, a list of dicts, a list of numbers, or a dict
holding one of those under "forecast"/"data"/"series"/"rows". Each row needs a
balance column named one of: balance, closing_balance, cash, projected_balance,
predicted_balance, cash_balance. Day 0 (today) comes first.
"""
from __future__ import annotations

import math
import numbers

# Fake supplier list for the demo. Replace later with A's suppliers table if it exists.
DEFAULT_SUPPLIERS = [
    {"name": "QuickCheap Traders", "price": 80, "lead_days": 14, "defect_rate": 0.12},
    {"name": "MidRange Textiles", "price": 90, "lead_days": 8, "defect_rate": 0.06},
    {"name": "Premium Fabrics Co", "price": 95, "lead_days": 3, "defect_rate": 0.01},
]

BALANCE_KEYS = (
    "balance", "closing_balance", "cash", "projected_balance",
    "predicted_balance", "cash_balance",
)


# ---------- helpers ----------
def _balances(forecast) -> list[float]:
    """Turn any reasonable forecast shape into a plain list of daily balances."""
    data = forecast
    if isinstance(data, dict):
        for k in ("forecast", "data", "series", "rows"):
            if k in data:
                data = data[k]
                break
        else:
            raise ValueError(f"Forecast dict has no forecast/data/series/rows key. Keys: {list(data)}")
    if hasattr(data, "to_dict") and hasattr(data, "columns"):  # DataFrame
        data = data.to_dict("records")

    out: list[float] = []
    for row in data:
        if isinstance(row, numbers.Real):
            out.append(float(row))
            continue
        for k in BALANCE_KEYS:
            if k in row:
                out.append(float(row[k]))
                break
        else:
            raise ValueError(f"Forecast row has no balance column. Row keys: {list(row)}")
    if not out:
        raise ValueError("Forecast is empty.")
    return out


def _tco_table(suppliers, qty, delay_cost_per_day) -> list[dict]:
    """Total cost of ownership = price*qty + bad items you must rebuy + cost of waiting."""
    rows = []
    for s in suppliers:
        base = s["price"] * qty
        defect = base * s["defect_rate"]
        delay = s["lead_days"] * delay_cost_per_day
        total = base + defect + delay
        rows.append({
            "name": s["name"],
            "price": s["price"],
            "lead_days": s["lead_days"],
            "defect_rate": s["defect_rate"],
            "base_cost": round(base, 2),
            "defect_cost": round(defect, 2),
            "delay_cost": round(delay, 2),
            "total_tco": round(total, 2),
            "tco_per_unit": round(total / qty, 2),
            "cash_needed_now": round(base, 2),
        })
    return rows


def _earliest_safe_day(bal: list[float], cost: float, buffer: float):
    """First day d where paying `cost` keeps every balance from d onward above `buffer`."""
    for d in range(len(bal)):
        if min(bal[d:]) - cost >= buffer:
            return d
    return None


def _template_explanation(plan: dict) -> str:
    """Plain-text fallback used when Gemini is unavailable."""
    return plan["recommendation"]


def _gemini_explanation(plan: dict) -> str:
    prompt = (
        "You are a friendly CFO for a small garment factory. Using ONLY these numbers, "
        "explain the purchasing recommendation in 3 short sentences. Do not invent numbers.\n"
        f"Recommendation: {plan['recommendation']}\n"
        f"Lowest forecast cash balance (next {plan['horizon_days']} days): Rs. {plan['min_balance']:,.0f}\n"
        f"Safety buffer: Rs. {plan['safety_buffer']:,.0f}; safe budget today: Rs. {plan['safe_budget']:,.0f}\n"
        f"Best value supplier by total cost: {plan['best_value_supplier']} "
        f"(Rs. {plan['tco_table'][plan['best_value_index']]['tco_per_unit']}/unit all-in)\n"
        f"Cheapest-price supplier: {plan['cheapest_supplier']}\n"
        f"Order split (units): {plan['split']}\n"
    )
    try:
        try:
            from backend.services.gemini import ask
        except ImportError:
            from services.gemini import ask
        text = ask(prompt)
        if not text or "unavailable" in text.lower():
            return _template_explanation(plan)
        return text
    except Exception:
        return _template_explanation(plan)


# ---------- main function ----------
def get_procurement_plan(
    forecast,
    qty: int = 1000,
    suppliers: list[dict] | None = None,
    safety_buffer: float = 50_000,
    delay_cost_per_day: float = 1_000,
    horizon_days: int = 30,
    explain: bool = True,
) -> dict:
    """Compare suppliers by total cost, then decide what we can afford without running out of cash."""
    suppliers = suppliers or DEFAULT_SUPPLIERS
    bal = _balances(forecast)
    window = bal[:horizon_days]
    min_balance = min(window)
    safe_budget = max(0.0, min_balance - safety_buffer)

    table = _tco_table(suppliers, qty, delay_cost_per_day)
    best_i = min(range(len(table)), key=lambda i: table[i]["tco_per_unit"])
    cheap_i = min(range(len(table)), key=lambda i: table[i]["price"])
    best, cheap = table[best_i], table[cheap_i]

    # Is the best-value supplier affordable for the whole order today?
    best_full_cost = best["cash_needed_now"]
    wait_day = _earliest_safe_day(bal, best_full_cost, safety_buffer)

    split: dict[str, int] = {}
    if best_full_cost <= safe_budget:
        strategy = "buy_now"
        split = {best["name"]: qty}
        rec = (f"Buy all {qty} units from {best['name']} now. It has the lowest total cost "
               f"(Rs. {best['tco_per_unit']}/unit) and cash stays above the safety buffer.")
    elif best_i == cheap_i:
        # best value is also cheapest, but still too expensive today
        units = min(qty, math.floor(safe_budget / best["price"]))
        strategy = "partial" if units > 0 else "wait"
        split = {best["name"]: units} if units > 0 else {}
        rec = (f"Order only {units} units from {best['name']} now (safe budget Rs. {safe_budget:,.0f}) "
               f"and the rest later." if units > 0 else
               "Cash is too tight to order now. Wait.")
    elif cheap["cash_needed_now"] <= safe_budget:
        # Split: as many units as we can afford from best value, the rest from the cheap supplier.
        x = math.floor((safe_budget - qty * cheap["price"]) / (best["price"] - cheap["price"]))
        x = max(0, min(qty, x))
        strategy = "split"
        split = {}
        if x > 0:
            split[best["name"]] = x
        if qty - x > 0:
            split[cheap["name"]] = qty - x
        rec = (f"Split the order: {x} units from {best['name']} (best value) and {qty - x} units from "
               f"{cheap['name']} (cheapest price). Buying everything from {best['name']} would cost "
               f"Rs. {best_full_cost:,.0f} and push cash below the safety buffer.")
    else:
        units = math.floor(safe_budget / cheap["price"])
        strategy = "partial" if units > 0 else "wait"
        split = {cheap["name"]: units} if units > 0 else {}
        later = (f" Cash allows the full order from {best['name']} from day {wait_day}."
                 if wait_day is not None else "")
        rec = (f"Cash is tight. Order only {units} units from {cheap['name']} now and the rest later."
               if units > 0 else "Cash is too tight to order now. Wait.") + later

    split_cost = round(sum(
        n * next(t["price"] for t in table if t["name"] == name) for name, n in split.items()), 2)
    split_tco = round(sum(
        n * next(t["tco_per_unit"] for t in table if t["name"] == name) for name, n in split.items()), 2)
    cheap_only_tco = cheap["total_tco"]
    savings_vs_cheap = round(cheap_only_tco - split_tco, 2) if sum(split.values()) == qty else None

    plan = {
        "qty": qty,
        "horizon_days": horizon_days,
        "min_balance": round(min_balance, 2),
        "safety_buffer": safety_buffer,
        "safe_budget": round(safe_budget, 2),
        "tco_table": table,
        "best_value_supplier": best["name"],
        "best_value_index": best_i,
        "cheapest_supplier": cheap["name"],
        "best_single_cash_needed": best_full_cost,
        "buy_now_ok": best_full_cost <= safe_budget,
        "wait_until_day": wait_day,
        "strategy": strategy,
        "split": split,
        "split_cash_now": split_cost,
        "split_tco": split_tco,
        "savings_vs_cheapest_only": savings_vs_cheap,
        "recommendation": rec,
    }
    plan["explanation"] = _gemini_explanation(plan) if explain else _template_explanation(plan)
    return plan


# ---------- quick self-test: python -m backend.modules.b_modules.procure ----------
if __name__ == "__main__":
    import json
    fake = [400_000 - d * 8_000 if d < 18 else 140_000 + (d - 18) * 9_000 for d in range(30)]
    print(json.dumps(get_procurement_plan(fake, explain=False), indent=2))
