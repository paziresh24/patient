#!/bin/sh
# Resolve a patient FROM image that actually exists on PUSH_HOST.
# Historical SHA pins (e.g. 0d479232) get deleted by registry GC and then
# every main/MR docker job fails with "not found" even though :latest is live.
#
# Use `docker pull`, not `docker manifest inspect`. GitLab's OCI registry
# answers inspect with "not found" for tags that pull/FROM just fine
# (measured 2026-09-01, job 34569: :latest and previous SHA both "not found"
# via inspect while the same tags were on the GitLab tag API).
set -eu
PUSH_HOST=${1:?push host required}
BEFORE_SHA=${2:-}
REPO=paziresh24/patient

tags="latest"
if [ -n "$BEFORE_SHA" ] && [ "$BEFORE_SHA" != "0000000000000000000000000000000000000000" ]; then
  short=$(printf '%s' "$BEFORE_SHA" | cut -c1-8)
  tags="$tags $short"
fi

for tag in $tags; do
  img="${PUSH_HOST}/${REPO}:${tag}"
  if docker pull "$img" >/tmp/ci-pick-base.pull.log 2>&1; then
    echo "Using existing base image $img" >&2
    printf '%s\n' "$img"
    exit 0
  fi
  echo "base tag not pullable: $img" >&2
  tail -5 /tmp/ci-pick-base.pull.log >&2 || true
done

echo "FATAL: no reusable patient base image on ${PUSH_HOST}/${REPO} (tried: $tags)" >&2
exit 1
