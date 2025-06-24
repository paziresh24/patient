#!/bin/bash

echo "🔍 Starting Google Fonts cleanup..."

SCRIPT_PATH="$(realpath "$0")"

find . -type f \( -name "*.css" -o -name "*.scss" \) -print0 | while IFS= read -r -d '' file; do
    FILE_PATH="$(realpath "$file")"

    if [[ "$FILE_PATH" == "$SCRIPT_PATH" ]]; then
        continue
    fi

    if grep -q 'fonts\.googleapis\.com' "$file"; then
        echo "⚠️  Cleaning Google Fonts from: $file"
        sed -i.bak "/@import\s\+url(['\"]https:\/\/fonts\.googleapis\.com.*['\"])/d" "$file"
        rm "${file}.bak"
    fi
done

echo "✅ Cleanup completed."
