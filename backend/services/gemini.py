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
        client = genai.Client(api_key=os.environ["GEMINI_KEY"])
        r = client.models.generate_content(model="gemini-3.8-flash", contents=prompt)
        json.dump({"a": r.text}, open(f, "w"))
        return r.text
    except Exception:
        return ""