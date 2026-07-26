#!/bin/sh
# Auto-merge after a green ai-review with verdict READY.
# No file-count / path denylist — risk judgment lives entirely in ai-review.
# Auth: GITLAB_MERGE_TOKEN (preferred) or GITLAB_API_TOKEN — must be @harun.
set -eu

API="${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}"

TOKEN="${GITLAB_MERGE_TOKEN:-${GITLAB_API_TOKEN:-}}"
AUTH="PRIVATE-TOKEN: ${TOKEN}"

echo "==> Auto-merge checks for MR !${CI_MERGE_REQUEST_IID} (depends on ai-review only)"

if [ -z "$TOKEN" ]; then
  echo "ERROR: set GITLAB_MERGE_TOKEN (preferred) or GITLAB_API_TOKEN for @harun."
  exit 1
fi

if [ -n "${GITLAB_MERGE_TOKEN:-}" ]; then
  echo "Using GITLAB_MERGE_TOKEN for merge API (@harun)."
else
  echo "Using GITLAB_API_TOKEN for merge API (@harun)."
fi

if [ "${AUTO_MERGE_SAFE_MRS:-false}" != "true" ]; then
  echo "Skip: AUTO_MERGE_SAFE_MRS is not true."
  exit 0
fi

MR_JSON="$(curl -fsS --header "$AUTH" "$API")"
DRAFT="$(echo "$MR_JSON" | jq -r '.draft // false')"
TITLE="$(echo "$MR_JSON" | jq -r '.title // ""')"
case "$DRAFT" in
  true|True) echo "Skip: MR is draft."; exit 0 ;;
esac
case "$TITLE" in
  [Dd]raft:*|[Ww][Ii][Pp]:*) echo "Skip: draft/WIP title."; exit 0 ;;
esac

NOTES="$(curl -fsS --header "$AUTH" "${API}/notes?per_page=100&sort=desc&order_by=created_at")"
SUMMARY="$(echo "$NOTES" | jq -r '
  [.[] | select(.body | test("#ai-review-summary"))] | .[0].body // empty
')"

if [ -z "$SUMMARY" ]; then
  echo "Skip: no #ai-review-summary comment found."
  exit 0
fi

VERDICT_LINE="$(printf '%s\n' "$SUMMARY" | grep -E 'READY|NEEDS_WORK|BLOCKING' | head -n1 || true)"
echo "Verdict line: ${VERDICT_LINE:-<none>}"

case "$VERDICT_LINE" in
  *BLOCKING*) echo "Skip: verdict BLOCKING (ai-review)."; exit 0 ;;
  *NEEDS_WORK*) echo "Skip: verdict NEEDS_WORK (ai-review)."; exit 0 ;;
  *READY*) ;;
  *) echo "Skip: could not find READY verdict."; exit 0 ;;
esac

echo "==> Scheduling merge when pipeline succeeds (ai-review READY)"
RESP="$(curl -sS -w '\n%{http_code}' --request PUT --header "$AUTH" \
  --data "merge_when_pipeline_succeeds=true" \
  --data "should_remove_source_branch=true" \
  --data-urlencode "merge_commit_message=chore: auto-merge MR !${CI_MERGE_REQUEST_IID} (ai-review READY)" \
  "${API}/merge")"

HTTP="$(printf '%s\n' "$RESP" | tail -n1)"
BODY="$(printf '%s\n' "$RESP" | sed '$d')"

echo "HTTP ${HTTP}"
echo "$BODY" | jq -c '{state:.state, merge_when_pipeline_succeeds:.merge_when_pipeline_succeeds, merge_status:.merge_status, message:.message}' 2>/dev/null || echo "$BODY"

case "$HTTP" in
  200|201|202) echo "Auto-merge armed."; exit 0 ;;
  401|403)
    echo "ERROR: merge unauthorized (HTTP ${HTTP})."
    echo "Log in as https://gitlab.paziresh24.com/harun , create a PAT with api scope"
    echo "and Maintainer access on this project, set GITLAB_MERGE_TOKEN (Masked, NOT Protected)."
    exit 1
    ;;
  405|406|409)
    echo "WARN: merge not accepted (HTTP ${HTTP}). Leaving for human."
    exit 0
    ;;
  *)
    echo "ERROR: merge API failed (HTTP ${HTTP})."
    exit 1
    ;;
esac
