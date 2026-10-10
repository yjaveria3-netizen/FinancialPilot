"""
Invoice and Receipt Scanner (Member B). Gemini vision reads the image, the user checks
and edits the fields, then save_to_ledger() stores the row.
"""
from __future__ import annotations

import csv
import io
import json
import os
import re
from datetime import datetime

from ._common import DATA_DIR

PROMPT = (
    "Read this invoice or receipt. Return ONLY JSON with exactly these keys: "
    '"vendor" (string), "date" (YYYY-MM-DD string), "amount" (number, the final total), '
    '"currency" (string like PKR). Use null for anything you cannot read. No other text.'
)


def parse_json_reply(text: str) -> dict:
    """Pull a JSON object out of the model reply, even if wrapped in ``` fences."""
    if not text:
        raise ValueError("empty reply")
    cleaned = re.sub(r"```(?:json)?", "", text).strip()
    start, end = cleaned.find("{"), cleaned.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("no JSON found")
    data = json.loads(cleaned[start:end + 1])
    amount = data.get("amount")
    if isinstance(amount, str):
        m = re.search(r"\d[\d,]*(?:\.\d+)?", amount)
        amount = float(m.group(0).replace(",", "")) if m else None
    return {
        "vendor": data.get("vendor") or "",
        "date": data.get("date") or "",
        "amount": amount,
        "currency": data.get("currency") or "PKR",
    }


def extract_invoice(image_bytes: bytes) -> dict:
    """Returns {"ok": True, "fields": {...}} or {"ok": False, "error": "..."} with empty fields."""
    empty = {"vendor": "", "date": "", "amount": None, "currency": "PKR"}
    try:
        from PIL import Image
        from google import genai
        img = Image.open(io.BytesIO(image_bytes))
        client = genai.Client(api_key=os.environ["GEMINI_KEY"])
        r = client.models.generate_content(model="gemini-2.5-flash", contents=[img, PROMPT])
        return {"ok": True, "fields": parse_json_reply(r.text),
                "note": "Please check the fields before saving."}
    except Exception as e:
        return {"ok": False, "fields": empty,
                "error": f"Could not read the image automatically ({type(e).__name__}). Please type the fields."}


def save_to_ledger(entry: dict) -> dict:
    """Append one row to backend/data/ledger.csv."""
    amount = entry.get("amount")
    try:
        amount = float(amount)
    except (TypeError, ValueError):
        raise ValueError("amount must be a number")
    row = {
        "saved_at": datetime.now().isoformat(timespec="seconds"),
        "vendor": str(entry.get("vendor", "")).strip(),
        "date": str(entry.get("date", "")).strip(),
        "amount": amount,
        "currency": entry.get("currency", "PKR"),
    }
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    path = DATA_DIR / "ledger.csv"
    new_file = not path.exists()
    with open(path, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(row))
        if new_file:
            w.writeheader()
        w.writerow(row)
    return {"saved": True, "row": row}
