#!/bin/bash

# Start the Node.js app in the background
npm start &

# Start curl logger if enabled
if [[ "$CURL_SPLUNK_ENABLED" == "true" ]]; then
  echo "[INFO] Starting curl-to-Splunk logger..."
  while true; do
    ./curl_logger.sh
    sleep 60
  done &
else
  echo "[INFO] CURL_SPLUNK_ENABLED is not true. Skipping curl logger."
fi

# Wait for Node.js app to exit
wait -n
