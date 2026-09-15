#!/usr/bin/env python3
"""Fail unless the GitLab token belongs to the required bot user (default: harun)."""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

EXPECTED = os.environ.get("GITLAB_BOT_USERNAME", "harun")


def main() -> int:
    if len(sys.argv) < 2 or not sys.argv[1]:
        print("ERROR: pass a GitLab private token as argv[1].", file=sys.stderr)
        return 1

    token = sys.argv[1]
    base = os.environ.get("CI_API_V4_URL") or os.environ.get("CI_SERVER_URL", "").rstrip("/") + "/api/v4"
    url = base.rstrip("/") + "/user"

    req = urllib.request.Request(url, headers={"PRIVATE-TOKEN": token})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            user = json.load(resp)
    except urllib.error.HTTPError as exc:
        print(f"ERROR: GET /user failed: HTTP {exc.code}", file=sys.stderr)
        return 1
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: GET /user failed: {exc}", file=sys.stderr)
        return 1

    username = (user.get("username") or "").strip()
    name = user.get("name") or ""
    print(f"GitLab API identity: @{username} ({name})")
    print(f"Profile: {os.environ.get('CI_SERVER_URL', '').rstrip('/')}/{username}")

    if username != EXPECTED:
        print(
            f"ERROR: review/merge must run as @{EXPECTED} "
            f"(https://gitlab.paziresh24.com/{EXPECTED}). "
            f"Got @{username or '<empty>'}. Recreate PAT while logged in as {EXPECTED}.",
            file=sys.stderr,
        )
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
