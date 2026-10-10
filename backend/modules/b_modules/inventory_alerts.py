"""
Inventory Alerts (Member B). Pure Python.

Reads A's backend/data/inventory.csv (columns: sku, product_id, quantity_on_hand,
reorder_point, reorder_qty, unit_cost, ...) and joins products.csv for item names.
Flags: low stock (below reorder point), plus near-expiry and slow-moving when those
columns exist (the demo data has them). Falls back to demo data if no usable CSV.
"""
from __future__ import annotations

from datetime import date, timedelta

import pandas as pd

from ._common import DATA_DIR, rs


def _demo_inventory(today: date) -> pd.DataFrame:
    rows = [
        ("Cotton fabric rolls", 120, 450, 40, 100, today + timedelta(days=9), today - timedelta(days=12)),
        ("Dye (blue, 20L)", 30, 3200, 20, 30, today + timedelta(days=22), today - timedelta(days=40)),
        ("Zippers (box)", 400, 90, 100, 300, None, today - timedelta(days=95)),
        ("Polyester thread", 250, 60, 100, 200, None, today - timedelta(days=70)),
        ("Packaging film", 60, 700, 80, 100, today + timedelta(days=3), today - timedelta(days=5)),
        ("Buttons (assorted)", 900, 8, 300, 600, None, today - timedelta(days=10)),
        ("Old-season lining", 80, 300, 20, 50, today - timedelta(days=2), today - timedelta(days=120)),
    ]
    return pd.DataFrame(rows, columns=["item", "qty", "unit_cost", "reorder_point", "reorder_qty",
                                       "expiry_date", "last_sold"])


def load_inventory(today: date) -> tuple[pd.DataFrame, str]:
    path = DATA_DIR / "inventory.csv"
    if path.exists():
        try:
            df = pd.read_csv(path)
            cols = set(df.columns)
            if {"sku", "quantity_on_hand", "unit_cost"}.issubset(cols):  # A's schema
                df = df.rename(columns={"quantity_on_hand": "qty"})
                df["item"] = df["sku"]
                prod = DATA_DIR / "products.csv"
                if prod.exists() and "product_id" in cols:
                    p = pd.read_csv(prod)[["product_id", "name"]]
                    df = df.merge(p, on="product_id", how="left")
                    df["item"] = df["name"].fillna(df["sku"]) + " (" + df["sku"] + ")"
                return df, "inventory.csv"
            if {"item", "qty", "unit_cost"}.issubset(cols):
                return df, "inventory.csv"
        except Exception:
            pass
    return _demo_inventory(today), "demo data"


def _days_from(today: date, value):
    if value is None or pd.isna(value):
        return None
    try:
        return (pd.Timestamp(value).date() - today).days
    except Exception:
        return None


def _num(row, key):
    v = row.get(key)
    return None if v is None or pd.isna(v) else float(v)


def get_inventory_alerts(expiry_days: int = 30, slow_days: int = 60, today: date | None = None) -> dict:
    today = today or date.today()
    df, source = load_inventory(today)
    alerts = []
    for _, r in df.iterrows():
        qty = float(r["qty"])
        unit_cost = float(r["unit_cost"])
        to_expiry = _days_from(today, r.get("expiry_date"))
        ls = _days_from(today, r.get("last_sold"))
        unsold = -ls if ls is not None else None
        reorder_point, reorder_qty = _num(r, "reorder_point"), _num(r, "reorder_qty")

        reasons, discount, status = [], 0, "ok"
        action_parts = []
        if to_expiry is not None and to_expiry < 0:
            reasons.append(f"expired {-to_expiry} days ago")
            status, discount = "expired", 50
        elif to_expiry is not None and to_expiry <= expiry_days:
            reasons.append(f"expires in {to_expiry} days")
            status = "near_expiry"
            discount = 40 if to_expiry <= 7 else 30 if to_expiry <= 14 else 20
        if unsold is not None and unsold > slow_days:
            reasons.append(f"not sold for {unsold} days")
            if status == "ok":
                status = "slow_moving"
            discount = max(discount, 25 if unsold > 90 else 15)
        if discount:
            action_parts.append("Remove from stock" if status == "expired" else f"Discount {discount}%")
        reorder_cost = 0.0
        if reorder_point is not None and qty <= reorder_point:
            reasons.append(f"only {qty:.0f} left (reorder point {reorder_point:.0f})")
            if status == "ok":
                status = "low_stock"
            if reorder_qty:
                reorder_cost = reorder_qty * unit_cost
                action_parts.append(f"Reorder {reorder_qty:.0f} units ({rs(reorder_cost)})")
            else:
                action_parts.append("Reorder")
        if not reasons:
            continue
        alerts.append({
            "item": str(r["item"]),
            "qty": int(qty),
            "unit_cost": unit_cost,
            "stock_value": round(qty * unit_cost, 2),
            "days_to_expiry": to_expiry,
            "days_since_last_sale": unsold,
            "status": status,
            "reasons": reasons,
            "suggested_discount_pct": discount,
            "reorder_qty": int(reorder_qty) if reorder_qty else None,
            "reorder_cost": round(reorder_cost, 2),
            "action": " + ".join(action_parts) if action_parts else "Review",
        })
    rank = {"expired": 0, "near_expiry": 1, "low_stock": 2, "slow_moving": 3}
    alerts.sort(key=lambda a: (rank.get(a["status"], 9), -a["stock_value"]))
    at_risk = round(sum(a["stock_value"] for a in alerts if a["status"] != "low_stock"), 2)
    reorder_total = round(sum(a["reorder_cost"] for a in alerts), 2)
    summary = {
        "total_items": int(len(df)),
        "flagged_items": len(alerts),
        "expired": sum(a["status"] == "expired" for a in alerts),
        "near_expiry": sum(a["status"] == "near_expiry" for a in alerts),
        "low_stock": sum(a["status"] == "low_stock" for a in alerts),
        "slow_moving": sum(a["status"] == "slow_moving" for a in alerts),
        "stock_value_at_risk": at_risk,
        "reorder_cost": reorder_total,
    }
    text = (f"{len(alerts)} of {len(df)} items need attention. Reordering the low-stock items costs "
            f"{rs(reorder_total)}." if alerts else "No items need attention right now.")
    return {"source": source, "summary": summary, "alerts": alerts, "message": text}


if __name__ == "__main__":
    import json
    print(json.dumps(get_inventory_alerts(), indent=2, default=str))
