"""
FinPilot — WhatsApp Automation Router (Disabled)
Module: /backend/routers/whatsapp.py
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

from backend.services.whatsapp_automation import (
    get_connection_status,
    save_connection_state,
    disconnect_session,
    generate_pairing_qr,
)

router = APIRouter(prefix="/api/whatsapp", tags=["WhatsApp Automation"])


class ConnectPayload(BaseModel):
    phone: Optional[str] = None
    sender_name: Optional[str] = None


class QrRequestPayload(BaseModel):
    phone: Optional[str] = None


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
    """Returns current paired device status."""
    return get_connection_status()


@router.post("/qr-code")
async def request_pairing_qr(payload: Optional[QrRequestPayload] = None):
    """Generates an authentic scannable QR Code data URL for linking."""
    phone = payload.phone if payload else "+92 3224154788"
    return await generate_pairing_qr(phone)


@router.post("/confirm-pairing")
def confirm_device_pairing(payload: ConnectPayload):
    """Confirms device pairing."""
    return save_connection_state(payload.phone or "+92 3224154788", payload.sender_name)


@router.post("/disconnect")
def disconnect_device():
    """Unlinks current WhatsApp device."""
    return disconnect_session()


@router.post("/launch-login-window")
def launch_login_window():
    """Feature disabled."""
    return {
        "status": "disabled",
        "message": "WhatsApp desktop login window is disabled."
    }


# In-memory dispatch status cache
_LATEST_DISPATCH_LOG: dict = {
    "status": "disabled",
    "last_run": None,
    "dispatched_count": 0,
    "total": 0,
    "message": "WhatsApp feature is disabled."
}


@router.post("/bulk-send")
async def bulk_send_whatsapp_reminders(payload: BulkSendPayload):
    """Returns disabled status immediately without scheduling background tasks."""
    return {
        "status": "disabled",
        "message": "WhatsApp bulk sending is currently disabled.",
        "queued_targets": 0,
        "dispatched_at": datetime.now().isoformat(),
        "mode": "disabled"
    }


@router.get("/status")
def get_whatsapp_automation_status():
    """Returns the telemetry log."""
    return _LATEST_DISPATCH_LOG
