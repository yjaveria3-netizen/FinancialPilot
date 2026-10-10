"""
FinPilot — Zero-Friction "Simulate Crisis" Demo Trigger Engine
Module: /backend/modules/demo_trigger.py

Injects high-severity mock anomalies and an impending cash crunch
into the active CSV datasets for live judging demonstrations.
"""
from pathlib import Path
from datetime import datetime, timedelta, date
import pandas as pd

DATA_DIR = Path(__file__).parents[1] / "data"
LABEL = "[CRISIS SIMULATION]"


def trigger_crisis_mode() -> dict:
    """
    Scrambles/injects high-severity anomalies and immediate cash crunch into active CSVs.
    """
    today_str = date.today().strftime("%Y-%m-%d")
    yesterday_str = (date.today() - timedelta(days=1)).strftime("%Y-%m-%d")

    injected_expenses = [
        {
            "data_label": LABEL,
            "date": yesterday_str,
            "transaction_id": "TXN-CRISIS-001",
            "type": "expense",
            "category": "Supplier Payment",
            "amount": 29850.00,
            "description": "EMERGENCY OUTFLOW: Industrial loom motor catastrophe replacement",
            "account": "Main Checking",
            "status": "cleared",
        },
        {
            "data_label": LABEL,
            "date": today_str,
            "transaction_id": "TXN-CRISIS-002",
            "type": "expense",
            "category": "Marketing",
            "amount": 16400.00,
            "description": "SUSPICIOUS DISBURSEMENT: Unauthorized agency retainer chargeback",
            "account": "Main Checking",
            "status": "cleared",
        },
        {
            "data_label": LABEL,
            "date": today_str,
            "transaction_id": "TXN-CRISIS-003",
            "type": "expense",
            "category": "Utilities",
            "amount": 12750.00,
            "description": "FACILITY SURCHARGE: Unscheduled regional power surge tariff",
            "account": "Main Checking",
            "status": "cleared",
        },
    ]

    injected_invoices = [
        {
            "data_label": LABEL,
            "invoice_id": "INV-CRISIS-901",
            "customer_id": "CUST-049",
            "issue_date": (date.today() - timedelta(days=45)).strftime("%Y-%m-%d"),
            "due_date": (date.today() - timedelta(days=15)).strftime("%Y-%m-%d"),
            "amount": 18450.00,
            "status": "overdue",
            "paid_date": "",
            "description": "CRISIS INVOICE: High-volume raw textile denim shipment",
        },
        {
            "data_label": LABEL,
            "invoice_id": "INV-CRISIS-902",
            "customer_id": "CUST-049",
            "issue_date": (date.today() - timedelta(days=42)).strftime("%Y-%m-%d"),
            "due_date": (date.today() - timedelta(days=12)).strftime("%Y-%m-%d"),
            "amount": 18450.00,
            "status": "overdue",
            "paid_date": "",
            "description": "CRISIS INVOICE DUPLICATE: Fraudulent duplicate billing batch #902",
        },
    ]

    # 1. Update transactions.csv
    txn_path = DATA_DIR / "transactions.csv"
    if txn_path.exists():
        df_txn = pd.read_csv(txn_path)
        # Avoid duplicate injections
        df_txn = df_txn[~df_txn["transaction_id"].str.startswith("TXN-CRISIS-")]
        df_injected = pd.DataFrame(injected_expenses)
        df_combined = pd.concat([df_txn, df_injected], ignore_index=True)
        df_combined.to_csv(txn_path, index=False)

    # 2. Update invoices.csv
    inv_path = DATA_DIR / "invoices.csv"
    if inv_path.exists():
        df_inv = pd.read_csv(inv_path)
        df_inv = df_inv[~df_inv["invoice_id"].str.startswith("INV-CRISIS-")]
        df_injected_inv = pd.DataFrame(injected_invoices)
        df_combined_inv = pd.concat([df_inv, df_injected_inv], ignore_index=True)
        df_combined_inv.to_csv(inv_path, index=False)

    total_outflow_surge = sum(e["amount"] for e in injected_expenses)
    total_unpaid_overdue = sum(i["amount"] for i in injected_invoices)

    return {
        "status": "CRISIS_SIMULATION_ACTIVE",
        "message": "High-severity crisis simulated: $59,000 cash drain & duplicate billing injected.",
        "timestamp": datetime.now().isoformat(),
        "injected_details": {
            "unplanned_cash_outflows": total_outflow_surge,
            "overdue_duplicate_invoices": total_unpaid_overdue,
            "critical_flags_added": len(injected_expenses) + len(injected_invoices),
            "projected_runway": "Compressed to 4 days (< $5,000 safety threshold breach)",
        },
        "ai_cfo_alert": (
            "🚨 CRITICAL CASH CRUNCH DETECTED: Unplanned outflows of $59,000 have compressed cash reserves. "
            "Buffer breached within 4 days. Emergency liquidity freeze and expedited receivables collections required."
        ),
    }
