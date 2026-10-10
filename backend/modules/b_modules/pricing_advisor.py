"""
Dynamic Pricing Advisor (Member B). Python computes the price, Gemini only explains it.
"""
from __future__ import annotations

from ._common import ask_safe, rs

MIN_MARGIN = 0.05  # warn if profit is below 5% of price


def suggest_price(
    cost: float,
    margin: float = 0.25,
    competitor_price: float | None = None,
    undercut: float = 0.02,
    explain: bool = True,
) -> dict:
    """
    cost: what one unit costs you. margin: target markup on cost (0.25 = 25%).
    competitor_price: optional. We stay slightly under it (undercut = 2%).
    """
    if cost <= 0:
        raise ValueError("cost must be greater than 0")
    target = cost * (1 + margin)
    price, capped = target, False
    if competitor_price and competitor_price > 0:
        ceiling = competitor_price * (1 - undercut)
        if target > ceiling:
            price, capped = ceiling, True

    profit = price - cost
    profit_pct_of_price = profit / price * 100
    warning = None
    if price <= cost:
        warning = "Competitor price is below your cost. Selling at this price loses money."
    elif profit / price < MIN_MARGIN:
        warning = "Margin is very thin (under 5%). Consider not matching the competitor."

    out = {
        "cost": round(cost, 2),
        "target_markup_pct": round(margin * 100, 1),
        "target_price": round(target, 2),
        "competitor_price": competitor_price,
        "suggested_price": round(price, 2),
        "capped_by_competitor": capped,
        "profit_per_unit": round(profit, 2),
        "profit_pct_of_price": round(profit_pct_of_price, 1),
        "vs_competitor_pct": (round((price / competitor_price - 1) * 100, 1)
                              if competitor_price else None),
        "warning": warning,
    }
    fallback = (
        f"Your cost is {rs(cost)} and a {margin*100:.0f}% markup gives {rs(target)}. "
        + (f"The competitor sells at {rs(competitor_price)}, so the suggested price is lowered to "
           f"{rs(price)} to stay competitive. " if capped else
           f"That is already at or below the competitor, so the suggested price is {rs(price)}. "
           if competitor_price else f"Suggested price is {rs(price)}. ")
        + f"You make {rs(profit)} per unit."
    )
    out["reason"] = (ask_safe(
        "You are a pricing advisor for a small business. Using ONLY these numbers, explain the "
        f"suggested price in 2 short sentences. Do not invent numbers.\n{out}", fallback)
        if explain else fallback)
    return out


if __name__ == "__main__":
    import json
    print(json.dumps(suggest_price(1000, 0.3, 1200, explain=False), indent=2))
