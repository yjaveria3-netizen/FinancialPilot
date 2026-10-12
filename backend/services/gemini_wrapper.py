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
    fallback: str = "",
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
    if fallback == "AI insight unavailable.":
        fallback = ""
    api_key = (os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_KEY") or "").strip()
    if not api_key:
        print("[GeminiWrapper] Neither GEMINI_API_KEY nor GEMINI_KEY is set. Using contextual fallback.")
        return fallback

    # Support multiple models with automatic fallback on 503/404
    configured = os.getenv("GEMINI_MODEL")
    candidate_models = []
    if configured:
        candidate_models.append(configured)
    for m in ["gemini-flash-latest", "gemini-3.8-flash", "gemini-2.5-flash"]:
        if m not in candidate_models:
            candidate_models.append(m)

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
    data = json.dumps(payload).encode("utf-8")

    for model_name in candidate_models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        try:
            req = urllib.request.Request(
                url,
                data=data,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=20) as response:
                result = json.loads(response.read().decode("utf-8"))
                candidates = result.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "").strip()
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode("utf-8")
            print(f"[GeminiWrapper] HTTP error {e.code} on model {model_name}: {err_msg[:120]}")
            continue
        except Exception as e:
            print(f"[GeminiWrapper] Request failed on model {model_name}: {e}")
            continue

    return fallback
