#!/bin/bash

URL="${CURL_URL:-$1}"
SPLUNK_HEC_URL="${SPLUNK_HEC_URL}"
SPLUNK_HEC_TOKEN="${SPLUNK_HEC_TOKEN}"
echo $SPLUNK_HEC_TOKEN
if [[ -z "$URL" || -z "$SPLUNK_HEC_URL" || -z "$SPLUNK_HEC_TOKEN" ]]; then
  echo "Missing required envs: CURL_URL, SPLUNK_HEC_URL, or SPLUNK_HEC_TOKEN"
  exit 1
fi

timestamp=$(date +%s)
hostname=$(hostname)

read -r -d '' METRICS <<EOF
{
  "time_namelookup": %{time_namelookup},
  "time_connect": %{time_connect},
  "time_appconnect": %{time_appconnect},
  "time_pretransfer": %{time_pretransfer},
  "time_redirect": %{time_redirect},
  "time_starttransfer": %{time_starttransfer},
  "time_total": %{time_total},
  "http_code": %{http_code},
  "url_effective": "%{url_effective}"
}
EOF

RESULT=$(curl -s -o /dev/null -w "$METRICS" "$URL")

# Create Splunk HEC JSON payload
read -r -d '' PAYLOAD <<EOF
{
  "time": $timestamp,
  "host": "$hostname",
  "event": "curl_metrics",
  "fields": $RESULT
}
EOF

curl -s -k "$SPLUNK_HEC_URL" \
  -H "Authorization: Splunk $SPLUNK_HEC_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"
