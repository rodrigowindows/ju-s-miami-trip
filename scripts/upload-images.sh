#!/bin/bash
# Upload product images to Supabase Storage using curl
# Usage: SUPABASE_SERVICE_ROLE_KEY=your-key bash scripts/upload-images.sh

set -euo pipefail

SUPABASE_URL="https://aleenmfaugxymtxqlyyz.supabase.co"
KEY="${SUPABASE_SERVICE_ROLE_KEY:?Set SUPABASE_SERVICE_ROLE_KEY}"
BUCKET="product-images"
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

# Ensure bucket exists
echo "Checking bucket..."
BUCKETS=$(curl -s -H "apikey: $KEY" -H "Authorization: Bearer $KEY" "$SUPABASE_URL/storage/v1/bucket")
if ! echo "$BUCKETS" | python3 -c "import sys,json; buckets=json.load(sys.stdin); exit(0 if any(b['name']=='$BUCKET' for b in buckets) else 1)" 2>/dev/null; then
  echo "Creating bucket $BUCKET..."
  curl -s -X POST -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
    -d "{\"id\":\"$BUCKET\",\"name\":\"$BUCKET\",\"public\":true}" \
    "$SUPABASE_URL/storage/v1/bucket" | python3 -c "import sys,json; print(json.load(sys.stdin))" 2>/dev/null || true
fi

# Fetch all products
echo "Fetching products..."
curl -s -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
  "$SUPABASE_URL/rest/v1/catalog_products?select=id,name,brand,category,image_url&active=eq.true&order=category,name" \
  > "$TMPDIR/products.json"

TOTAL=$(python3 -c "import json; print(len(json.load(open('$TMPDIR/products.json'))))")
echo "Found $TOTAL products"

uploaded=0
skipped=0
failed=0
count=0

# Process each product
python3 -c "
import json
products = json.load(open('$TMPDIR/products.json'))
for p in products:
    # Tab-separated: id, name, brand, category, image_url
    print(f\"{p['id']}\t{p['name']}\t{p['brand']}\t{p['category']}\t{p.get('image_url','')}\")
" | while IFS=$'\t' read -r id name brand category image_url; do
  count=$((count + 1))

  # Skip if already on Supabase
  if echo "$image_url" | grep -q "supabase.co/storage"; then
    skipped=$((skipped + 1))
    continue
  fi

  # Skip if no image
  if [ -z "$image_url" ]; then
    echo "[$count/$TOTAL] SKIP (no URL): $name"
    skipped=$((skipped + 1))
    continue
  fi

  # Slugify name
  slug=$(echo "${brand}-${name}" | iconv -t ascii//TRANSLIT 2>/dev/null || echo "${brand}-${name}" | sed 's/[^a-zA-Z0-9]/-/g')
  slug=$(echo "$slug" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//' | cut -c1-80)

  # Determine folder
  folder="other"
  cat_lower=$(echo "$category" | tr '[:upper:]' '[:lower:]')
  case "$cat_lower" in
    *tech*|*eletr*) folder="tech" ;;
    *beauty*|*beleza*|*skin*|*maquiagem*) folder="beauty" ;;
    *perfum*|*fragr*) folder="perfumes" ;;
    *victoria*) folder="vs" ;;
    *fashion*|*moda*|*roupa*|*tenis*|*acess*) folder="fashion" ;;
    *lifestyle*|*casa*|*bath*) folder="lifestyle" ;;
    *health*|*saude*|*suplement*|*vitamin*) folder="supplements" ;;
    *kid*|*baby*|*brinquedo*|*infantil*) folder="kids" ;;
  esac

  echo "[$count/$TOTAL] $name"
  echo "  Downloading: ${image_url:0:70}..."

  # Download image
  HTTP_CODE=$(curl -s -w "%{http_code}" -L -o "$TMPDIR/img" \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" \
    -H "Accept: image/*,*/*" \
    "$image_url" 2>/dev/null)

  if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "301" ] && [ "$HTTP_CODE" != "302" ]; then
    echo "  FAIL: HTTP $HTTP_CODE"
    failed=$((failed + 1))
    continue
  fi

  SIZE=$(wc -c < "$TMPDIR/img")
  if [ "$SIZE" -lt 500 ]; then
    echo "  FAIL: tiny image (${SIZE}b)"
    failed=$((failed + 1))
    continue
  fi

  # Detect content type
  MIME=$(file -b --mime-type "$TMPDIR/img" 2>/dev/null || echo "image/jpeg")
  case "$MIME" in
    image/png) ext="png" ;;
    image/webp) ext="webp" ;;
    *) ext="jpg"; MIME="image/jpeg" ;;
  esac

  STORAGE_PATH="$folder/$slug.$ext"

  # Upload to Supabase Storage
  UPLOAD_RESULT=$(curl -s -X POST \
    -H "apikey: $KEY" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: $MIME" \
    -H "x-upsert: true" \
    --data-binary "@$TMPDIR/img" \
    "$SUPABASE_URL/storage/v1/object/$BUCKET/$STORAGE_PATH")

  # Check for error — successful response has Key+Id, error has "error" or "message"
  if echo "$UPLOAD_RESULT" | python3 -c "
import sys,json
try:
  d=json.load(sys.stdin)
  if 'error' in d or ('statusCode' in d and d.get('statusCode',0)>=400):
    sys.exit(1)
  sys.exit(0)
except:
  sys.exit(1)
" 2>/dev/null; then
    : # Success — continue
  else
    echo "  FAIL upload: $UPLOAD_RESULT"
    failed=$((failed + 1))
    continue
  fi

  # Build public URL
  PUBLIC_URL="$SUPABASE_URL/storage/v1/object/public/$BUCKET/$STORAGE_PATH"

  # Update database
  UPDATE_RESULT=$(curl -s -X PATCH \
    -H "apikey: $KEY" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d "{\"image_url\": \"$PUBLIC_URL\"}" \
    "$SUPABASE_URL/rest/v1/catalog_products?id=eq.$id")

  echo "  OK: $PUBLIC_URL"
  uploaded=$((uploaded + 1))

  # Small delay
  sleep 0.3
done

echo ""
echo "================================="
echo "Done!"
echo "================================="
