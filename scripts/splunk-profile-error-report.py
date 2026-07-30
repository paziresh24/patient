#!/usr/bin/env python3
"""
Profile / center Splunk error triage (read-only).

Requires Search API (NOT HEC ingest):
  SPLUNK_SEARCH_HOST=https://profile-splunk.paziresh24.com
  SPLUNK_SEARCH_USER=admin
  SPLUNK_SEARCH_PASSWORD=...
  # or SPLUNK_SEARCH_TOKEN=<session/bearer if available>
Optional:
  SPLUNK_INDEX=*
  SPLUNK_EARLIEST=-24h

Usage:
  python scripts/splunk-profile-error-report.py
  python scripts/splunk-profile-error-report.py --hours 48
  python scripts/splunk-profile-error-report.py --write-report
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# group + type -> Persian hint for engineers / AI triage
FIX_PLAYBOOK: dict[tuple[str, str], str] = {
    ("profile_ssr", "error"): "SSR پروفایل دکتر fail — slug/path را چک کن؛ timeout API یا GrowthBook؛ getProfileServerSideProps.",
    ("profile_ssr", "csr_fallback"): "SSR timeout/5xx → CSR fallback — API سنگین یا GB کند؛ prefetch را سبک کن یا timeout را بالا ببر.",
    ("profile_error", "profile_error"): "Axios error در SSR — endpoint و status را ببین؛ upstream API down یا slug نامعتبر.",
    ("profile_error", "profile_error_non_axios"): "خطای غیر-Axios در SSR — stack trace؛ احتمال crash serialize یا null reference.",
    ("profile_error", "profile_error_client_side"): "خطای کلاینت / ErrorPage — props ناقص یا fetch client-side fail.",
    ("profile_render_result", "error"): "Render کلاینت fail — ErrorBoundary، props، یا component crash.",
    ("center_ssr", "error"): "SSR مرکز fail — slugProfile API یا redirect logic.",
    ("center_profile_error", "ssr_error"): "Axios در SSR مرکز — endpoint slugProfile.",
    ("center_profile_error", "ssr_not_found"): "مرکز 404 — slug اشتباه یا حذف شده.",
    ("center_profile_error", "ssr_error_non_axios"): "Crash SSR مرکز — قبلاً window در splunk.ts بود؛ sanitize dehydrate.",
    ("center_profile_error", "client_load_error"): "لود پروفایل مرکز در کلاینت fail — React Query / API.",
    ("center_doctors_list", "error"): "لیست پزشکان مرکز fail — search API؛ sanitizeCenterSearchDoctors + retry UI.",
    ("online_visit_visibility", "gate_evaluated"): "فقط وقتی show=false غیرمنتظره — Saman / GrowthBook gate.",
}

TRIAGE_QUERIES = [
    {
        "id": "profile_ssr_errors",
        "title": "SSR پروفایل دکتر — خطا / fallback",
        "groups": ["profile_ssr"],
        "types": ["error", "csr_fallback"],
    },
    {
        "id": "profile_errors",
        "title": "خطاهای profile_error",
        "groups": ["profile_error"],
        "types": ["profile_error", "profile_error_non_axios", "profile_error_client_side"],
    },
    {
        "id": "profile_render_errors",
        "title": "Render کلاینت پروفایل",
        "groups": ["profile_render_result"],
        "types": ["error"],
    },
    {
        "id": "center_ssr_errors",
        "title": "SSR مرکز",
        "groups": ["center_profile_error", "center_ssr"],
        "types": ["ssr_error", "ssr_not_found", "ssr_error_non_axios", "error"],
    },
    {
        "id": "center_client_errors",
        "title": "کلاینت مرکز",
        "groups": ["center_profile_error"],
        "types": ["client_load_error"],
    },
    {
        "id": "center_doctors_list_errors",
        "title": "لیست پزشکان مرکز",
        "groups": ["center_doctors_list"],
        "types": ["error"],
    },
]


def load_dotenv_local() -> None:
    env_path = ROOT / ".env.local"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key, value = key.strip(), value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def splunk_search(host: str, spl: str, timeout_sec: int = 120, *, token: str = "", user: str = "", password: str = "") -> list[dict]:
    host = host.rstrip("/")
    # Splunk behind UI proxy may need /en-US prefix
    for base in (host, f"{host}/en-US"):
        create_url = f"{base}/services/search/jobs?output_mode=json"
        body = urllib.parse.urlencode({"search": spl, "exec_mode": "oneshot", "count": 500}).encode("utf-8")
        req = urllib.request.Request(
            create_url,
            data=body,
            method="POST",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        if token:
            req.add_header("Authorization", f"Bearer {token}")
        opener = urllib.request.build_opener()
        if user and password:
            password_mgr = urllib.request.HTTPPasswordMgrWithDefaultRealm()
            password_mgr.add_password(None, base, user, password)
            opener = urllib.request.build_opener(urllib.request.HTTPBasicAuthHandler(password_mgr))
        try:
            with opener.open(req, timeout=timeout_sec) as resp:
                payload = json.loads(resp.read().decode("utf-8"))
            results = payload.get("results") or []
            if isinstance(results, list):
                return results
        except urllib.error.HTTPError as e:
            if e.code in (404, 303) and base == host:
                continue
            raise
    return []


def build_spl(index: str, earliest: str, groups: list[str], types: list[str]) -> str:
    group_clause = " OR ".join(f'group="{g}"' for g in groups)
    type_clause = " OR ".join(f'type="{t}"' for t in types)
    # Also match nested event.* fields if library flattens differently
    alt_group = " OR ".join(f'event.group="{g}"' for g in groups)
    alt_type = " OR ".join(f'event.type="{t}"' for t in types)
    return (
        f"search index={index} earliest={earliest} "
        f"(({group_clause}) OR ({alt_group})) "
        f"(({type_clause}) OR ({alt_type})) "
        f"| stats count by group type slug message path center_id http_status "
        f"| sort -count"
    )


def pick_field(row: dict, *keys: str) -> str:
    for key in keys:
        val = row.get(key)
        if val not in (None, "", "null"):
            return str(val)
    return ""


def aggregate_rows(rows: list[dict]) -> list[dict]:
    buckets: dict[tuple, dict] = {}
    for row in rows:
        group = pick_field(row, "group", "event.group") or "?"
        typ = pick_field(row, "type", "event.type") or "?"
        count_raw = pick_field(row, "count") or "1"
        try:
            count = int(float(count_raw))
        except ValueError:
            count = 1
        key = (
            group,
            typ,
            pick_field(row, "slug", "event.slug"),
            pick_field(row, "message", "event.message")[:120],
            pick_field(row, "path", "event.path"),
            pick_field(row, "http_status", "event.http_status"),
        )
        if key not in buckets:
            buckets[key] = {"count": 0, "group": group, "type": typ, "slug": key[2], "message": key[3], "path": key[4], "http_status": key[5]}
        buckets[key]["count"] += count
    return sorted(buckets.values(), key=lambda x: x["count"], reverse=True)


def render_report(sections: list[tuple[str, list[dict]]], earliest: str, host: str | None) -> str:
    lines = [
        f"# گزارش Splunk — پروفایل / مرکز",
        f"",
        f"- زمان: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"- بازه: {earliest}",
        f"- منبع: {host or '(بدون اتصال — فقط playbook)'}",
        f"",
    ]
    total_issues = sum(sum(r["count"] for r in rows) for _, rows in sections)
    lines.append(f"## خلاصه\n\n- مجموع رویدادهای خطا (تقریبی): **{total_issues}**\n")

    for title, rows in sections:
        lines.append(f"## {title}\n")
        if not rows:
            lines.append("_رویدادی در این بازه نیست._\n")
            continue
        for row in rows[:15]:
            g, t = row["group"], row["type"]
            hint = FIX_PLAYBOOK.get((g, t), "کد مربوطه را در nightBatEvents و call site جستجو کن.")
            slug_part = f" — slug: `{row['slug']}`" if row["slug"] else ""
            msg_part = f" — {row['message']}" if row["message"] else ""
            status_part = f" — HTTP {row['http_status']}" if row["http_status"] else ""
            lines.append(f"- **{row['count']}×** `{g}` / `{t}`{slug_part}{status_part}{msg_part}")
            lines.append(f"  - راه‌حل: {hint}")
        lines.append("")

    lines.append("## Playbook کامل (group / type)\n")
    for (g, t), hint in sorted(FIX_PLAYBOOK.items()):
        lines.append(f"- `{g}` + `{t}` → {hint}")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    load_dotenv_local()
    parser = argparse.ArgumentParser(description="Splunk profile/center error triage")
    parser.add_argument("--hours", type=int, default=24, help="Look back N hours (default 24)")
    parser.add_argument("--index", default=os.environ.get("SPLUNK_INDEX", "*"), help="Splunk index")
    parser.add_argument("--write-report", action="store_true", help="Write markdown to .cursor/reports/")
    args = parser.parse_args()

    host = os.environ.get("SPLUNK_SEARCH_HOST", "").strip()
    token = os.environ.get("SPLUNK_SEARCH_TOKEN", "").strip()
    user = os.environ.get("SPLUNK_SEARCH_USER", "").strip()
    password = os.environ.get("SPLUNK_SEARCH_PASSWORD", "").strip()
    earliest = f"-{args.hours}h"

    sections: list[tuple[str, list[dict]]] = []

    has_auth = host and (token or (user and password))
    if not has_auth:
        print(
            "⚠️  Splunk Search credentials missing — playbook only.\n"
            "   Add to .env.local (never commit):\n"
            "   SPLUNK_SEARCH_HOST=https://profile-splunk.paziresh24.com\n"
            "   SPLUNK_SEARCH_USER=admin\n"
            "   SPLUNK_SEARCH_PASSWORD=...\n",
            file=sys.stderr,
        )
        for q in TRIAGE_QUERIES:
            sections.append((q["title"], []))
        report = render_report(sections, earliest, None)
        print(report)
        return 2

    for q in TRIAGE_QUERIES:
        spl = build_spl(args.index, earliest, q["groups"], q["types"])
        try:
            rows = splunk_search(host, spl, token=token, user=user, password=password)
            sections.append((q["title"], aggregate_rows(rows)))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")[:500]
            print(f"HTTP {e.code} for {q['id']}: {body}", file=sys.stderr)
            sections.append((q["title"] + " (query failed)", []))
        except Exception as e:
            print(f"Error for {q['id']}: {e}", file=sys.stderr)
            sections.append((q["title"] + " (query failed)", []))

    report = render_report(sections, earliest, host)
    print(report)

    if args.write_report:
        out_dir = ROOT / ".cursor" / "reports"
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / f"splunk-profile-triage-{datetime.now().strftime('%Y-%m-%d')}.md"
        out_path.write_text(report, encoding="utf-8")
        print(f"\nSaved: {out_path}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
