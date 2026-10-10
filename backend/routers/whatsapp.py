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

from backend.services.whatsapp_automation import (
    send_bulk_reminders,
    clean_phone_number,
    get_connection_status,
    save_connection_state,
    disconnect_session,
    generate_pairing_qr,
)

router = APIRouter(prefix="/api/whatsapp", tags=["WhatsApp Automation"])


class ConnectPayload(BaseModel):
    phone: Optional[str] = "+92 3224154788"
    sender_name: Optional[str] = "Primary Mobile"


class QrRequestPayload(BaseModel):
    phone: Optional[str] = "+92 3224154788"


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


@router.get("/connection")
def get_whatsapp_connection():
    """Returns current paired device status and linked phone number."""
    return get_connection_status()


@router.post("/qr-code")
async def request_pairing_qr(payload: Optional[QrRequestPayload] = None):
    """Generates an authentic scannable QR Code data URL for linking."""
    phone = payload.phone if payload else "+92 3224154788"
    return await generate_pairing_qr(phone)


@router.post("/confirm-pairing")
def confirm_device_pairing(payload: ConnectPayload):
    """Confirms and activates device pairing for automated dispatching."""
    return save_connection_state(payload.phone or "+92 3224154788", payload.sender_name)


@router.post("/disconnect")
def disconnect_device():
    """Unlinks current WhatsApp device."""
    return disconnect_session()


@router.post("/launch-login-window")
def launch_login_window():
    """Launches visible Chrome window so user can scan the official WhatsApp Web QR code."""
    import subprocess
    import sys
    from pathlib import Path
    script_path = str(Path(__file__).resolve().parents[1] / "link_whatsapp.py")
    subprocess.Popen([sys.executable, script_path])
    return {
        "status": "launched",
        "message": "WhatsApp login window opened on desktop. Scan the QR code with your phone to complete setup."
    }



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
