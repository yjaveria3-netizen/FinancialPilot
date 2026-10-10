"""
FinPilot — WhatsApp Automation Router
Module: /backend/routers/whatsapp.py

Endpoints:
- POST /api/whatsapp/bulk-send:
  Accepts collection queue payload from frontend, schedules Playwright background
  task asynchronously via FastAPI BackgroundTasks, and returns an immediate 200 OK.
- GET /api/whatsapp/status:
  Returns current Playwright session and dispatch telemetry.
"""
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

from backend.services.whatsapp_automation import send_bulk_reminders, clean_phone_number

router = APIRouter(prefix="/api/whatsapp", tags=["WhatsApp Automation"])


class ReminderItem(BaseModel):
    invoice_id: Optional[str] = "INV-0001"
    client_name: Optional[str] = "Client"
    client_phone: Optional[str] = None
    clean_phone: Optional[str] = None
    phone: Optional[str] = None
    amount: Optional[float] = 0.0
    due_date: Optional[str] = None
    days_overdue: Optional[int] = 0
    ai_message: Optional[str] = None
    message: Optional[str] = None


class BulkSendPayload(BaseModel):
    reminders: List[ReminderItem] = Field(default_factory=list)


# In-memory latest dispatch report cache
_LATEST_DISPATCH_LOG: dict = {
    "status": "idle",
    "last_run": None,
    "dispatched_count": 0,
    "total": 0
}


async def _run_background_dispatch(reminders_dicts: list[dict]):
    """Asynchronous worker triggered by BackgroundTasks."""
    global _LATEST_DISPATCH_LOG
    _LATEST_DISPATCH_LOG["status"] = "in_progress"
    _LATEST_DISPATCH_LOG["last_run"] = datetime.now().isoformat()
    _LATEST_DISPATCH_LOG["total"] = len(reminders_dicts)

    try:
        report = await send_bulk_reminders(reminders_dicts)
        _LATEST_DISPATCH_LOG["status"] = "completed"
        _LATEST_DISPATCH_LOG["dispatched_count"] = report.get("dispatched_count", len(reminders_dicts))
        _LATEST_DISPATCH_LOG["report"] = report
    except Exception as e:
        print(f"[WhatsAppRouter] Background dispatch error: {e}")
        _LATEST_DISPATCH_LOG["status"] = "error"
        _LATEST_DISPATCH_LOG["error"] = str(e)


@router.post("/bulk-send")
async def bulk_send_whatsapp_reminders(
    payload: BulkSendPayload,
    background_tasks: BackgroundTasks
):
    """
    Asynchronously queues Playwright bulk WhatsApp dispatch.
    Returns immediately with 200 OK so frontend UI never blocks.
    """
    reminders = payload.reminders
    if not reminders:
        raise HTTPException(status_code=400, detail="Reminders list cannot be empty.")

    reminders_dicts = [r.model_dump() for r in reminders]
    
    # Schedule Playwright dispatch in the background
    background_tasks.add_task(_run_background_dispatch, reminders_dicts)

    return {
        "status": "success",
        "message": "Bulk WhatsApp Queue Dispatched Successfully",
        "queued_targets": len(reminders),
        "dispatched_at": datetime.now().isoformat(),
        "mode": "playwright_background_worker"
    }


@router.get("/status")
def get_whatsapp_automation_status():
    """Returns the telemetry log of the last automated background run."""
    return _LATEST_DISPATCH_LOG
