#!/bin/sh
# Auto-merge after a green ai-review with verdict READY.
# Uses Python stdlib only — python:3.12-alpine image has no curl/jq, and apk CDN
# is often unreachable from runner pods (see .gitlab-ci.yml auto-merge-safe).
# Auth: GITLAB_MERGE_TOKEN (preferred) or GITLAB_API_TOKEN — must be @harun.
set -eu
exec python3 - "$@" <<'PY'
from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request


def api_request(method: str, url: str, token: str, data: bytes | None = None) -> tuple[int, object]:
    headers = {"PRIVATE-TOKEN": token}
    if data is not None:
        headers["Content-Type"] = "application/x-www-form-urlencoded"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            code = resp.getcode() or 200
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        code = exc.code
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: request failed: {exc}", file=sys.stderr)
        return 0, {"message": str(exc)}

    try:
        body: object = json.loads(raw) if raw else {}
    except json.JSONDecodeError:
        body = {"message": raw}
    return code, body


def main() -> int:
    mr_iid = os.environ.get("CI_MERGE_REQUEST_IID", "")
    project_id = os.environ.get("CI_PROJECT_ID", "")
    api_base = (os.environ.get("CI_API_V4_URL") or "").rstrip("/")
    api = f"{api_base}/projects/{project_id}/merge_requests/{mr_iid}"

    token = os.environ.get("GITLAB_MERGE_TOKEN") or os.environ.get("GITLAB_API_TOKEN") or ""
    print(f"==> Auto-merge checks for MR !{mr_iid} (depends on ai-review only)")

    if not token:
        print("ERROR: set GITLAB_MERGE_TOKEN (preferred) or GITLAB_API_TOKEN for @harun.")
        return 1

    if os.environ.get("GITLAB_MERGE_TOKEN"):
        print("Using GITLAB_MERGE_TOKEN for merge API (@harun).")
    else:
        print("Using GITLAB_API_TOKEN for merge API (@harun).")

    if os.environ.get("AUTO_MERGE_SAFE_MRS", "false") != "true":
        print("Skip: AUTO_MERGE_SAFE_MRS is not true.")
        return 0

    code, mr = api_request("GET", api, token)
    if code != 200 or not isinstance(mr, dict):
        print(f"ERROR: failed to load MR (HTTP {code}).")
        return 1

    if mr.get("draft") is True:
        print("Skip: MR is draft.")
        return 0

    title = str(mr.get("title") or "")
    if re.match(r"(?i)^(draft|wip):", title):
        print("Skip: draft/WIP title.")
        return 0

    notes_url = f"{api}/notes?per_page=100&sort=desc&order_by=created_at"
    code, notes = api_request("GET", notes_url, token)
    if code != 200 or not isinstance(notes, list):
        print(f"ERROR: failed to load MR notes (HTTP {code}).")
        return 1

    summary = ""
    for note in notes:
        body = str(note.get("body") or "")
        if "#ai-review-summary" in body:
            summary = body
            break

    if not summary:
        print("Skip: no #ai-review-summary comment found.")
        return 0

    verdict_line = "<none>"
    for line in summary.splitlines():
        if re.search(r"READY|NEEDS_WORK|BLOCKING", line):
            verdict_line = line
            break
    print(f"Verdict line: {verdict_line}")

    if "BLOCKING" in verdict_line:
        print("Skip: verdict BLOCKING (ai-review).")
        return 0
    if "NEEDS_WORK" in verdict_line:
        print("Skip: verdict NEEDS_WORK (ai-review).")
        return 0
    if "READY" not in verdict_line:
        print("Skip: could not find READY verdict.")
        return 0

    print("==> Scheduling merge when pipeline succeeds (ai-review READY)")
    form = urllib.parse.urlencode(
        {
            "merge_when_pipeline_succeeds": "true",
            "should_remove_source_branch": "true",
            "merge_commit_message": f"chore: auto-merge MR !{mr_iid} (ai-review READY)",
        }
    ).encode()
    http, body = api_request("PUT", f"{api}/merge", token, data=form)
    print(f"HTTP {http}")
    if isinstance(body, dict):
        print(
            json.dumps(
                {
                    "state": body.get("state"),
                    "merge_when_pipeline_succeeds": body.get("merge_when_pipeline_succeeds"),
                    "merge_status": body.get("merge_status"),
                    "message": body.get("message"),
                },
                ensure_ascii=False,
            )
        )
    else:
        print(body)

    if http in (200, 201, 202):
        print("Auto-merge armed.")
        return 0
    if http in (401, 403):
        print(f"ERROR: merge unauthorized (HTTP {http}).")
        print("Log in as https://gitlab.paziresh24.com/harun , create a PAT with api scope")
        print("and Maintainer access on this project, set GITLAB_MERGE_TOKEN (Masked, NOT Protected).")
        return 1
    if http in (405, 406, 409):
        print(f"WARN: merge not accepted (HTTP {http}). Leaving for human.")
        return 0

    print(f"ERROR: merge API failed (HTTP {http}).")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
PY
