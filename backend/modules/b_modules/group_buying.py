"""
Group Buying Network (Member B). SAMPLE data only: label it "sample data" in the UI.
"""
from __future__ import annotations

SAMPLE_ORDERS = [
    {"id": 1, "item": "Cotton fabric (per meter)", "supplier": "Premium Fabrics Co",
     "solo_price": 95, "group_price": 84, "min_total_qty": 5000, "current_qty": 3600,
     "businesses": ["Lahore Garments", "Faisal Stitching", "Noor Textiles"], "closes_in_days": 6,
     "my_qty": 1000},
    {"id": 2, "item": "Polyester thread (cone)", "supplier": "MidRange Textiles",
     "solo_price": 60, "group_price": 51, "min_total_qty": 2000, "current_qty": 2000,
     "businesses": ["Star Tailors", "Ahmed Apparel"], "closes_in_days": 3, "my_qty": 300},
    {"id": 3, "item": "Packaging film (roll)", "supplier": "QuickCheap Traders",
     "solo_price": 700, "group_price": 640, "min_total_qty": 400, "current_qty": 150,
     "businesses": ["City Packers"], "closes_in_days": 10, "my_qty": 40},
]


def get_group_buying() -> dict:
    orders = []
    for o in SAMPLE_ORDERS:
        saving_unit = o["solo_price"] - o["group_price"]
        progress = min(100, round(o["current_qty"] / o["min_total_qty"] * 100))
        orders.append({
            **o,
            "saving_per_unit": saving_unit,
            "saving_pct": round(saving_unit / o["solo_price"] * 100, 1),
            "estimated_saving": saving_unit * o["my_qty"],
            "progress_pct": progress,
            "status": "ready to place" if progress >= 100 else "open",
            "businesses_joined": len(o["businesses"]),
        })
    return {
        "note": "Sample data for the demo.",
        "orders": orders,
        "total_estimated_saving": sum(o["estimated_saving"] for o in orders),
    }


if __name__ == "__main__":
    import json
    print(json.dumps(get_group_buying(), indent=2))
