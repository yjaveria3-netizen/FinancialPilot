"""
FinPilot Gemini AI Wrapper
Shared service for all modules. Uses direct HTTPS REST API to prevent
gRPC DLL blockages on Windows Application Control environments.
"""
import os
import json
import urllib.request
import urllib.error


def ask_gemini(prompt: str, fallback: str = "AI insight unavailable.") -> str:
    """
    Send a prompt to Gemini REST API and return the text response.
    Falls back gracefully if the API key is missing or the call fails.

    Args:
        prompt:   The full text prompt.
        fallback: Text to return on any error or missing key.

    Returns:
        str: Gemini's text response or fallback string.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        print("[GeminiWrapper] GEMINI_API_KEY is not set. Using contextual fallback.")
        return fallback

    # Support multiple models, default to gemini-1.5-flash
    model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
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
