-- ══════════════════════════════════════════════════════════════
-- FIX VERIFIED PRODUCT IMAGES
--
-- This migration corrects the damage from 20260306120000 which
-- introduced unverified/fabricated URLs. Strategy:
-- 1. Restore 21 verified Amazon URLs (from migration 110000)
-- 2. Add new verified brand-official URLs
-- 3. Restore VS local images (from migration 100000)
-- 4. Blank out all remaining broken external URLs
--    (frontend shows branded placeholder with brand name)
--
-- ALL URLs verified with HTTP 200 on 2026-03-06.
-- ══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────
-- PHASE 1: Restore verified Amazon URLs (ASIN-based, all HTTP 200)
-- ──────────────────────────────────────────────────────────────

-- Apple products (verified ASINs)
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'
WHERE name = 'AirPods Pro 2' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61bOls8zUZL._AC_SL1500_.jpg'
WHERE name = 'iPhone 16 Pro Max 256GB' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71O14N5GYLL._AC_SL1500_.jpg'
WHERE name ILIKE '%MacBook Air M3 15%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/7147JzEtrqL._AC_SL1500_.jpg'
WHERE name ILIKE '%iPad Pro 13%M4%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81LqeMp4GRL._AC_SL1500_.jpg'
WHERE name ILIKE '%Apple Watch Ultra 2%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41I8pqWpYkL._AC_SL1200_.jpg'
WHERE name = 'iPhone 16 Pro Case MagSafe' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61bMNCeAUAL._AC_SL1500_.jpg'
WHERE name = 'AirTag 4-Pack' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41iLLpfSWxL._AC_SL1500_.jpg'
WHERE name = 'Apple Pencil Pro' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/5186BhHRqbL._AC_SL1500_.jpg'
WHERE name = 'Carregador MagSafe Apple' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61seN4mfgOL._AC_SL1500_.jpg'
WHERE name = 'Apple Watch SE 44mm' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71YMMFyaCPL._AC_SL1500_.jpg'
WHERE name = 'Magic Keyboard iPad Pro' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/715izx6g41L._AC_SL1500_.jpg'
WHERE name = 'AirPods Max USB-C' AND brand = 'Apple';

-- Gaming & Electronics (verified ASINs)
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51QKZfyi-dL._SL1465_.jpg'
WHERE name ILIKE '%PlayStation 5%' AND brand = 'Sony';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61nqNujSF2L._SL1330_.jpg'
WHERE name ILIKE '%Nintendo Switch OLED%' AND brand = 'Nintendo';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71YwNBmu+aL._AC_SL1500_.jpg'
WHERE name ILIKE '%Kindle Paperwhite%' AND brand = 'Amazon';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71jJawyjDFL._AC_SL1500_.jpg'
WHERE name ILIKE '%Echo Dot%' AND brand = 'Amazon';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/613kXwYXRjL._AC_SL1500_.jpg'
WHERE name ILIKE '%GoPro Hero%' AND brand = 'GoPro';

-- Audio (verified ASINs)
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61qMO3TS2RL._AC_SL1500_.jpg'
WHERE name = 'JBL Charge 5' AND brand = 'JBL';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/614f5R8ReXL._AC_SL1500_.jpg'
WHERE name = 'JBL Flip 6' AND brand = 'JBL';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51y5xR-XcfL._AC_SL1500_.jpg'
WHERE name ILIKE '%Bose QuietComfort%' AND brand = 'Bose';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61u-OaDSfQL._AC_SL1500_.jpg'
WHERE name ILIKE '%Beats Studio Pro%' AND brand = 'Beats';

-- ──────────────────────────────────────────────────────────────
-- PHASE 2: New verified brand-official URLs (all HTTP 200)
-- ──────────────────────────────────────────────────────────────

-- Perfumes (Dior official CDN)
UPDATE catalog_products SET image_url = 'https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dw6fd94ea5/Y0685240/Y0685240_F068524009_E01_ZHC.jpg?sw=800'
WHERE id = '680b5da0-5d5c-410e-9166-562623ad4243';

-- Beauty / Skincare (CeraVe official)
UPDATE catalog_products SET image_url = 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/skincare/cleansers/foaming-facial-cleanser/photos/foaming-facial-cleanser_front.jpg'
WHERE id = '294aba71-b380-472f-8bb5-e7bcc700743d';

UPDATE catalog_products SET image_url = 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/products-v4/moisturizing-cream/cerave_moisturizing_cream_16oz_jar_front-700x875-v4.jpg'
WHERE id = 'ce8d9d30-1795-41c4-a8f0-6d0d3af3825e';

-- The Ordinary (official CDN)
UPDATE catalog_products SET image_url = 'https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dwce8a7cdf/Images/products/The%20Ordinary/rdn-niacinamide-10pct-zinc-1pct-30ml.png?sw=400&sh=400&sm=fit'
WHERE id = '2ced2933-32fd-403f-8b08-36f0879d99e5';

UPDATE catalog_products SET image_url = 'https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dwdf7a6213/Images/products/The%20Ordinary/rdn-aha-30pct-bha-2pct-peeling-solution-30ml.png?sw=400&sh=400&sm=fit'
WHERE id = '1b65c40e-900f-441a-a89f-f4729f2fc2e5';

UPDATE catalog_products SET image_url = 'https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dw8b57fa2b/Images/products/The%20Ordinary/ord-glyc-acid-7pct-100ml-Aug-UPC.png?sw=400&sh=400&sm=fit'
WHERE id = 'd3a464ee-52c3-4655-801f-6545d2d34ace';

-- Olaplex (official Shopify CDN)
UPDATE catalog_products SET image_url = 'https://olaplex.com/cdn/shop/files/2025_No3PLUS_100ml_Product_Packshot_01_GBL_1440x1440_a2cbc609-6363-49e1-b2d2-7acd8a72672f.png?v=1771621517&width=600'
WHERE id = '4b01eb04-da0a-45a9-a546-a983cc2aff27';

UPDATE catalog_products SET image_url = 'https://olaplex.com/cdn/shop/files/1-N4_product_1440.png?v=1762271837&width=600'
WHERE id = '36d7f22d-cfcc-4668-98f4-75f17f1dbceb';

UPDATE catalog_products SET image_url = 'https://olaplex.com/cdn/shop/files/1-N5_product_1440.png?v=1762271837&width=600'
WHERE id = 'd6adee28-a095-4936-8996-dfff43bce013';

-- MAC (official CDN)
UPDATE catalog_products SET image_url = 'https://sdcdn.io/mac/us/mac_sku_M0N904_1x1_0.png?width=600&height=600'
WHERE id = 'a9b92e0c-0d84-4bae-b512-75f68929730a';

-- Too Faced (official)
UPDATE catalog_products SET image_url = 'https://www.toofaced.com/media/export/cms/products/1000x1000/2f_sku_94240_1000x1000_0.jpg'
WHERE id = 'dd8c0ca6-053d-4cd8-af6b-a164d8b19af7';

-- Sol de Janeiro (official Shopify CDN)
UPDATE catalog_products SET image_url = 'https://soldejaneiro.com/cdn/shop/files/Brazilian_Bum_Bum_Cream_Sol_de_Janeiro_0.webp?v=1713788113'
WHERE id = 'd45b225b-7f06-4d0e-98ad-4607c037079c';

-- eBay verified (Probiotico Garden of Life)
UPDATE catalog_products SET image_url = 'https://i.ebayimg.com/images/g/~Z4AAOSw42JZk3lw/s-l1600.jpg'
WHERE id = '264f1a39-b83a-42ad-b4af-2a94775e3a86';

-- ──────────────────────────────────────────────────────────────
-- PHASE 3: Restore Victoria's Secret local images
-- ──────────────────────────────────────────────────────────────

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-mist.jpg'
WHERE name = 'Victoria''s Secret Bombshell Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-tease-mist.jpg'
WHERE name = 'Victoria''s Secret Tease Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-velvet-petals-mist.jpg'
WHERE name = 'Victoria''s Secret Velvet Petals Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-pure-seduction-mist.jpg'
WHERE name = 'Victoria''s Secret Pure Seduction Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-love-spell-mist.jpg'
WHERE name = 'Victoria''s Secret Love Spell Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bare-vanilla-mist.jpg'
WHERE name = 'Victoria''s Secret Bare Vanilla Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-coconut-passion-mist.jpg'
WHERE name = 'Victoria''s Secret Coconut Passion Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-amber-romance-mist.jpg'
WHERE name = 'Victoria''s Secret Amber Romance Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-strawberries-champagne-mist.jpg'
WHERE name = 'Victoria''s Secret Strawberries & Champagne Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-aqua-kiss-mist.jpg'
WHERE name ILIKE '%Aqua Kiss%Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-midnight-bloom-mist.jpg'
WHERE name ILIKE '%Midnight Bloom%Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-shimmer-mist.jpg'
WHERE name ILIKE '%Bombshell Shimmer%Mist%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-pink-fresh-clean-mist.jpg'
WHERE name ILIKE '%PINK Fresh%Clean%Mist%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-pink-warm-cozy-mist.jpg'
WHERE name ILIKE '%PINK Warm%Cozy%Mist%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-edp.jpg'
WHERE name = 'Victoria''s Secret Bombshell Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-tease-edp.jpg'
WHERE name = 'Victoria''s Secret Tease Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-noir-tease-edp.jpg'
WHERE name = 'Victoria''s Secret Noir Tease Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-very-sexy-edp.jpg'
WHERE name = 'Victoria''s Secret Very Sexy Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-heavenly-edp.jpg'
WHERE name = 'Victoria''s Secret Heavenly Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-intense-edp.jpg'
WHERE name = 'Victoria''s Secret Bombshell Intense Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-passion-edp.jpg'
WHERE name ILIKE '%Bombshell Passion%Parfum%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-tease-creme-cloud-edp.jpg'
WHERE name ILIKE '%Tease Cr_me Cloud%Parfum%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-lotion.jpg'
WHERE name = 'Victoria''s Secret Bombshell Body Lotion 236ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-pure-seduction-lotion.jpg'
WHERE name = 'Victoria''s Secret Pure Seduction Body Lotion 236ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-kit.jpg'
WHERE name = 'Victoria''s Secret Kit Bombshell 3 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-pure-seduction-kit.jpg'
WHERE name = 'Victoria''s Secret Kit Pure Seduction 3 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-love-spell-kit.jpg'
WHERE name = 'Victoria''s Secret Kit Love Spell 3 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-mini-mist-gift-set.jpg'
WHERE name = 'Victoria''s Secret Mini Mist Gift Set 4 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-rollerball.jpg'
WHERE name = 'Victoria''s Secret Bombshell Rollerball 7ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-love-spell-body-wash.jpg'
WHERE name ILIKE '%Victoria%Love Spell%Body Wash%' AND brand ILIKE '%Victoria%';

-- ──────────────────────────────────────────────────────────────
-- PHASE 4: Clean up ALL remaining broken external URLs
-- Products without verified images get '' so frontend uses
-- branded placeholder (brand name + category-colored background)
-- ──────────────────────────────────────────────────────────────

-- Blank out fabricated Sephora URLs (sku IDs don't exist)
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%sephora.com/productimages/sku/sku%';

-- Blank out fabricated Victoria's Secret demandware URLs
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%victoriassecret.com/dw/image%'
  AND image_url LIKE '%123456%';

-- Blank out fabricated Calvin Klein demandware URLs
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%calvinklein.com/dw/image%';

-- Blank out fabricated Bath & Body Works demandware URLs
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%bathandbodyworks.com/dw/image%';

-- Blank out fabricated brand URLs (Gap, Champion, Carters, etc.)
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%gap.com/dw/image%';

UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%champion.com/dw/image%';

UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%carters.com/dw/image%';

UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%lacoste.com/dw/image%';

UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%underarmour.com/dw/image%';

UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%thenorthface.com/dw/image%';

UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%newbalance.com/dw/image%';

-- Blank out broken Tommy Hilfiger URLs
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%tommy.com/dw/image%';

-- Blank out broken Costco URLs
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%costco.com/wcsstore%';

-- Blank out broken Nike static URLs (fabricated paths)
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%static.nike.com%b7d9a3c4%';

-- Blank out broken Adidas URLs (fabricated paths)
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%assets.adidas.com%1e9b3f1c%';

-- Blank out broken Levi's URLs (may return 403)
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%lsco.scene7.com%';

-- Blank out broken Ray-Ban URLs
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%ray-ban.com%dw1a2e3f4c%';

-- Blank out broken store image URLs (Arnotts, HK TV Mall, etc.)
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%arnotts.ie%';

UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%lungfung.hk%';

UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%hktvmall.com%';

UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%vperfumes.com%';

UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%brownthomas.com%';

-- Blank out broken eBay URLs (except the verified Garden of Life one)
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%ebayimg.com%'
  AND image_url != 'https://i.ebayimg.com/images/g/~Z4AAOSw42JZk3lw/s-l1600.jpg';

-- Blank out broken Stanley AU URLs
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%au.stanley1913.com%';

-- Blank out broken Abercrombie/Hollister URLs
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%abercrombie.com%';

UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%hollisterco.com%';

-- Blank out broken Ralph Lauren URLs
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%ralphlauren.com%';

-- Blank out broken Versace URLs
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%versace.com%';

-- Blank out broken LEGO URLs
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%lego.com%';

-- Blank out broken Apple Store CDN URLs (the verified Amazon ones are used instead)
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%store.storeimages.cdn-apple.com%';

-- Blank out any remaining broken Amazon URLs not in our verified list
UPDATE catalog_products
SET image_url = ''
WHERE image_url LIKE 'https://m.media-amazon.com%'
  AND image_url NOT IN (
    'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61bOls8zUZL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71O14N5GYLL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/7147JzEtrqL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/81LqeMp4GRL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/41I8pqWpYkL._AC_SL1200_.jpg',
    'https://m.media-amazon.com/images/I/61bMNCeAUAL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/41iLLpfSWxL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/5186BhHRqbL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61seN4mfgOL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71YMMFyaCPL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/715izx6g41L._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/51QKZfyi-dL._SL1465_.jpg',
    'https://m.media-amazon.com/images/I/61nqNujSF2L._SL1330_.jpg',
    'https://m.media-amazon.com/images/I/71YwNBmu+aL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71jJawyjDFL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/613kXwYXRjL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61qMO3TS2RL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/614f5R8ReXL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/51y5xR-XcfL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61u-OaDSfQL._AC_SL1500_.jpg'
  );

-- Blank out any remaining Unsplash placeholder URLs
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%unsplash.com%';

-- Blank out fimgs.net (blocked hotlinking)
UPDATE catalog_products SET image_url = ''
WHERE image_url LIKE '%fimgs.net%';
