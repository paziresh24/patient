#!/bin/sh
# Auto-merge low-risk MRs after a green ai-review (verdict READY).
# Requires: curl, jq, GITLAB_API_TOKEN (api + merge permission), CI_* vars.
set -eu

API="${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}"
AUTH="PRIVATE-TOKEN: ${GITLAB_API_TOKEN}"

echo "==> Auto-merge safety checks for MR !${CI_MERGE_REQUEST_IID}"

if [ -z "${GITLAB_API_TOKEN:-}" ]; then
  echo "ERROR: GITLAB_API_TOKEN is empty."
  exit 1
fi

# Kill switch (project/group CI variable). Default off unless explicitly true.
if [ "${AUTO_MERGE_SAFE_MRS:-false}" != "true" ]; then
  echo "Skip: AUTO_MERGE_SAFE_MRS is not true."
  exit 0
fi

# Draft MRs never auto-merge
DRAFT="$(curl -fsS --header "$AUTH" "$API" | jq -r '.draft // false')"
TITLE="$(curl -fsS --header "$AUTH" "$API" | jq -r '.title // ""')"
case "$DRAFT" in
  true|True) echo "Skip: MR is draft."; exit 0 ;;
esac
case "$TITLE" in
  [Dd]raft:*|[Ww][Ii][Pp]:*) echo "Skip: draft/WIP title."; exit 0 ;;
esac

# Latest AI summary note
NOTES="$(curl -fsS --header "$AUTH" "${API}/notes?per_page=100&sort=desc&order_by=created_at")"
SUMMARY="$(echo "$NOTES" | jq -r '
  [.[] | select(.body | test("#ai-review-summary"))] | .[0].body // empty
')"

if [ -z "$SUMMARY" ]; then
  echo "Skip: no #ai-review-summary comment found."
  exit 0
fi

# Verdict must be READY (not BLOCKING / NEEDS_WORK)
VERDICT_LINE="$(printf '%s\n' "$SUMMARY" | grep -E 'READY|NEEDS_WORK|BLOCKING' | head -n1 || true)"
echo "Verdict line: ${VERDICT_LINE:-<none>}"

case "$VERDICT_LINE" in
  *BLOCKING*) echo "Skip: verdict BLOCKING."; exit 0 ;;
  *NEEDS_WORK*) echo "Skip: verdict NEEDS_WORK."; exit 0 ;;
  *READY*) ;;
  *) echo "Skip: could not find READY verdict."; exit 0 ;;
esac

# Also refuse if Important section lists real findings (Persian empty marker)
if printf '%s\n' "$SUMMARY" | grep -A20 '🔴 مهم' | grep -qE 'path:|src/|\.tsx|\.ts|\.js'; then
  if ! printf '%s\n' "$SUMMARY" | grep -A5 '🔴 مهم' | grep -q 'موردی نیست'; then
    echo "Skip: Important findings present in summary."
    exit 0
  fi
fi

# Changed files + size via MR changes API
CHANGES_JSON="$(curl -fsS --header "$AUTH" "${API}/changes")"
FILES="$(echo "$CHANGES_JSON" | jq -r '.changes[]?.new_path // .changes[]?.old_path // empty' | sort -u)"
FILE_COUNT="$(printf '%s\n' "$FILES" | grep -c . || true)"

echo "Files changed: ${FILE_COUNT}"

MAX_FILES="${AUTO_MERGE_MAX_FILES:-20}"

if [ "$FILE_COUNT" -gt "$MAX_FILES" ]; then
  echo "Skip: too many files (${FILE_COUNT} > ${MAX_FILES})."
  exit 0
fi

# High-risk path deny-list (patient)
RISKY="$(printf '%s\n' "$FILES" | grep -E -i \
  '(^|/)(\.env|middleware\.ts|server\.js|next\.config|firebase|auth|login|session|token|password|payment|billing|wallet|national|sentry\.client|docker|gitlab-ci)' \
  || true)"

if [ -n "$RISKY" ]; then
  echo "Skip: high-risk paths touched:"
  printf '%s\n' "$RISKY"
  exit 0
fi

echo "==> Scheduling merge when pipeline succeeds (low-risk + READY)"
RESP="$(curl -sS -w '\n%{http_code}' --request PUT --header "$AUTH" \
  --header "Content-Type: application/json" \
  --data "{\"merge_when_pipeline_succeeds\":true,\"should_remove_source_branch\":true,\"merge_commit_message\":\"chore: auto-merge MR !${CI_MERGE_REQUEST_IID} (ai-review READY, low-risk)\"}" \
  "${API}/merge")"

HTTP="$(printf '%s\n' "$RESP" | tail -n1)"
BODY="$(printf '%s\n' "$RESP" | sed '$d')"

echo "HTTP ${HTTP}"
echo "$BODY" | jq -c '{state:.state, merge_when_pipeline_succeeds:.merge_when_pipeline_succeeds, merge_status:.merge_status, message:.message}' 2>/dev/null || echo "$BODY"

case "$HTTP" in
  200|201|202) echo "Auto-merge armed."; exit 0 ;;
  405|406|409)
    # Already merged / not allowed / conflict — do not fail the pipeline hard if not mergeable yet
    echo "WARN: merge not accepted (HTTP ${HTTP}). Leaving for human."
    exit 0
    ;;
  *)
    echo "ERROR: merge API failed (HTTP ${HTTP})."
    exit 1
    ;;
esac
