import json
import re
import ssl
import urllib.request

url = "https://localhost:3443/center/%D9%85%D8%B1%DA%A9%D8%B2-%D8%A2%D9%85%D9%88%D8%B2%D8%B4%DB%8C-%D8%AF%D8%B1%D9%85%D8%A7%D9%86%DB%8C-%D8%AD%D8%A7%D9%81%D8%B8/"
ctx = ssl._create_unverified_context()
req = urllib.request.Request(url, headers={"User-Agent": "center-check/1.0"})
with urllib.request.urlopen(req, context=ctx, timeout=120) as r:
    html = r.read().decode("utf-8", "replace")
    code = r.status

m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html, re.S)
out = {"http": code, "html_len": len(html), "has_next_data": bool(m)}
if m:
    d = json.loads(m.group(1))
    props = (d.get("props") or {}).get("pageProps") or {}
    out.update(
        {
            "slug": props.get("slug"),
            "status": props.get("status"),
            "isMainSite": props.get("isMainSite"),
            "has_dehydrated": bool(props.get("dehydratedState")),
            "profile_backend": props.get("profile_backend"),
        }
    )
else:
    out["snippet"] = html[:800]
print(json.dumps(out, ensure_ascii=False, indent=2))
