import hashlib, json, os
from backend.services.gemini_wrapper import ask_gemini

CACHE = os.path.join(os.path.dirname(__file__), "..", "cache")

def ask(prompt):
    os.makedirs(CACHE, exist_ok=True)
    f = os.path.join(CACHE, hashlib.md5(prompt.encode()).hexdigest() + ".json")
    if os.path.exists(f):
        try:
            cached = json.load(open(f, encoding="utf-8"))
            if cached.get("a") and "unavailable" not in cached["a"].lower():
                return cached["a"]
        except Exception:
            pass
    try:
        resp = ask_gemini(prompt, fallback="")
        if resp and "unavailable" not in resp.lower():
            try:
                json.dump({"a": resp}, open(f, "w", encoding="utf-8"))
            except Exception:
                pass
            return resp
        return ""
    except Exception:
        return ""