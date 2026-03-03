/**
 * Upload product images to Supabase Storage
 *
 * Prerequisites:
 *   1. Run migration 20260303180000_create_product_images_bucket.sql first
 *   2. Set SUPABASE_SERVICE_ROLE_KEY env var
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=your-key npx tsx scripts/upload-product-images.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const SUPABASE_URL = "https://aleenmfaugxymtxqlyyz.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error("Set SUPABASE_SERVICE_ROLE_KEY env var before running.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const BUCKET = "product-images";
const IMG_DIR = path.resolve(__dirname, "../tmp/product-images/vs");

/** product name in DB → local filename (without .jpg) */
const IMAGE_MAP: Record<string, string> = {
  "Victoria's Secret Bombshell Body Mist 250ml": "vs-bombshell-mist",
  "Victoria's Secret Tease Body Mist 250ml": "vs-tease-mist",
  "Victoria's Secret Velvet Petals Body Mist 250ml": "vs-velvet-petals-mist",
  "Victoria's Secret Pure Seduction Body Mist 250ml": "vs-pure-seduction-mist",
  "Victoria's Secret Love Spell Body Mist 250ml": "vs-love-spell-mist",
  "Victoria's Secret Bare Vanilla Body Mist 250ml": "vs-bare-vanilla-mist",
  "Victoria's Secret Coconut Passion Body Mist 250ml": "vs-coconut-passion-mist",
  "Victoria's Secret Amber Romance Body Mist 250ml": "vs-amber-romance-mist",
  "Victoria's Secret Strawberries & Champagne Body Mist 250ml": "vs-strawberries-champagne-mist",
  "Victoria's Secret Aqua Kiss Body Mist 250ml": "vs-aqua-kiss-mist",
  "Victoria's Secret Midnight Bloom Body Mist 250ml": "vs-midnight-bloom-mist",
  "Victoria's Secret Bombshell Shimmer Body Mist 250ml": "vs-bombshell-shimmer-mist",
  "Victoria's Secret PINK Fresh & Clean Body Mist 250ml": "vs-pink-fresh-clean-mist",
  "Victoria's Secret PINK Warm & Cozy Body Mist 250ml": "vs-pink-warm-cozy-mist",
  "Victoria's Secret Bombshell Eau de Parfum 100ml": "vs-bombshell-edp",
  "Victoria's Secret Tease Eau de Parfum 100ml": "vs-tease-edp",
  "Victoria's Secret Noir Tease Eau de Parfum 100ml": "vs-noir-tease-edp",
  "Victoria's Secret Very Sexy Eau de Parfum 100ml": "vs-very-sexy-edp",
  "Victoria's Secret Heavenly Eau de Parfum 100ml": "vs-heavenly-edp",
  "Victoria's Secret Bombshell Intense Eau de Parfum 100ml": "vs-bombshell-intense-edp",
  "Victoria's Secret Bombshell Passion Eau de Parfum 100ml": "vs-bombshell-passion-edp",
  "Victoria's Secret Tease Crème Cloud Eau de Parfum 100ml": "vs-tease-creme-cloud-edp",
  "Victoria's Secret Bombshell Body Lotion 236ml": "vs-bombshell-lotion",
  "Victoria's Secret Pure Seduction Body Lotion 236ml": "vs-pure-seduction-lotion",
  "Victoria's Secret Love Spell La Crème Body Wash 250ml": "vs-love-spell-body-wash",
  "Victoria's Secret Kit Bombshell 3 Peças": "vs-bombshell-kit",
  "Victoria's Secret Kit Pure Seduction 3 Peças": "vs-pure-seduction-kit",
  "Victoria's Secret Kit Love Spell 3 Peças": "vs-love-spell-kit",
  "Victoria's Secret Mini Mist Gift Set 4 Peças": "vs-mini-mist-gift-set",
  "Victoria's Secret Bombshell Rollerball 7ml": "vs-bombshell-rollerball",
};

async function main() {
  let uploaded = 0;
  let failed = 0;

  for (const [productName, filename] of Object.entries(IMAGE_MAP)) {
    const filePath = path.join(IMG_DIR, `${filename}.jpg`);
    const storagePath = `vs/${filename}.jpg`;

    if (!fs.existsSync(filePath)) {
      console.warn(`SKIP (file not found): ${filename}.jpg`);
      failed++;
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error(`FAIL upload ${filename}: ${uploadError.message}`);
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
      .eq("name", productName);

    if (updateError) {
      console.error(`FAIL update DB for ${productName}: ${updateError.message}`);
      failed++;
      continue;
    }

    console.log(`OK: ${productName} → ${publicUrl}`);
    uploaded++;
  }

  console.log(`\nDone: ${uploaded} uploaded, ${failed} failed`);
}

main().catch(console.error);
