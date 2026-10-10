import re
# 1) App.jsx: swap the 5 "Coming Soon" pages for the real ones
p = "frontend/src/App.jsx"
s = open(p, encoding="utf-8").read()
if "BPages" in s:
    print("App.jsx already patched")
else:
    routes = {"procure-ai": "ProcurePage", "inventory": "InventoryPage", "pricing-advisor": "PricingPage",
              "negotiation-copilot": "NegotiationPage", "cfo-chat": "CfoChatPage"}
    for path, comp in routes.items():
        pat = r'<Route\s+path="%s"\s+element=\{\s*<ComingSoon.*?/>\s*\}\s*/>' % re.escape(path)
        s, n = re.subn(pat, '<Route path="%s" element={<%s />} />' % (path, comp), s, count=1, flags=re.S)
        print(path, "OK" if n else "NOT FOUND (tell me)")
    imp = "import { ProcurePage, InventoryPage, PricingPage, NegotiationPage, CfoChatPage } from './pages/BPages';\n"
    s = s.replace("import ComingSoon from './pages/ComingSoon';\n", "import ComingSoon from './pages/ComingSoon';\n" + imp, 1)
    open(p, "w", encoding="utf-8").write(s)
    print("App.jsx patched")
# 2) main.py: allow Vercel sites to call the backend
p = "backend/main.py"
s = open(p, encoding="utf-8").read()
if "allow_origin_regex" in s:
    print("CORS already patched")
elif "    allow_credentials=True," in s:
    s = s.replace("    allow_credentials=True,", '    allow_origin_regex=r"https://.*\\.vercel\\.app",\n    allow_credentials=True,', 1)
    open(p, "w", encoding="utf-8").write(s)
    print("CORS patched")
else:
    print("CORS line not found (tell me)")
