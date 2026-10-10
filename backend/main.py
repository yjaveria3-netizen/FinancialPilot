from dotenv import load_dotenv
load_dotenv()

"""
FinPilot Backend API Server
Framework: FastAPI
Run:  uvicorn backend.main:app --reload --port 8000

All endpoints follow the function contract:
  - Call a pure Python function from a_modules or b_modules
  - Serialize the result to JSON
  - Never contain business logic directly
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import traceback

from backend.modules.a_modules.cash_forecast import forecast_cash
from backend.modules.a_modules.credit_score  import calculate_credit_score
from backend.modules.a_modules.anomaly_guard import detect_anomalies
from backend.modules.a_modules.tax_assistant import calculate_tax_estimates
from backend.modules.a_modules.scenario_planner import run_monte_carlo_simulation
from backend.modules.a_modules.accountant_portal import get_verified_financials
from backend.data.generate_data import regenerate_all_data
from backend.modules.agent_banner import evaluate_proactive_risk
from backend.modules.lender_dossier import compile_lender_dossier
from backend.modules.demo_trigger import trigger_crisis_mode
from backend.modules.whatsapp_agent import get_overdue_invoices, mark_invoice_paid
from backend.routers.whatsapp import router as whatsapp_router

app = FastAPI(
    title="FinPilot API",
    description="Backend API for FinPilot — AI-powered financial intelligence for SMBs.",
    version="1.0.0",
)

app.include_router(whatsapp_router)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allow the React dev server (port 3000 / 5173) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/api/health", tags=["System"])
def health_check():
    """Quick liveness check for the API."""
    return {"status": "ok", "service": "FinPilot API", "version": "1.0.0"}


@app.post("/api/reset-data", tags=["System"])
def reset_demo_data():
    """
    Re-runs the synthetic data generator script to regenerate all CSV datasets
    and returns a success confirmation.
    """
    try:
        result = regenerate_all_data()
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Data regeneration error: {str(e)}")


# ── Autonomous Agent: Proactive Risk & Action Engine ──────────────────────────
@app.get("/api/risk-alert", tags=["Autonomous Agent"])
def get_proactive_risk_alert():
    """
    Evaluates current cash runway, overdue invoices, and high-severity ledger anomalies.
    Returns prioritized alert with automated Gemini action mitigation draft.
    """
    try:
        result = evaluate_proactive_risk()
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Risk alert evaluation error: {str(e)}")


@app.get("/api/export-dossier", tags=["Autonomous Agent"])
def export_lender_dossier():
    """
    Compiles Cash Flow, Credit Readiness, Tax Summary, and Anomaly Audit Log
    into a certified lender-ready compliance dossier with SHA-256 seal.
    """
    try:
        result = compile_lender_dossier()
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Dossier compilation error: {str(e)}")


@app.post("/api/trigger-crisis-mode", tags=["Autonomous Agent"])
def trigger_crisis_simulation():
    """
    Zero-friction demo switch: injects high-severity mock anomalies and cash crunch
    into the active datasets for live judging demonstration.
    """
    try:
        result = trigger_crisis_mode()
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Crisis simulation error: {str(e)}")


# ── Autonomous Agent: WhatsApp Automated Collection & Reconciliation Agent ────
@app.get("/api/whatsapp-reminders", tags=["Autonomous Agent — WhatsApp Collector"])
def get_whatsapp_reminders():
    """
    Returns active collection targets from invoices.csv with calculated days overdue,
    Gemini AI-generated polite reminder copy, and direct WhatsApp Click-to-Chat intent links.
    """
    try:
        result = get_overdue_invoices()
        return result
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=f"Data file not found: {e}. Run /backend/data/generate_data.py first."
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"WhatsApp reminders error: {str(e)}")


@app.post("/api/invoices/{invoice_id}/mark-paid", tags=["Autonomous Agent — WhatsApp Collector"])
def mark_invoice_as_paid(invoice_id: str):
    """
    Updates the invoice status in invoices.csv from Pending/Unpaid/Overdue to 'Paid',
    timestamps paid_date, automatically reconciles cash flow, and removes it
    from the active collection list.
    """
    try:
        result = mark_invoice_paid(invoice_id=invoice_id)
        return result
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=f"Data file not found: {e}."
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Mark paid reconciliation error: {str(e)}")


# ── Member A: Cash Flow Forecaster ────────────────────────────────────────────
@app.get("/api/cash-forecast", tags=["Member A — Cash & Credit"])
def get_cash_forecast(
    days: int = Query(default=30, ge=1, le=365, description="Forecast horizon in days")
):
    """
    Returns a projected cash flow for the next N days.
    Powered by Pandas historical analysis + Gemini AI explanation.
    """
    try:
        result = forecast_cash(days=days)
        return result
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=f"Data file not found: {e}. Run /backend/data/generate_data.py first."
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Cash forecast error: {str(e)}")


# ── Member A: Credit Readiness Score ─────────────────────────────────────────
@app.get("/api/credit-score", tags=["Member A — Cash & Credit"])
def get_credit_score():
    """
    Returns the FinPilot Credit Readiness Score (0–100).
    Evaluates revenue consistency, profit margin, payment behavior, expense control.
    Includes Gemini AI improvement advice.
    """
    try:
        result = calculate_credit_score()
        return result
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=f"Data file not found: {e}. Run /backend/data/generate_data.py first."
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Credit score error: {str(e)}")


# ---- Member B routes ----
from backend.b_routes import router as b_router
app.include_router(b_router)
# ── Member A: Anomaly and Fraud Guard ────────────────────────────────────────
@app.get("/api/anomalies", tags=["Member A — Risk & Compliance"])
def get_anomalies():
    """
    Returns detected financial anomalies & fraud risks.
    Analyzes duplicate invoices, unusual payment outflows (z > 2.5),
    and supplier inventory unit cost spikes.
    """
    try:
        result = detect_anomalies()
        return result
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=f"Data file not found: {e}. Run /backend/data/generate_data.py first."
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Anomaly detection error: {str(e)}")


# ── Member A: Tax and Compliance Assistant ───────────────────────────────────
@app.get("/api/tax-summary", tags=["Member A — Tax & Compliance"])
def get_tax_summary():
    """
    Returns estimated tax liabilities, deductible aggregations,
    upcoming compliance deadlines with countdown days, and a Gemini AI executive summary for accountants.
    """
    try:
        result = calculate_tax_estimates()
        return result
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=f"Data file not found: {e}. Run /backend/data/generate_data.py first."
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Tax summary error: {str(e)}")


# ── Member A: Scenario Planner (Monte Carlo) ─────────────────────────────────
@app.post("/api/simulate-scenario", tags=["Member A — Scenario Modeling"])
def simulate_scenario(body: dict | None = None):
    """
    Executes a multi-variable Monte Carlo simulation covering cash runway,
    procurement price shifts, and hiring payroll.
    Returns percentile confidence fan data (P10 to P90) and Gemini AI executive analysis.
    """
    try:
        result = run_monte_carlo_simulation(params=body or {})
        return result
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=f"Data file not found: {e}. Run /backend/data/generate_data.py first."
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Scenario simulation error: {str(e)}")


# ── Member A: Accountant and Lender Portal ────────────────────────────────────
@app.get("/api/accountant-portal", tags=["Member A — Reporting & Audit"])
def get_portal_financials(
    role: str = Query(default="Auditor", description="Role view: Auditor, Lender, or Accountant"),
    token: str | None = Query(default=None, description="Consent verification token")
):
    """
    Returns GAAP-compliant verified financial statements, underwriting ratios,
    immutable audit logs, and consent access flags.
    """
    try:
        result = get_verified_financials(role=role, consent_token=token)
        return result
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=f"Data file not found: {e}. Run /backend/data/generate_data.py first."
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Accountant portal error: {str(e)}")


# ── Member B Stubs (to be implemented) ────────────────────────────────────────
@app.get("/api/procure-ai", tags=["Member B — Procurement & Ops"])
def get_procure_ai():
    """[Member B Sprint 1] Procurement AI insights."""
    raise HTTPException(status_code=501, detail="Not yet implemented — Member B Sprint 1")


@app.get("/api/inventory-alerts", tags=["Member B — Procurement & Ops"])
def get_inventory_alerts():
    """[Member B Sprint 2] Inventory low-stock alerts."""
    raise HTTPException(status_code=501, detail="Not yet implemented — Member B Sprint 2")


@app.post("/api/cfo-chat", tags=["Member B — Procurement & Ops"])
def cfo_chat(body: dict):
    """[Member B Sprint 1] AI CFO Chat interface."""
    raise HTTPException(status_code=501, detail="Not yet implemented — Member B Sprint 1")
