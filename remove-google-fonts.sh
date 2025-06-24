#!/bin/bash

echo "🔍 Starting Google Fonts cleanup..."

SCRIPT_NAME=$(basename "$0")

find . -type f \( -name "*.css" -o -name "*.scss" \) ! -name "$SCRIPT_NAME" -print0 | while IFS= read -r -d '' file; do
    if grep -q 'fonts\.googleapis\.com/css2?' "$file"; then
        echo "⚠️  Found Google Fonts import in: $file"
        sed -i '/@import\s\+url("https:\/\/fonts\.googleapis\.com\/css2?.*");/d' "$file"
    fi
done

echo "✅ Cleanup completed."
