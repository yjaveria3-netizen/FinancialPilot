import hashlib, json, os
from google import genai

def ask(prompt, key):
    os.makedirs("cache", exist_ok=True)
    f = "cache/" + hashlib.md5(prompt.encode()).hexdigest() + ".json"
    if os.path.exists(f):
        return json.load(open(f))["a"]
    try:
        client = genai.Client(api_key=key)
        r = client.models.generate_content(
            model="gemini-2.5-flash", contents=prompt)
        json.dump({"a": r.text}, open(f, "w"))
        return r.text
    except Exception as e:
        return "AI explanation unavailable right now."