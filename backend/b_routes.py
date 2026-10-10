"""
Member B API routes. main.py only needs:
    from backend.b_routes import router as b_router
    app.include_router(b_router)
"""
import traceback

from fastapi import APIRouter, File, HTTPException, Query, UploadFile

from backend.modules.b_modules._common import get_forecast
from backend.modules.b_modules.ai_cfo_chat import SUGGESTED_QUESTIONS, cfo_chat
from backend.modules.b_modules.group_buying import get_group_buying
from backend.modules.b_modules.inventory_alerts import get_inventory_alerts
from backend.modules.b_modules.invoice_scanner import extract_invoice, save_to_ledger
from backend.modules.b_modules.negotiation_copilot import build_negotiation
from backend.modules.b_modules.pricing_advisor import suggest_price
from backend.modules.b_modules.procure import _balances, get_procurement_plan

router = APIRouter()
TAG = ["Member B - Procurement & Ops"]


def _fail(label: str, e: Exception):
    if isinstance(e, HTTPException):
        raise e
    if isinstance(e, FileNotFoundError):
        raise HTTPException(status_code=404, detail=f"Data file not found: {e}. Run generate_data.py first.")
    if isinstance(e, ValueError):
        raise HTTPException(status_code=422, detail=f"{label}: {e}")
    traceback.print_exc()
    raise HTTPException(status_code=500, detail=f"{label} error: {e}")


def _clean_suppliers(raw):
    """Validate suppliers typed in by the user on the page."""
    if not raw:
        return None
    out = []
    for s in raw:
        try:
            out.append({
                "name": str(s["name"]).strip() or "Supplier",
                "price": float(s["price"]),
                "lead_days": float(s["lead_days"]),
                "defect_rate": float(s["defect_rate"]),
            })
        except (KeyError, TypeError, ValueError):
            raise ValueError("each supplier needs name, price, lead_days, defect_rate (numbers)")
        if out[-1]["price"] <= 0 or not 0 <= out[-1]["defect_rate"] < 1:
            raise ValueError("price must be > 0 and defect_rate between 0 and 1 (0.05 = 5%)")
    return out


def _shifted_forecast(days, starting_cash):
    """Today's forecast, optionally re-based to a different starting cash (what-if)."""
    bal = _balances(get_forecast(days))
    if starting_cash is not None:
        delta = starting_cash - bal[0]
        bal = [b + delta for b in bal]
    return bal


@router.get("/api/procure-ai", tags=TAG)
def procure_ai(qty: int = Query(1000, ge=1), days: int = Query(30, ge=1, le=365),
               starting_cash: float | None = Query(None, description="What-if: change today's cash"),
               safety_buffer: float = Query(50000, ge=0),
               delay_cost_per_day: float = Query(1000, ge=0)):
    try:
        return get_procurement_plan(_shifted_forecast(days, starting_cash), qty=qty,
                                    safety_buffer=safety_buffer,
                                    delay_cost_per_day=delay_cost_per_day, horizon_days=days)
    except Exception as e:
        _fail("ProcureAI", e)


@router.post("/api/procure-ai/simulate", tags=TAG)
def procure_ai_simulate(body: dict):
    """
    Live what-if for the demo. Every field is optional:
    {"qty": 1000, "days": 30, "starting_cash": 300000, "safety_buffer": 50000,
     "delay_cost_per_day": 1000,
     "suppliers": [{"name": "A", "price": 80, "lead_days": 14, "defect_rate": 0.12}, ...]}
    """
    try:
        days = int(body.get("days", 30))
        sc = body.get("starting_cash")
        return get_procurement_plan(
            _shifted_forecast(days, float(sc) if sc not in (None, "") else None),
            qty=int(body.get("qty", 1000)),
            suppliers=_clean_suppliers(body.get("suppliers")),
            safety_buffer=float(body.get("safety_buffer", 50000)),
            delay_cost_per_day=float(body.get("delay_cost_per_day", 1000)),
            horizon_days=days,
            explain=bool(body.get("explain", True)),
        )
    except Exception as e:
        _fail("ProcureAI simulate", e)


@router.get("/api/inventory-alerts", tags=TAG)
def inventory_alerts(expiry_days: int = Query(30, ge=1), slow_days: int = Query(60, ge=1)):
    try:
        return get_inventory_alerts(expiry_days=expiry_days, slow_days=slow_days)
    except Exception as e:
        _fail("Inventory alerts", e)


@router.post("/api/cfo-chat", tags=TAG)
def cfo_chat_endpoint(body: dict):
    """Body: {"question": "...", "history": [{"role": "user", "content": "..."}]}"""
    try:
        question = body.get("question") or body.get("message") or body.get("prompt") or ""
        return cfo_chat(question, body.get("history"))
    except Exception as e:
        _fail("CFO chat", e)


@router.get("/api/cfo-suggestions", tags=TAG)
def cfo_suggestions():
    return {"questions": SUGGESTED_QUESTIONS}


@router.get("/api/pricing-advisor", tags=TAG)
def pricing_advisor(cost: float = Query(..., gt=0), margin: float = Query(0.25, ge=0, le=5),
                    competitor_price: float | None = Query(None, gt=0),
                    explain: bool = Query(False, description="true = ask Gemini to explain")):
    try:
        return suggest_price(cost, margin, competitor_price, explain=explain)
    except Exception as e:
        _fail("Pricing advisor", e)


@router.post("/api/negotiation", tags=TAG)
def negotiation(body: dict):
    """Body: {"supplier","item","past_price","competitor_quote","qty"}"""
    try:
        return build_negotiation(
            supplier=body.get("supplier", "Supplier"),
            item=body.get("item", "goods"),
            past_price=float(body["past_price"]),
            competitor_quote=float(body["competitor_quote"]) if body.get("competitor_quote") else None,
            qty=int(body.get("qty", 1000)),
        )
    except KeyError as e:
        raise HTTPException(status_code=422, detail=f"Missing field: {e}")
    except Exception as e:
        _fail("Negotiation copilot", e)


@router.post("/api/invoice-scan", tags=TAG)
async def invoice_scan(file: UploadFile = File(...)):
    try:
        return extract_invoice(await file.read())
    except Exception as e:
        _fail("Invoice scanner", e)


@router.post("/api/invoice-save", tags=TAG)
def invoice_save(body: dict):
    try:
        return save_to_ledger(body)
    except Exception as e:
        _fail("Invoice save", e)


@router.get("/api/group-buying", tags=TAG)
def group_buying():
    try:
        return get_group_buying()
    except Exception as e:
        _fail("Group buying", e)
