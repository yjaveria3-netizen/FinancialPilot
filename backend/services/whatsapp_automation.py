"""
FinPilot — WhatsApp Automation Service (Playwright Removed & Feature Disabled)
Module: /backend/services/whatsapp_automation.py
"""
from pathlib import Path
from datetime import datetime
import json
import io
import base64
import os
import re

try:
    import qrcode
except ImportError:
    qrcode = None

SESSION_DIR = Path(__file__).resolve().parents[1] / "whatsapp_session"
STATE_FILE = SESSION_DIR / "connection_state.json"

os.makedirs(SESSION_DIR, exist_ok=True)


def get_connection_status() -> dict:
    """Retrieves current WhatsApp device status (Disabled)."""
    return {
        "connected": False,
        "phone": None,
        "clean_phone": None,
        "sender_name": None,
        "linked_at": None,
        "session_active": False,
        "status": "disabled",
        "message": "WhatsApp automation feature is currently disabled."
    }


def save_connection_state(phone: str, sender_name: str = "Connected Mobile") -> dict:
    """Disabled connection state saver."""
    return {
        "connected": False,
        "status": "disabled",
        "message": "WhatsApp feature is disabled."
    }


def disconnect_session() -> dict:
    """Disconnects session."""
    return {
        "connected": False,
        "phone": None,
        "clean_phone": None,
        "sender_name": None,
        "linked_at": None,
        "session_active": False,
        "status": "disconnected"
    }


async def generate_pairing_qr(phone: str | None = None) -> dict:
    """Static/local fallback QR generator without any browser/Playwright dependencies."""
    clean = clean_phone_number(phone)
    ts = int(datetime.now().timestamp())
    pairing_code = f"2@finpilot-auth,{clean},{ts}"
    qr_data_url = ""

    if qrcode is not None:
        try:
            qr = qrcode.QRCode(version=1, box_size=8, border=2)
            qr.add_data(f"https://wa.me/qr/FINPILOT?phone={clean}&ref={ts}")
            qr.make(fit=True)
            img = qr.make_image(fill_color="#1D0B12", back_color="#FFFFFF")
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
            qr_data_url = f"data:image/png;base64,{b64}"
        except Exception:
            pass

    return {
        "status": "disabled",
        "qr_code_base64": qr_data_url,
        "pairing_ref": pairing_code,
        "phone": phone or "+92 3224154788",
        "is_live_official_qr": False,
        "message": "WhatsApp automation is disabled.",
        "generated_at": datetime.now().isoformat(),
        "expires_in_seconds": 0
    }


def clean_phone_number(phone: str | None) -> str:
    """Sanitizes phone input into international digits."""
    if not phone:
        return "923224154788"
    digits = re.sub(r"[^\d]", "", str(phone))
    if len(digits) == 11 and digits.startswith("03"):
        return f"92{digits[1:]}"
    if len(digits) == 10 and not digits.startswith("1"):
        return f"1{digits}"
    return digits or "923224154788"


async def send_bulk_reminders(reminders_list: list[dict]) -> dict:
    """
    Simulated dispatch without Playwright.
    Playwright has been completely removed.
    """
    return {
        "status": "disabled",
        "total_targets": len(reminders_list),
        "dispatched_count": 0,
        "failed_count": 0,
        "details": [],
        "message": "WhatsApp automated sending is currently disabled.",
        "timestamp": datetime.now().isoformat(),
        "finished_at": datetime.now().isoformat()
    }
