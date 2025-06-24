find . -type f \( -name "*.css" -o -name "*.scss" \) -print0 | while IFS= read -r -d '' file; do
    if grep -q '@import\s\+url("https:\/\/fonts\.googleapis\.com\/css2?' "$file"; then
        echo "✅ Removing Google Fonts from: $file"
        sed -i '/@import\s\+url("https:\/\/fonts\.googleapis\.com\/css2?.*");/d' "$file"
    fi
done
