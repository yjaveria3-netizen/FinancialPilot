"""
Supplier Negotiation Copilot (Member B). Python picks the target price and the
savings, Gemini only writes the message around those numbers.
"""
from __future__ import annotations

from ._common import ask_safe, rs


def build_negotiation(
    supplier: str,
    item: str,
    past_price: float,
    competitor_quote: float | None = None,
    qty: int = 1000,
    max_discount: float = 0.10,
    explain: bool = True,
) -> dict:
    """Target = competitor quote, but never more than `max_discount` below our past price."""
    if past_price <= 0:
        raise ValueError("past_price must be greater than 0")
    floor = past_price * (1 - max_discount)
    if competitor_quote and competitor_quote > 0:
        target = max(competitor_quote, floor)
    else:
        target = past_price * 0.95
    target = round(target, 2)
    saving_per_unit = round(past_price - target, 2)
    total_saving = round(saving_per_unit * qty, 2)

    fallback = (
        f"Dear {supplier} team,\n\n"
        f"We have valued our relationship and plan to order {qty} units of {item} again. "
        f"Our last price was {rs(past_price)} per unit"
        + (f", and we have received a quote of {rs(competitor_quote)} elsewhere" if competitor_quote else "")
        + f". Could you offer {rs(target)} per unit for this order? "
        "We would be glad to continue with you if we can agree on this.\n\n"
        "Best regards"
    )
    prompt = (
        "Write a polite but firm message from a small business to a supplier asking for a better "
        "price. Under 100 words. Use ONLY these facts, and do not invent others.\n"
        f"Supplier: {supplier}\nItem: {item}\nOrder size: {qty} units\n"
        f"Our last price: {past_price} per unit\n"
        f"Competitor quote: {competitor_quote if competitor_quote else 'none'}\n"
        f"Price we are asking for: {target} per unit\n"
        "Currency is Pakistani rupees (Rs.). Sign off 'Best regards'."
    )
    message = ask_safe(prompt, fallback) if explain else fallback
    return {
        "supplier": supplier,
        "item": item,
        "qty": qty,
        "past_price": past_price,
        "competitor_quote": competitor_quote,
        "target_price": target,
        "saving_per_unit": saving_per_unit,
        "total_saving": total_saving,
        "message": message,
    }


if __name__ == "__main__":
    import json
    print(json.dumps(build_negotiation("Premium Fabrics Co", "cotton fabric", 95, 88, 1000, explain=False), indent=2))
