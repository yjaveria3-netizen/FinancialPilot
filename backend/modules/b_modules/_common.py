"""Small shared helpers for Member B modules."""
from __future__ import annotations

from pathlib import Path

# .../backend/modules/b_modules/_common.py -> parents[2] is the backend folder
BACKEND_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BACKEND_DIR / "data"


def ask_safe(prompt: str, fallback: str) -> str:
    """Ask Gemini. If it fails for any reason, return the fallback text instead."""
    try:
        try:
            from backend.services.gemini import ask
        except ImportError:
            from services.gemini import ask
        text = ask(prompt)
        if not text or "unavailable" in text.lower():
            return fallback
        return text
    except Exception:
        return fallback


def get_forecast(days: int = 30):
    """Call Member A's forecast function."""
    from backend.modules.a_modules.cash_forecast import forecast_cash
    return forecast_cash(days=days)


def rs(x) -> str:
    return f"Rs. {x:,.0f}"
