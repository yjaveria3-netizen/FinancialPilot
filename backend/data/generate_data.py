"""
FinPilot Synthetic Data Generator
Owner: Member A
Run: python generate_data.py
Outputs mock CSVs labelled [SYNTHETIC DATA] in the /data folder.
"""
import pandas as pd
import numpy as np
from pathlib import Path
import random
from datetime import datetime, timedelta

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
random.seed(RANDOM_SEED)

DATA_DIR = Path(__file__).parent
LABEL = "[SYNTHETIC DATA]"
N_DAYS = 365
START_DATE = datetime(2024, 1, 1)


def date_range(n=N_DAYS):
    return [START_DATE + timedelta(days=i) for i in range(n)]


def generate_transactions():
    """transactions.csv — daily revenue & expense ledger"""
    rows = []
    dates = date_range()
    categories_in  = ["Sales", "Service Revenue", "Refund Received"]
    categories_out = ["Rent", "Salaries", "Utilities", "Marketing", "Supplier Payment", "Tax"]
    for d in dates:
        # 1-3 income entries
        for _ in range(random.randint(1, 3)):
            rows.append({
                "data_label":  LABEL,
                "date":        d.strftime("%Y-%m-%d"),
                "transaction_id": f"TXN-{len(rows)+1:05d}",
                "type":        "income",
                "category":    random.choice(categories_in),
                "amount":      round(random.uniform(500, 8000), 2),
                "description": "Auto-generated income transaction",
                "account":     "Main Checking",
                "status":      random.choice(["cleared", "pending"]),
            })
        # 0-2 expense entries
        for _ in range(random.randint(0, 2)):
            rows.append({
                "data_label":  LABEL,
                "date":        d.strftime("%Y-%m-%d"),
                "transaction_id": f"TXN-{len(rows)+1:05d}",
                "type":        "expense",
                "category":    random.choice(categories_out),
                "amount":      round(random.uniform(100, 3000), 2),
                "description": "Auto-generated expense transaction",
                "account":     "Main Checking",
                "status":      random.choice(["cleared", "pending"]),
            })
    # Inject benchmark unusual payment anomalies (z > 2.5)
    rows.append({
        "data_label":  LABEL,
        "date":        "2024-11-15",
        "transaction_id": f"TXN-{len(rows)+1:05d}",
        "type":        "expense",
        "category":    "Supplier Payment",
        "amount":      18450.00,
        "description": "Emergency bulk fabric procurement",
        "account":     "Main Checking",
        "status":      "cleared",
    })
    rows.append({
        "data_label":  LABEL,
        "date":        "2024-11-28",
        "transaction_id": f"TXN-{len(rows)+1:05d}",
        "type":        "expense",
        "category":    "Marketing",
        "amount":      8900.00,
        "description": "Unbudgeted Q4 agency blitz campaign",
        "account":     "Main Checking",
        "status":      "cleared",
    })
    rows.append({
        "data_label":  LABEL,
        "date":        "2024-12-05",
        "transaction_id": f"TXN-{len(rows)+1:05d}",
        "type":        "expense",
        "category":    "Utilities",
        "amount":      4850.00,
        "description": "Spike in industrial facility heating and power",
        "account":     "Main Checking",
        "status":      "cleared",
    })
    rows.append({
        "data_label":  LABEL,
        "date":        "2024-12-18",
        "transaction_id": f"TXN-{len(rows)+1:05d}",
        "type":        "expense",
        "category":    "Salaries",
        "amount":      4100.00,
        "description": "Year-end overtime disbursement",
        "account":     "Main Checking",
        "status":      "cleared",
    })
    df = pd.DataFrame(rows)
    df.to_csv(DATA_DIR / "transactions.csv", index=False)
    print(f"Generated transactions.csv ({len(df)} rows)")


def generate_invoices():
    """invoices.csv — accounts receivable"""
    rows = []
    statuses = ["paid", "unpaid", "overdue", "draft"]
    for i in range(1, 201):
        issue = START_DATE + timedelta(days=random.randint(0, N_DAYS - 30))
        due   = issue + timedelta(days=random.randint(15, 60))
        status = random.choice(statuses)
        paid_date = (due + timedelta(days=random.randint(-5, 30))).strftime("%Y-%m-%d") if status == "paid" else ""
        rows.append({
            "data_label":   LABEL,
            "invoice_id":   f"INV-{i:04d}",
            "customer_id":  f"CUST-{random.randint(1,50):03d}",
            "issue_date":   issue.strftime("%Y-%m-%d"),
            "due_date":     due.strftime("%Y-%m-%d"),
            "amount":       round(random.uniform(200, 12000), 2),
            "status":       status,
            "paid_date":    paid_date,
            "description":  "Professional services",
        })
    # Inject benchmark duplicate invoice anomalies
    rows.append({
        "data_label":   LABEL,
        "invoice_id":   "INV-0201",
        "customer_id":  "CUST-012",
        "issue_date":   "2024-10-12",
        "due_date":     "2024-11-12",
        "amount":       8450.00,
        "status":       "unpaid",
        "paid_date":    "",
        "description":  "Garment manufacturing - Batch 41",
    })
    rows.append({
        "data_label":   LABEL,
        "invoice_id":   "INV-0202",
        "customer_id":  "CUST-012",
        "issue_date":   "2024-10-15",
        "due_date":     "2024-11-15",
        "amount":       8450.00,
        "status":       "unpaid",
        "paid_date":    "",
        "description":  "Garment manufacturing - Batch 41 duplicate",
    })
    rows.append({
        "data_label":   LABEL,
        "invoice_id":   "INV-0203",
        "customer_id":  "CUST-038",
        "issue_date":   "2024-09-02",
        "due_date":     "2024-10-02",
        "amount":       3210.50,
        "status":       "overdue",
        "paid_date":    "",
        "description":  "Raw textile finishing services",
    })
    rows.append({
        "data_label":   LABEL,
        "invoice_id":   "INV-0204",
        "customer_id":  "CUST-038",
        "issue_date":   "2024-09-06",
        "due_date":     "2024-10-06",
        "amount":       3210.50,
        "status":       "overdue",
        "paid_date":    "",
        "description":  "Raw textile finishing services duplicate",
    })
    df = pd.DataFrame(rows)
    df.to_csv(DATA_DIR / "invoices.csv", index=False)
    print(f"Generated invoices.csv ({len(df)} rows)")


def generate_customers():
    """customers.csv — customer master"""
    rows = []
    industries = ["Retail", "Healthcare", "Tech", "Real Estate", "Manufacturing"]
    for i in range(1, 51):
        rows.append({
            "data_label":   LABEL,
            "customer_id":  f"CUST-{i:03d}",
            "name":         f"Customer {i} LLC",
            "industry":     random.choice(industries),
            "credit_limit": round(random.uniform(5000, 50000), 2),
            "payment_terms": random.choice(["Net 15", "Net 30", "Net 60"]),
            "since":        (START_DATE - timedelta(days=random.randint(0, 730))).strftime("%Y-%m-%d"),
            "email":        f"billing@customer{i}.com",
            "phone":        f"+1-555-{random.randint(1000,9999)}",
        })
    df = pd.DataFrame(rows)
    df.to_csv(DATA_DIR / "customers.csv", index=False)
    print(f"Generated customers.csv ({len(df)} rows)")


def generate_suppliers():
    """suppliers.csv — vendor master"""
    rows = []
    categories = ["Raw Materials", "Services", "Logistics", "Technology", "Utilities"]
    for i in range(1, 31):
        rows.append({
            "data_label":   LABEL,
            "supplier_id":  f"SUP-{i:03d}",
            "name":         f"Supplier {i} Inc.",
            "category":     random.choice(categories),
            "payment_terms": random.choice(["Net 30", "Net 45", "Net 60"]),
            "avg_lead_days": random.randint(3, 30),
            "contact_email": f"accounts@supplier{i}.com",
            "phone":         f"+1-555-{random.randint(1000,9999)}",
            "reliability_score": round(random.uniform(70, 100), 1),
        })
    df = pd.DataFrame(rows)
    df.to_csv(DATA_DIR / "suppliers.csv", index=False)
    print(f"Generated suppliers.csv ({len(df)} rows)")


def generate_inventory():
    """inventory.csv — stock levels"""
    rows = []
    for i in range(1, 51):
        reorder = random.randint(10, 50)
        qty     = random.randint(0, 200)
        rows.append({
            "data_label":   LABEL,
            "sku":          f"SKU-{i:04d}",
            "product_id":   f"PROD-{i:04d}",
            "quantity_on_hand": qty,
            "reorder_point": reorder,
            "reorder_qty":  random.randint(20, 100),
            "unit_cost":    round(random.uniform(5, 500), 2),
            "warehouse":    random.choice(["WH-A", "WH-B", "WH-C"]),
            "last_updated": (START_DATE + timedelta(days=random.randint(300, 364))).strftime("%Y-%m-%d"),
            "low_stock_flag": qty <= reorder,
        })
    df = pd.DataFrame(rows)
    df.to_csv(DATA_DIR / "inventory.csv", index=False)
    print(f"Generated inventory.csv ({len(df)} rows)")


def generate_products():
    """products.csv — product catalog"""
    rows = []
    categories = ["Software", "Hardware", "Consulting", "Support", "Training"]
    for i in range(1, 51):
        cost = round(random.uniform(10, 300), 2)
        price = round(cost * random.uniform(1.3, 2.5), 2)
        rows.append({
            "data_label":   LABEL,
            "product_id":   f"PROD-{i:04d}",
            "name":         f"Product {i}",
            "category":     random.choice(categories),
            "unit_price":   price,
            "unit_cost":    cost,
            "margin_pct":   round((price - cost) / price * 100, 1),
            "is_active":    random.choice([True, True, True, False]),
            "supplier_id":  f"SUP-{random.randint(1,30):03d}",
        })
    df = pd.DataFrame(rows)
    df.to_csv(DATA_DIR / "products.csv", index=False)
    print(f"Generated products.csv ({len(df)} rows)")


def regenerate_all_data():
    """Programmatic helper to re-run all synthetic generators."""
    generate_transactions()
    generate_invoices()
    generate_customers()
    generate_suppliers()
    generate_inventory()
    generate_products()
    return {
        "status": "ok",
        "message": "Demo datasets successfully regenerated and synced.",
        "timestamp": datetime.now().isoformat(),
        "files_updated": [
            "transactions.csv",
            "invoices.csv",
            "customers.csv",
            "suppliers.csv",
            "inventory.csv",
            "products.csv"
        ]
    }


if __name__ == "__main__":
    print("Generating FinPilot synthetic datasets...")
    res = regenerate_all_data()
    print("Done. All CSVs written to:", DATA_DIR)

