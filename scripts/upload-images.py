#!/usr/bin/env python3
"""Upload product images to Supabase Storage using curl (bypasses Node DNS issues)."""
import json, os, subprocess, re, tempfile, sys, time

SUPABASE_URL = "https://aleenmfaugxymtxqlyyz.supabase.co"
KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
BUCKET = "product-images"

if not KEY:
    print("Set SUPABASE_SERVICE_ROLE_KEY env var")
    sys.exit(1)

HEADERS = ["-H", f"apikey: {KEY}", "-H", f"Authorization: Bearer {KEY}"]

def api(method, path, data=None, binary_file=None, extra_headers=None):
    cmd = ["curl", "-s"]
    if method != "GET":
        cmd += ["-X", method]
    cmd += HEADERS
    if extra_headers:
        for h in extra_headers:
            cmd += ["-H", h]
    if data:
        cmd += ["-H", "Content-Type: application/json", "-d", json.dumps(data)]
    if binary_file:
        cmd += ["--data-binary", f"@{binary_file}"]
    cmd.append(f"{SUPABASE_URL}{path}")
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    try:
        return json.loads(r.stdout)
    except:
        return {"raw": r.stdout}

def download(url, dest):
    cmd = ["curl", "-s", "-L", "-w", "%{http_code}", "-o", dest,
           "-H", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
           "-H", "Accept: image/*,*/*", url]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    return r.stdout.strip()

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')[:80]
    return text

def get_folder(category):
    c = category.lower()
    if any(x in c for x in ["tech", "eletr"]): return "tech"
    if any(x in c for x in ["beauty", "beleza", "skin", "maquiagem"]): return "beauty"
    if any(x in c for x in ["perfum", "fragr"]): return "perfumes"
    if "victoria" in c: return "vs"
    if any(x in c for x in ["fashion", "moda", "roupa", "tenis", "acess"]): return "fashion"
    if any(x in c for x in ["lifestyle", "casa", "bath"]): return "lifestyle"
    if any(x in c for x in ["health", "saude", "suplement", "vitamin"]): return "supplements"
    if any(x in c for x in ["kid", "baby", "brinquedo", "infantil"]): return "kids"
    return "other"

def get_mime(filepath):
    r = subprocess.run(["file", "-b", "--mime-type", filepath], capture_output=True, text=True)
    mime = r.stdout.strip()
    if "png" in mime: return "image/png", "png"
    if "webp" in mime: return "image/webp", "webp"
    return "image/jpeg", "jpg"

# Fetch products
print("Fetching products...")
products = api("GET", "/rest/v1/catalog_products?select=id,name,brand,category,image_url&active=eq.true&order=category,name")
if not isinstance(products, list):
    print(f"Error: {products}")
    sys.exit(1)

total = len(products)
print(f"Found {total} products\n")

uploaded = 0
skipped = 0
failed = 0

with tempfile.TemporaryDirectory() as tmpdir:
    imgpath = os.path.join(tmpdir, "img")

    for i, p in enumerate(products):
        pid = p["id"]
        name = p["name"]
        brand = p["brand"]
        category = p["category"]
        image_url = p.get("image_url", "") or ""

        # Skip if already on Supabase
        if "supabase.co/storage" in image_url:
            skipped += 1
            continue

        # Skip if no URL or relative URL
        if not image_url or not image_url.startswith("http"):
            print(f"[{i+1}/{total}] SKIP (no valid URL): {name}")
            skipped += 1
            continue

        folder = get_folder(category)
        slug = slugify(f"{brand}-{name}")

        print(f"[{i+1}/{total}] {name}")
        print(f"  Download: {image_url[:70]}...")

        try:
            http_code = download(image_url, imgpath)
        except Exception as e:
            print(f"  FAIL download: {e}")
            failed += 1
            continue

        if http_code not in ("200", "301", "302"):
            print(f"  FAIL: HTTP {http_code}")
            failed += 1
            continue

        size = os.path.getsize(imgpath)
        if size < 500:
            print(f"  FAIL: tiny image ({size}b)")
            failed += 1
            continue

        mime, ext = get_mime(imgpath)
        storage_path = f"{folder}/{slug}.{ext}"

        # Upload
        upload_cmd = [
            "curl", "-s", "-X", "POST",
            *HEADERS,
            "-H", f"Content-Type: {mime}",
            "-H", "x-upsert: true",
            "--data-binary", f"@{imgpath}",
            f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{storage_path}"
        ]
        r = subprocess.run(upload_cmd, capture_output=True, text=True, timeout=60)
        try:
            result = json.loads(r.stdout)
        except:
            print(f"  FAIL upload: {r.stdout[:100]}")
            failed += 1
            continue

        if "error" in result and "Key" not in result:
            print(f"  FAIL upload: {result.get('message', result)}")
            failed += 1
            continue

        # Build public URL and update DB
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{storage_path}"

        update_cmd = [
            "curl", "-s", "-X", "PATCH",
            *HEADERS,
            "-H", "Content-Type: application/json",
            "-H", "Prefer: return=minimal",
            "-d", json.dumps({"image_url": public_url}),
            f"{SUPABASE_URL}/rest/v1/catalog_products?id=eq.{pid}"
        ]
        subprocess.run(update_cmd, capture_output=True, text=True, timeout=15)

        print(f"  OK: {public_url}")
        uploaded += 1
        time.sleep(0.3)

print(f"\n{'='*50}")
print(f"Uploaded: {uploaded}")
print(f"Skipped:  {skipped}")
print(f"Failed:   {failed}")
print(f"Total:    {total}")
