import re, sys
p = "backend/main.py"
lines = open(p, encoding="utf-8").read().split("\n")
out = [l for l in lines if not (l.startswith("<<<<<<<") or l.rstrip() == "=======" or l.startswith(">>>>>>>"))]
s = "\n".join(out)
if "include_router(b_router)" not in s:
    s += "\n\n# ---- Member B routes ----\nfrom backend.b_routes import router as b_router\napp.include_router(b_router)\n"
if "allow_origin_regex" not in s and "    allow_credentials=True," in s:
    s = s.replace("    allow_credentials=True,", '    allow_origin_regex=r"https://.*\\.vercel\\.app",\n    allow_credentials=True,', 1)
open(p, "w", encoding="utf-8").write(s)
print("conflict markers left:", sum(1 for l in s.split("\n") if l.startswith(("<<<<<<<", ">>>>>>>"))))
print("b_router included:", "include_router(b_router)" in s)
