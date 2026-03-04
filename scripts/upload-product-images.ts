/**
 * Download ALL product images and upload to Supabase Storage
 *
 * This script:
 *   1. Fetches all products from catalog_products
 *   2. Downloads each image from its current URL (Amazon, Apple, Unsplash, etc.)
 *   3. Uploads to Supabase Storage bucket "product-images"
 *   4. Updates the database with the new Supabase Storage public URL
 *
 * Prerequisites:
 *   - Supabase Storage bucket "product-images" must exist (public)
 *   - SUPABASE_SERVICE_ROLE_KEY env var must be set
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your-key npx tsx scripts/upload-product-images.ts
 *
 * Options:
 *   --dry-run    Show what would be done without uploading
 *   --force      Re-upload even if already on Supabase Storage
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://aleenmfaugxymtxqlyyz.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "product-images";
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");

if (!SERVICE_KEY) {
  console.error("❌ Set SUPABASE_SERVICE_ROLE_KEY env var before running.");
  console.error("   SUPABASE_SERVICE_ROLE_KEY=your-key npx tsx scripts/upload-product-images.ts");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

/** Generate a clean filename from product name */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Detect content type from response headers or URL */
function getContentType(url: string, headers: Headers): string {
  const ct = headers.get("content-type");
  if (ct?.includes("image/png")) return "image/png";
  if (ct?.includes("image/webp")) return "image/webp";
  if (url.includes(".png")) return "image/png";
  if (url.includes(".webp")) return "image/webp";
  return "image/jpeg";
}

/** Get file extension from content type */
function getExtension(contentType: string): string {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  return "jpg";
}

/** Download image with retries */
async function downloadImage(url: string, retries = 3): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          "Accept": "image/*,*/*",
        },
        redirect: "follow",
      });

      if (!res.ok) {
        console.warn(`  ⚠️ HTTP ${res.status} for ${url} (attempt ${i + 1})`);
        if (i < retries - 1) await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
        continue;
      }

      const buffer = await res.arrayBuffer();
      if (buffer.byteLength < 500) {
        console.warn(`  ⚠️ Tiny image (${buffer.byteLength}b) - likely blocked`);
        return null;
      }

      const contentType = getContentType(url, res.headers);
      return { buffer, contentType };
    } catch (err) {
      console.warn(`  ⚠️ Fetch error: ${(err as Error).message} (attempt ${i + 1})`);
      if (i < retries - 1) await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  return null;
}

/** Map category to storage folder */
function getFolder(category: string): string {
  const cat = category.toLowerCase();
  if (cat.includes("tech") || cat.includes("eletr")) return "tech";
  if (cat.includes("beauty") || cat.includes("beleza") || cat.includes("skincare") || cat.includes("maquiagem")) return "beauty";
  if (cat.includes("perfum") || cat.includes("fragr")) return "perfumes";
  if (cat.includes("victoria")) return "vs";
  if (cat.includes("fashion") || cat.includes("moda") || cat.includes("roupa") || cat.includes("tenis") || cat.includes("acess")) return "fashion";
  if (cat.includes("lifestyle") || cat.includes("casa") || cat.includes("bath")) return "lifestyle";
  if (cat.includes("health") || cat.includes("saude") || cat.includes("suplement") || cat.includes("vitamin")) return "supplements";
  if (cat.includes("kid") || cat.includes("baby") || cat.includes("brinquedo") || cat.includes("infantil")) return "kids";
  return "other";
}

async function main() {
  console.log(`\n🔄 Fetching all products from catalog_products...\n`);

  const { data: products, error } = await supabase
    .from("catalog_products")
    .select("id, name, brand, category, image_url")
    .eq("active", true)
    .order("category")
    .order("name");

  if (error) {
    console.error("❌ Failed to fetch products:", error.message);
    process.exit(1);
  }

  if (!products || products.length === 0) {
    console.log("No products found.");
    return;
  }

  console.log(`📦 Found ${products.length} active products\n`);

  // Ensure bucket exists
  if (!DRY_RUN) {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === BUCKET);
    if (!bucketExists) {
      console.log(`📁 Creating bucket "${BUCKET}"...`);
      const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
        public: true,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });
      if (createErr) {
        console.error("❌ Failed to create bucket:", createErr.message);
        process.exit(1);
      }
    }
  }

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of products) {
    const { id, name, brand, category, image_url } = product;

    // Skip if already on Supabase Storage (unless --force)
    if (!FORCE && image_url?.includes("supabase.co/storage")) {
      skipped++;
      continue;
    }

    // Skip if no image URL
    if (!image_url) {
      console.warn(`⏭️  [${name}] No image URL - skipping`);
      skipped++;
      continue;
    }

    const folder = getFolder(category);
    const slug = slugify(`${brand}-${name}`);

    console.log(`[${uploaded + failed + 1}/${products.length - skipped}] ${name}`);
    console.log(`  📥 Downloading: ${image_url.slice(0, 80)}...`);

    if (DRY_RUN) {
      console.log(`  📁 Would upload to: ${folder}/${slug}.jpg`);
      uploaded++;
      continue;
    }

    const result = await downloadImage(image_url);
    if (!result) {
      console.error(`  ❌ Failed to download image`);
      failed++;
      continue;
    }

    const ext = getExtension(result.contentType);
    const storagePath = `${folder}/${slug}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, result.buffer, {
        contentType: result.contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error(`  ❌ Upload failed: ${uploadError.message}`);
      failed++;
      continue;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from("catalog_products")
      .update({ image_url: publicUrl })
      .eq("id", id);

    if (updateError) {
      console.error(`  ❌ DB update failed: ${updateError.message}`);
      failed++;
      continue;
    }

    console.log(`  ✅ ${publicUrl}`);
    uploaded++;

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`✅ Uploaded: ${uploaded}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed:   ${failed}`);
  console.log(`📦 Total:    ${products.length}`);
  if (DRY_RUN) console.log(`\n⚠️  DRY RUN - no changes were made`);
}

main().catch(console.error);
