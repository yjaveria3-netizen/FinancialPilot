"""
FinPilot — Member A Module: Anomaly and Fraud Guard

Detects duplicate invoices, unusual cash outflows (statistical z-score > 2.5),
and supplier price spikes compared to historical median prices.

FUNCTION CONTRACT:
  detect_anomalies() -> list[dict]
    Output: List of dictionaries with:
            - id: str
            - category: str ("Duplicate", "Unusual Payment", "Price Spike")
            - severity: str ("Low", "Medium", "High")
            - item_reference: str
            - amount: float
            - reason: str
            - date: str
            - entity: str
            - status: str

UI RULE: Pure Python and Pandas. No UI framework imports.
"""
from pathlib import Path
import pandas as pd
import numpy as np

DATA_DIR = Path(__file__).parents[2] / "data"


def _load_csv(filename: str) -> pd.DataFrame:
    path = DATA_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Required CSV not found: {path}")
    return pd.read_csv(path)


def detect_anomalies() -> list[dict]:
    """
    Detects financial anomalies and fraud risks across invoices, transactions, and suppliers.
    
    Detection Rules:
    1. Duplicate Invoices: Identical invoice amounts and vendor/customer names within a short date window (<= 14 days).
    2. Unusual Payments: Cash outflow transactions with statistical z-score > 2.5 vs historical averages.
    3. Supplier Price Spikes: Sudden unit cost increases in inventory/supplies vs historical median baseline.
    
    Returns:
        list[dict]: Structured list of flagged anomalies with severity, reference, amount, and reason.
    """
    anomalies: list[dict] = []

    # ──────────────────────────────────────────────────────────────────────────
    # 1. Duplicate Invoices Detection
    # ──────────────────────────────────────────────────────────────────────────
    try:
        inv_df = _load_csv("invoices.csv")
        cust_df = _load_csv("customers.csv") if (DATA_DIR / "customers.csv").exists() else None

        inv_df["amount"] = pd.to_numeric(inv_df["amount"], errors="coerce").fillna(0)
        inv_df["issue_date"] = pd.to_datetime(inv_df["issue_date"], errors="coerce")

        if cust_df is not None and "customer_id" in cust_df.columns and "name" in cust_df.columns:
            inv_df = inv_df.merge(cust_df[["customer_id", "name"]], on="customer_id", how="left")
            inv_df["vendor_name"] = inv_df["name"].fillna(inv_df["customer_id"])
        else:
            inv_df["vendor_name"] = inv_df["customer_id"].astype(str)

        # Sort by amount then issue_date to efficiently find duplicates
        valid_inv = inv_df.dropna(subset=["issue_date"]).sort_values(by=["amount", "issue_date"]).reset_index(drop=True)
        dup_count = 0

        for i in range(len(valid_inv)):
            for j in range(i + 1, len(valid_inv)):
                diff_amount = abs(valid_inv.loc[i, "amount"] - valid_inv.loc[j, "amount"])
                if diff_amount > 0.01:
                    break

                # Same vendor/customer within short date window (14 days)
                same_vendor = valid_inv.loc[i, "vendor_name"] == valid_inv.loc[j, "vendor_name"]
                diff_days = abs((valid_inv.loc[j, "issue_date"] - valid_inv.loc[i, "issue_date"]).days)

                if same_vendor and diff_days <= 14:
                    dup_count += 1
                    amt = float(valid_inv.loc[j, "amount"])
                    inv1_id = str(valid_inv.loc[i, "invoice_id"])
                    inv2_id = str(valid_inv.loc[j, "invoice_id"])
                    vendor = str(valid_inv.loc[j, "vendor_name"])
                    date1_str = valid_inv.loc[i, "issue_date"].strftime("%Y-%m-%d")
                    date2_str = valid_inv.loc[j, "issue_date"].strftime("%Y-%m-%d")

                    severity = "High" if amt >= 5000 else "Medium" if amt >= 1500 else "Low"

                    reason = (
                        f"Identical invoice amount of Rs. {amt:,.2f} billed to {vendor} twice within {diff_days} days "
                        f"({inv1_id} on {date1_str} and {inv2_id} on {date2_str}). "
                        f"Possible duplicate billing or batch entry error."
                    )

                    anomalies.append({
                        "id": f"ANOM-DUP-{dup_count:03d}",
                        "category": "Duplicate",
                        "severity": severity,
                        "item_reference": f"{inv1_id} / {inv2_id}",
                        "amount": amt,
                        "reason": reason,
                        "date": date2_str,
                        "entity": vendor,
                        "status": "Review Required",
                    })
    except Exception as e:
        print(f"[AnomalyGuard] Warning: Duplicate invoice check encountered error: {e}")

    # ──────────────────────────────────────────────────────────────────────────
    # 2. Unusual Payments Detection (Statistical Outflows: z > 2.5)
    # ──────────────────────────────────────────────────────────────────────────
    try:
        txn_df = _load_csv("transactions.csv")
        expenses = txn_df[txn_df["type"].astype(str).str.lower() == "expense"].copy()
        expenses["amount"] = pd.to_numeric(expenses["amount"], errors="coerce").fillna(0)

        if len(expenses) >= 5:
            mean_outflow = expenses["amount"].mean()
            std_outflow = expenses["amount"].std()

            if std_outflow > 0:
                expenses["z_score"] = (expenses["amount"] - mean_outflow) / std_outflow
                outliers = expenses[expenses["z_score"] > 2.5].sort_values("z_score", ascending=False)

                pay_count = 0
                for _, row in outliers.iterrows():
                    pay_count += 1
                    amt = float(row["amount"])
                    z_val = float(row["z_score"])
                    category = str(row.get("category", "Expense"))
                    desc = str(row.get("description", "Disbursement"))
                    txn_id = str(row.get("transaction_id", f"TXN-{pay_count}"))
                    txn_date = str(row.get("date", "N/A"))

                    severity = "High" if z_val >= 4.0 else "Medium" if z_val >= 2.8 else "Low"

                    reason = (
                        f"Outflow payment of Rs. {amt:,.2f} for {category} ('{desc}') deviates {z_val:.2f} standard deviations "
                        f"from the historical outflow mean of Rs. {mean_outflow:,.2f} (z-score: {z_val:.2f} > 2.50 threshold). "
                        f"Unusually large cash outflow."
                    )

                    anomalies.append({
                        "id": f"ANOM-PAY-{pay_count:03d}",
                        "category": "Unusual Payment",
                        "severity": severity,
                        "item_reference": txn_id,
                        "amount": amt,
                        "reason": reason,
                        "date": txn_date,
                        "entity": category,
                        "status": "Flagged Outlier",
                    })
    except Exception as e:
        print(f"[AnomalyGuard] Warning: Unusual payments check encountered error: {e}")

    # ──────────────────────────────────────────────────────────────────────────
    # 3. Supplier Price Spikes Detection (Inventory Unit Cost vs Historical Median)
    # ──────────────────────────────────────────────────────────────────────────
    try:
        supp_df = _load_csv("suppliers.csv")
        prod_df = _load_csv("products.csv") if (DATA_DIR / "products.csv").exists() else None
        inv_df = _load_csv("inventory.csv") if (DATA_DIR / "inventory.csv").exists() else None

        if prod_df is not None and inv_df is not None:
            # Merge current inventory costs with baseline product catalog and supplier info
            merged = inv_df.merge(prod_df, on="product_id", suffixes=("_inv", "_prod"))
            merged = merged.merge(supp_df, on="supplier_id", suffixes=("_prod", "_supp"))

            merged["unit_cost_inv"] = pd.to_numeric(merged["unit_cost_inv"], errors="coerce").fillna(0)
            merged["unit_cost_prod"] = pd.to_numeric(merged["unit_cost_prod"], errors="coerce").fillna(0)
            
            # Avoid division by zero
            valid_items = merged[merged["unit_cost_prod"] > 0].copy()
            valid_items["spike_ratio"] = valid_items["unit_cost_inv"] / valid_items["unit_cost_prod"]
            valid_items["pct_increase"] = (valid_items["spike_ratio"] - 1.0) * 100

            # Filter spikes: unit cost at least 35% above baseline
            spikes = valid_items[valid_items["spike_ratio"] >= 1.35].sort_values("spike_ratio", ascending=False)

            spk_count = 0
            for _, row in spikes.iterrows():
                spk_count += 1
                curr_cost = float(row["unit_cost_inv"])
                base_cost = float(row["unit_cost_prod"])
                pct_inc = float(row["pct_increase"])
                ratio = float(row["spike_ratio"])
                prod_name = str(row.get("name_prod", row.get("product_id")))
                supp_name = str(row.get("name_supp", row.get("name", "Supplier")))
                sku = str(row.get("sku", row.get("product_id")))
                last_updated = str(row.get("last_updated", "N/A"))
                qty = float(row.get("quantity_on_hand", 1))
                exposure = float(round(curr_cost * qty if qty > 0 else curr_cost, 2))

                severity = "High" if ratio >= 2.0 else "Medium" if ratio >= 1.5 else "Low"

                reason = (
                    f"Unit cost for {prod_name} ({sku}) jumped {pct_inc:.1f}% (Rs. {base_cost:,.2f} -> Rs. {curr_cost:,.2f}) "
                    f"from supplier {supp_name}. Historical baseline median is Rs. {base_cost:,.2f}. "
                    f"Potential supplier price gouging or billing discrepancy."
                )

                anomalies.append({
                    "id": f"ANOM-SPK-{spk_count:03d}",
                    "category": "Price Spike",
                    "severity": severity,
                    "item_reference": f"{prod_name} ({sku})",
                    "amount": exposure,
                    "reason": reason,
                    "date": last_updated,
                    "entity": supp_name,
                    "status": "Price Variance",
                })
    except Exception as e:
        print(f"[AnomalyGuard] Warning: Supplier price spikes check encountered error: {e}")

    # ──────────────────────────────────────────────────────────────────────────
    # Sort anomalies: High severity first, then Medium, then Low, then by amount
    # ──────────────────────────────────────────────────────────────────────────
    severity_order = {"High": 0, "Medium": 1, "Low": 2}
    anomalies.sort(key=lambda a: (severity_order.get(a.get("severity", "Low"), 3), -a.get("amount", 0)))

    # Re-index composite display IDs for clean sequence
    for idx, item in enumerate(anomalies, 1):
        item["index"] = idx

    return anomalies
