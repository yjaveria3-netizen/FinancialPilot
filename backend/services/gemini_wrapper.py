"""
FinPilot Gemini AI Wrapper
Shared service for all modules. Uses direct HTTPS REST API to prevent
gRPC DLL blockages on Windows Application Control environments.
"""
# --- load backend/.env before reading the key ---
from pathlib import Path as _P
from dotenv import load_dotenv as _ld
_ld(_P(__file__).resolve().parents[1] / '.env')
# ---

import os
import json
import urllib.request
import urllib.error


def ask_gemini(
    prompt: str,
    fallback: str = "AI insight unavailable.",
    system_instruction: str = "",
) -> str:
    """
    Send a prompt to Gemini REST API and return the text response.
    Falls back gracefully if the API key is missing or the call fails.

    Args:
        prompt:             The full text prompt.
        fallback:           Text to return on any error or missing key.
        system_instruction: Optional system instruction context.

    Returns:
        str: Gemini's text response or fallback string.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        print("[GeminiWrapper] GEMINI_API_KEY is not set. Using contextual fallback.")
        return fallback

    # Support multiple models, default to gemini-3.8-flash
    model_name = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    
    full_prompt = f"Instructions: {system_instruction}\n\nTask: {prompt}" if system_instruction else prompt
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": full_prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 800,
        }
    }

    try:
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            result = json.loads(response.read().decode("utf-8"))
            candidates = result.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip()
            return fallback
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        print(f"[GeminiWrapper] HTTP error {e.code}: {err_msg}")
        return fallback
    except Exception as e:
        print(f"[GeminiWrapper] Request failed: {e}")
        return fallback
