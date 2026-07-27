# -*- coding: utf-8 -*-
"""Compare online-visit visibility: API expectation vs production vs localhost."""
import json
import re
import ssl
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

CTX = ssl._create_unverified_context()
UA = {"User-Agent": "Mozilla/5.0 (compatible; p24-ov-check/1.0)"}
ONLINE_MARKERS = [
    "همین الان آنلاین ویزیت شوید",
    "شروع ویزیت با",
    "ویزیت آنلاین در:",
]
PRESENCE_MARKERS = [
    "نوبت اینترنتی و مراجعه حضوری",
    "دریافت نوبت",
]


def get_json(url, timeout=30):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, context=CTX, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


def get_html(url, timeout=90):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, context=CTX, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def has_any(html, markers):
    return any(m in html for m in markers)


def classify(slug):
    enc = urllib.parse.quote(slug, safe="")
    row = {
        "slug": slug,
        "c5532": False,
        "other": 0,
        "consult": None,
        "saman": None,
        "expected": False,
        "klass": "unknown",
        "err": None,
    }
    try:
        c = get_json(
            f"https://drprofile.paziresh24.com/api/doctors/{enc}/centers?check_bookable_services=true"
        )
        clist = c if isinstance(c, list) else ((c.get("data") if isinstance(c, dict) else []) or [])
        ids = [str(x.get("id")) for x in clist if isinstance(x, dict)]
        row["c5532"] = "5532" in ids
        row["other"] = len([i for i in ids if i != "5532"])
    except Exception as e:
        row["err"] = f"centers:{e}"[:120]
        return row

    try:
        fp = get_json(f"https://drprofile.paziresh24.com/api/full-profile/{enc}/")
        data = fp.get("data", fp) if isinstance(fp, dict) else {}
        row["consult"] = data.get("consult_active_booking")
    except Exception:
        pass

    try:
        sam = get_json(f"https://saman.paziresh24.com/v1/doctors/{enc}/availability-status")
        saman = None
        for cc in sam.get("centers") or []:
            if str(cc.get("id")) == "5532":
                saman = (cc.get("availability_status") or {}).get("booking_available")
        if saman is None:
            saman = (sam.get("online_visit_availability") or {}).get("booking_available")
        row["saman"] = saman
    except Exception as e:
        row["err"] = (row["err"] or "") + f"|saman:{e}"[:80]

    if row["c5532"] and row["other"] > 0:
        row["klass"] = "online+presence"
    elif row["c5532"] and row["other"] == 0:
        row["klass"] = "online-only"
    elif (not row["c5532"]) and row["other"] > 0:
        row["klass"] = "presence-only"
    else:
        row["klass"] = "none"

    # New gate: 5532 in bookable centers + (saman unknown/unavailable check only when known)
    # Match frontend: show if 5532 present AND (saman not false). If saman fetch failed, treat as unknown→show when 5532.
    if not row["c5532"]:
        row["expected"] = False
    elif row["saman"] is False:
        row["expected"] = False
    else:
        row["expected"] = True

    return row


def page_flags(base, slug):
    enc = urllib.parse.quote(slug, safe="")
    url = f"{base}/dr/{enc}/"
    try:
        html = get_html(url)
        return {
            "ok": True,
            "online": has_any(html, ONLINE_MARKERS),
            "presence": has_any(html, PRESENCE_MARKERS),
            "url": url,
        }
    except Exception as e:
        return {"ok": False, "online": None, "presence": None, "url": url, "err": str(e)[:100]}


def discover_slugs():
    """Build ~20 slugs across classes from known seeds + search APIs."""
    seeds = [
        "دکتر-سلیمه-دودانگه-قره-آقاجی",  # online delta case
        "دکتر-محدثه-بشارتی",  # online+presence
        "دکتر-سارا-اقبالی",
        "دکتر-همایون-پیشرفت-ثابت",
        "دکتر-زهرا-رجبلی",
        "دکتر-کوشان-حاجیونی",
        "دکتر-فاطمه-ارجمندی-0",
        "دکتر-زهرا-آقانسب",
        "دکتر-مهدیه-پاشایی-1",
        "دکتر-یوشع-محمودی",
        "دکتر-شاهین-بشارتی-کیوی-0",  # presence only (from earlier)
        "دکتر-محمد-رضا-بشارتی",
        "دکتر-سعید-بشارتی",  # 5532 but saman false previously
    ]

    # Pull more from public search pages' next data if possible
    search_urls = [
        "https://www.paziresh24.com/s/ir/orthopedics/",
        "https://www.paziresh24.com/s/ir/dermatology/",
        "https://www.paziresh24.com/s/ir/cardiovascular/",
        "https://www.paziresh24.com/s/ir/psychiatry/",
        "https://www.paziresh24.com/s/?q=%D8%AF%DA%A9%D8%AA%D8%B1&turn_type=consult",
    ]
    found = []
    for su in search_urls:
        try:
            html = get_html(su, timeout=45)
            # profile links /dr/slug/
            for m in re.findall(r"/dr/([^\"'?\s]+)/?", html):
                slug = urllib.parse.unquote(m).strip("/")
                if slug and not slug.startswith("http") and " " not in slug:
                    found.append(slug)
        except Exception:
            pass

    # unique preserve order
    out = []
    seen = set()
    for s in seeds + found:
        if s not in seen and not s.startswith("s/"):
            seen.add(s)
            out.append(s)
    return out


def main():
    print("Discovering slugs...")
    candidates = discover_slugs()
    print(f"candidates={len(candidates)}")

    print("Classifying via APIs...")
    classified = []
    with ThreadPoolExecutor(max_workers=6) as ex:
        futs = {ex.submit(classify, s): s for s in candidates[:40]}
        for fut in as_completed(futs):
            classified.append(fut.result())

    # balance pick ~20
    buckets = {"online+presence": [], "online-only": [], "presence-only": [], "none": []}
    for r in classified:
        buckets.setdefault(r["klass"], []).append(r)

    picked = []
    quotas = {
        "online+presence": 8,
        "online-only": 3,
        "presence-only": 6,
        "none": 3,
    }
    # force include critical seeds first
    must = {"دکتر-سلیمه-دودانگه-قره-آقاجی", "دکتر-محدثه-بشارتی", "دکتر-سعید-بشارتی"}
    for r in classified:
        if r["slug"] in must:
            picked.append(r)
    for klass, n in quotas.items():
        for r in buckets.get(klass, []):
            if len([x for x in picked if x["klass"] == klass]) >= n:
                break
            if r["slug"] not in {p["slug"] for p in picked}:
                picked.append(r)
    # fill to 20
    for r in classified:
        if len(picked) >= 20:
            break
        if r["slug"] not in {p["slug"] for p in picked}:
            picked.append(r)

    print(f"picked={len(picked)}")
    for k, v in quotas.items():
        print(f"  {k}: {len([x for x in picked if x['klass']==k])}")

    print("\nFetching live + local pages...")
    rows = []
    for r in picked:
        live = page_flags("https://www.paziresh24.com", r["slug"])
        time.sleep(0.3)
        local = page_flags("https://localhost", r["slug"])
        time.sleep(0.2)
        live_ov = live.get("online")
        local_ov = local.get("online")
        match = live_ov == local_ov if live.get("ok") and local.get("ok") else None
        # Also compare local vs expected API gate
        local_vs_api = local_ov == r["expected"] if local.get("ok") else None
        rows.append(
            {
                **r,
                "live_online": live_ov,
                "local_online": local_ov,
                "live_ok": live.get("ok"),
                "local_ok": local.get("ok"),
                "live_local_match": match,
                "local_vs_api": local_vs_api,
                "live_err": live.get("err"),
                "local_err": local.get("err"),
            }
        )
        status = "OK" if match else "DIFF"
        print(
            f"[{status}] {r['slug'][:40]:40} class={r['klass']:16} "
            f"exp={r['expected']} live={live_ov} local={local_ov} "
            f"5532={r['c5532']} saman={r['saman']}"
        )

    mismatches = [x for x in rows if x["live_local_match"] is False]
    api_miss = [x for x in rows if x["local_vs_api"] is False]
    failed = [x for x in rows if not x["live_ok"] or not x["local_ok"]]

    summary = {
        "total": len(rows),
        "live_local_match": sum(1 for x in rows if x["live_local_match"] is True),
        "live_local_diff": len(mismatches),
        "local_vs_api_ok": sum(1 for x in rows if x["local_vs_api"] is True),
        "local_vs_api_diff": len(api_miss),
        "fetch_failed": len(failed),
        "mismatches": mismatches,
        "api_mismatches": api_miss,
        "rows": rows,
    }

    out_path = "scripts/_online_visit_matrix/live_vs_local_20.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print("\n======== SUMMARY ========")
    print(f"total={summary['total']}")
    print(f"live==local: {summary['live_local_match']}")
    print(f"live!=local: {summary['live_local_diff']}")
    print(f"local==API expected: {summary['local_vs_api_ok']}")
    print(f"local!=API expected: {summary['local_vs_api_diff']}")
    print(f"fetch failed: {summary['fetch_failed']}")
    if mismatches:
        print("\nLIVE vs LOCAL diffs:")
        for m in mismatches:
            print(
                f"  - {m['slug']} class={m['klass']} live={m['live_online']} local={m['local_online']} "
                f"exp={m['expected']} consult={m['consult']} saman={m['saman']}"
            )
    if api_miss:
        print("\nLOCAL vs API diffs:")
        for m in api_miss:
            print(
                f"  - {m['slug']} class={m['klass']} local={m['local_online']} exp={m['expected']} "
                f"saman={m['saman']} c5532={m['c5532']}"
            )
    print(f"\nSaved {out_path}")


if __name__ == "__main__":
    main()
