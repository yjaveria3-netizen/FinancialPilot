# FinPilot Data Schema Contract
> **IMPORTANT:** Both Member A and Member B must read and agree to this schema before adding columns. All changes require a PR review from both members.

## transactions.csv
| Column | Type | Description |
|---|---|---|
| data_label | str | Always `[SYNTHETIC DATA]` |
| date | YYYY-MM-DD | Transaction date |
| transaction_id | str | Unique ID (TXN-XXXXX) |
| type | str | `income` or `expense` |
| category | str | Revenue/expense category |
| amount | float | Positive value in USD |
| description | str | Free-text note |
| account | str | Bank account name |
| status | str | `cleared` or `pending` |

## invoices.csv
| Column | Type | Description |
|---|---|---|
| data_label | str | Always `[SYNTHETIC DATA]` |
| invoice_id | str | Unique ID (INV-XXXX) |
| customer_id | str | FK → customers.customer_id |
| issue_date | YYYY-MM-DD | Date issued |
| due_date | YYYY-MM-DD | Payment due date |
| amount | float | Invoice total in USD |
| status | str | `paid`, `unpaid`, `overdue`, `draft` |
| paid_date | YYYY-MM-DD or empty | Date payment received |
| description | str | Service description |

## customers.csv
| Column | Type | Description |
|---|---|---|
| data_label | str | Always `[SYNTHETIC DATA]` |
| customer_id | str | Unique ID (CUST-XXX) |
| name | str | Business name |
| industry | str | Sector |
| credit_limit | float | Max credit in USD |
| payment_terms | str | e.g. `Net 30` |
| since | YYYY-MM-DD | Customer since date |
| email | str | Billing contact |
| phone | str | Phone number |

## suppliers.csv
| Column | Type | Description |
|---|---|---|
| data_label | str | Always `[SYNTHETIC DATA]` |
| supplier_id | str | Unique ID (SUP-XXX) |
| name | str | Supplier name |
| category | str | Supply category |
| payment_terms | str | e.g. `Net 45` |
| avg_lead_days | int | Average delivery lead time |
| contact_email | str | AP contact email |
| phone | str | Phone number |
| reliability_score | float | 0–100 score |

## inventory.csv
| Column | Type | Description |
|---|---|---|
| data_label | str | Always `[SYNTHETIC DATA]` |
| sku | str | Stock-keeping unit |
| product_id | str | FK → products.product_id |
| quantity_on_hand | int | Current stock count |
| reorder_point | int | Trigger reorder below this |
| reorder_qty | int | Quantity to order |
| unit_cost | float | Cost per unit |
| warehouse | str | Storage location |
| last_updated | YYYY-MM-DD | Last inventory update |
| low_stock_flag | bool | True if below reorder_point |

## products.csv
| Column | Type | Description |
|---|---|---|
| data_label | str | Always `[SYNTHETIC DATA]` |
| product_id | str | Unique ID (PROD-XXXX) |
| name | str | Product name |
| category | str | Product category |
| unit_price | float | Selling price |
| unit_cost | float | Cost to produce/procure |
| margin_pct | float | Gross margin percentage |
| is_active | bool | Actively sold? |
| supplier_id | str | FK → suppliers.supplier_id |
