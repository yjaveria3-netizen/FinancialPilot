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

app = FastAPI(
    title="FinPilot API",
    description="Backend API for FinPilot — AI-powered financial intelligence for SMBs.",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allow the React dev server (port 3000 / 5173) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/api/health", tags=["System"])
def health_check():
    """Quick liveness check for the API."""
    return {"status": "ok", "service": "FinPilot API", "version": "1.0.0"}


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
