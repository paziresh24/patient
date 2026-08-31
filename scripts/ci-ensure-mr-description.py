#!/usr/bin/env python3
"""Give the merge request a description when it has none.

`ai-review` validates the MR payload with a schema whose `description` is a
required string, so an MR opened without one dies with a pydantic
ValidationError and the pipeline goes red for a reason unrelated to the code —
which then blocks the merge behind `ci_must_pass`. Seen on MR !257 (2026-08-31).

A placeholder is not a good description; it is better than a merge that cannot
happen. The text says plainly that it was filled in automatically so nobody
mistakes it for the author's own summary.
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

API = os.environ.get("CI_SERVER_URL", "https://gitlab.paziresh24.com").rstrip("/") + "/api/v4"
TOKEN = os.environ.get("GITLAB_API_TOKEN", "")
PROJECT = os.environ.get("CI_PROJECT_ID", "")
MR = os.environ.get("CI_MERGE_REQUEST_IID", "")


def call(method: str, path: str, payload: dict | None = None) -> dict:
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {"PRIVATE-TOKEN": TOKEN}
    if data:
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(API + path, data=data, headers=headers, method=method)
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def main() -> int:
    if not (TOKEN and PROJECT and MR):
        print("ensure-mr-description: not a merge-request pipeline, nothing to do")
        return 0
    path = f"/projects/{urllib.parse.quote_plus(PROJECT)}/merge_requests/{MR}"
    try:
        mr = call("GET", path)
    except urllib.error.URLError as error:
        print(f"ensure-mr-description: could not read the merge request ({error})")
        return 0
    if (mr.get("description") or "").strip():
        return 0
    branch = mr.get("source_branch") or "this branch"
    text = (
        f"_توضیحاتِ این merge request خالی بود و به‌صورت خودکار پر شد._\n\n"
        f"تغییرات از برنچِ `{branch}`. برای شرحِ دقیق، کامیت‌های همین MR را ببینید."
    )
    call("PUT", path, {"description": text})
    print("ensure-mr-description: filled an empty description")
    return 0


if __name__ == "__main__":
    sys.exit(main())
