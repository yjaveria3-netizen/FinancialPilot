import hashlib, json, os
from google import genai

CACHE = os.path.join(os.path.dirname(__file__), "..", "cache")

def ask(prompt):
    os.makedirs(CACHE, exist_ok=True)
    f = os.path.join(CACHE, hashlib.md5(prompt.encode()).hexdigest() + ".json")
    if os.path.exists(f):
        return json.load(open(f))["a"]
    try:
        client = genai.Client(api_key=os.environ["GEMINI_KEY"])
        r = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        json.dump({"a": r.text}, open(f, "w"))
        return r.text
    except Exception:
        return "AI explanation unavailable right now."