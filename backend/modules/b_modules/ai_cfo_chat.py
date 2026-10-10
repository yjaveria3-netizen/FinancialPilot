"""
AI CFO Chat (Member B). Python collects the real numbers, Gemini only explains them.
Every part is optional: if A's data or functions are missing, the chat says so instead of crashing.
"""
from __future__ import annotations

from ._common import ask_safe, get_forecast, rs
from .inventory_alerts import get_inventory_alerts
from .procure import _balances, get_procurement_plan

SUGGESTED_QUESTIONS = [
    "Can I afford to hire someone?",
    "Why is my cash low next month?",
    "Can I afford the premium supplier?",
]


def build_cfo_context(days: int = 30) -> dict:
    lines, numbers, missing = [], {}, []
    bal = None

    # 1) Cash forecast (Member A)
    try:
        bal = _balances(get_forecast(days))
        low = min(bal)
        low_day = bal.index(low)
        short = next((i for i, b in enumerate(bal) if b < 0), None)
        numbers.update(cash_now=round(bal[0]), lowest_cash=round(low), lowest_cash_day=low_day,
                       days_until_cash_negative=short)
        lines.append(f"Cash today: {rs(bal[0])}.")
        lines.append(f"Lowest forecast cash in the next {len(bal)} days: {rs(low)} on day {low_day}.")
        lines.append(f"Cash goes below zero on day {short}." if short is not None
                     else "Cash does not go below zero in the forecast.")
    except Exception as e:
        missing.append(f"cash forecast ({type(e).__name__})")

    # 2) Credit score (Member A)
    try:
        from backend.modules.a_modules.credit_score import calculate_credit_score
        cs = calculate_credit_score()
        score = cs.get("score", cs.get("credit_score", cs.get("total"))) if isinstance(cs, dict) else cs
        if score is not None:
            numbers["credit_score"] = score
            lines.append(f"Credit readiness score: {score} out of 100.")
        if isinstance(cs, dict) and cs.get("factors"):
            lines.append(f"Score factors: {str(cs['factors'])[:300]}")
    except Exception as e:
        missing.append(f"credit score ({type(e).__name__})")

    # 3) Procurement plan (Member B)
    if bal:
        try:
            p = get_procurement_plan(bal, explain=False, horizon_days=len(bal))
            numbers["procurement_strategy"] = p["strategy"]
            lines.append(f"Safe purchasing budget today: {rs(p['safe_budget'])} (keeping a {rs(p['safety_buffer'])} buffer).")
            lines.append(f"Procurement advice: {p['recommendation']}")
            lines.append(f"Buying all {p['qty']} units from {p['best_value_supplier']} "
                         f"would need {rs(p['best_single_cash_needed'])} now.")
        except Exception as e:
            missing.append(f"procurement ({type(e).__name__})")

    # 4) Inventory (Member B)
    try:
        inv = get_inventory_alerts()["summary"]
        numbers["stock_value_at_risk"] = inv["stock_value_at_risk"]
        lines.append(f"Inventory: {inv['flagged_items']} items flagged, "
                     f"{rs(inv['stock_value_at_risk'])} of stock at risk.")
    except Exception as e:
        missing.append(f"inventory ({type(e).__name__})")

    return {"text": "\n".join(lines), "numbers": numbers, "missing": missing}


def cfo_chat(question: str, history: list | None = None) -> dict:
    question = (question or "").strip()
    if not question:
        raise ValueError("question is empty")
    ctx = build_cfo_context()
    if not ctx["numbers"]:
        return {"answer": "I do not have your financial data yet. Generate the data first, then ask again.",
                "numbers": {}, "missing": ctx["missing"], "suggested_questions": SUGGESTED_QUESTIONS}

    convo = ""
    for m in (history or [])[-6:]:
        if isinstance(m, dict) and m.get("content"):
            convo += f"{m.get('role', 'user')}: {m['content']}\n"
    prompt = (
        "You are a friendly CFO for a small garment factory in Pakistan. Use ONLY the numbers below. "
        "Never invent numbers. If the answer needs a number that is not listed (for example a salary), "
        "say what you would need to know. Answer in 3 to 4 short sentences, plain words, amounts in Rs.\n\n"
        f"NUMBERS:\n{ctx['text']}\n\n"
        + (f"CONVERSATION SO FAR:\n{convo}\n" if convo else "")
        + f"QUESTION: {question}"
    )
    fallback = ("The AI explanation is offline right now. Here are your key numbers:\n" + ctx["text"])
    return {"answer": ask_safe(prompt, fallback), "numbers": ctx["numbers"],
            "missing": ctx["missing"], "suggested_questions": SUGGESTED_QUESTIONS}
