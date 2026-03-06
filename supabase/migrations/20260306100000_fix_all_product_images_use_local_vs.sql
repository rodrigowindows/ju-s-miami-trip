-- ══════════════════════════════════════════════════════════════
-- FIX ALL PRODUCT IMAGES
--
-- 1. Victoria's Secret products → use LOCAL images from /images/products/vs/
-- 2. Keep the 12 Amazon CDN URLs that actually work (verified 200)
-- 3. All other broken Amazon URLs → set to empty so frontend shows
--    branded placeholder (placehold.co with brand name + category color)
-- ══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────
-- VICTORIA'S SECRET - Body Mists → Local Images
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
WHERE name = 'Victoria''s Secret Aqua Kiss Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-midnight-bloom-mist.jpg'
WHERE name = 'Victoria''s Secret Midnight Bloom Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-shimmer-mist.jpg'
WHERE name = 'Victoria''s Secret Bombshell Shimmer Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-pink-fresh-clean-mist.jpg'
WHERE name = 'Victoria''s Secret PINK Fresh & Clean Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-pink-warm-cozy-mist.jpg'
WHERE name = 'Victoria''s Secret PINK Warm & Cozy Body Mist 250ml' AND brand ILIKE '%Victoria%';

-- ──────────────────────────────────────────────────────────────
-- VICTORIA'S SECRET - Eau de Parfum → Local Images
-- ──────────────────────────────────────────────────────────────

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
WHERE name = 'Victoria''s Secret Bombshell Passion Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-tease-creme-cloud-edp.jpg'
WHERE name = 'Victoria''s Secret Tease Crème Cloud Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

-- EDPs sem imagem local dedicada → usar bombshell-edp como referencia VS
UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-edp.jpg'
WHERE name = 'Victoria''s Secret Bare Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-edp.jpg'
WHERE name = 'Victoria''s Secret Wicked Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-heavenly-edp.jpg'
WHERE name = 'Victoria''s Secret Dream Angels Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-edp.jpg'
WHERE name = 'Victoria''s Secret Love Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

-- ──────────────────────────────────────────────────────────────
-- VICTORIA'S SECRET - Body Lotions → Local Images
-- ──────────────────────────────────────────────────────────────

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-lotion.jpg'
WHERE name = 'Victoria''s Secret Bombshell Body Lotion 236ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-pure-seduction-lotion.jpg'
WHERE name = 'Victoria''s Secret Pure Seduction Body Lotion 236ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-love-spell-mist.jpg'
WHERE name = 'Victoria''s Secret Love Spell Body Lotion 236ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bare-vanilla-mist.jpg'
WHERE name = 'Victoria''s Secret Bare Vanilla Body Lotion 236ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-velvet-petals-mist.jpg'
WHERE name = 'Victoria''s Secret Velvet Petals Body Lotion 236ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-coconut-passion-mist.jpg'
WHERE name = 'Victoria''s Secret Coconut Passion Body Lotion 236ml' AND brand ILIKE '%Victoria%';

-- ──────────────────────────────────────────────────────────────
-- VICTORIA'S SECRET - Body Care → Local Images
-- ──────────────────────────────────────────────────────────────

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-mist.jpg'
WHERE name = 'Victoria''s Secret Bombshell Body Butter 200ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-pure-seduction-mist.jpg'
WHERE name = 'Victoria''s Secret Pure Seduction Body Scrub 283g' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-love-spell-body-wash.jpg'
WHERE name ILIKE '%Victoria%Love Spell%Body Wash%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-love-spell-body-wash.jpg'
WHERE name ILIKE '%Victoria%Love Spell%Crème%Body Wash%' AND brand ILIKE '%Victoria%';

-- ──────────────────────────────────────────────────────────────
-- VICTORIA'S SECRET - Kits & Gift Sets → Local Images
-- ──────────────────────────────────────────────────────────────

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-kit.jpg'
WHERE name = 'Victoria''s Secret Kit Bombshell 3 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-pure-seduction-kit.jpg'
WHERE name = 'Victoria''s Secret Kit Pure Seduction 3 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-love-spell-kit.jpg'
WHERE name = 'Victoria''s Secret Kit Love Spell 3 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bare-vanilla-mist.jpg'
WHERE name = 'Victoria''s Secret Kit Bare Vanilla 3 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-coconut-passion-mist.jpg'
WHERE name = 'Victoria''s Secret Kit Coconut Passion 3 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-mini-mist-gift-set.jpg'
WHERE name = 'Victoria''s Secret Mini Mist Gift Set 4 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-mini-mist-gift-set.jpg'
WHERE name = 'Victoria''s Secret Travel Mist Set 5 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-rollerball.jpg'
WHERE name = 'Victoria''s Secret Bombshell Rollerball 7ml' AND brand ILIKE '%Victoria%';

-- ──────────────────────────────────────────────────────────────
-- VICTORIA'S SECRET - Fashion & Accessories → Local Images
-- ──────────────────────────────────────────────────────────────

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-mist.jpg'
WHERE name ILIKE '%Victoria%Necessaire%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-bombshell-mist.jpg'
WHERE name ILIKE '%Victoria%Bolsa Tote%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = '/images/products/vs/vs-pink-fresh-clean-mist.jpg'
WHERE name ILIKE '%Victoria%Chinelo%Slide%' AND brand ILIKE '%Victoria%';

-- ══════════════════════════════════════════════════════════════
-- CATCH-ALL: Fix any remaining broken Amazon CDN URLs
-- Set to empty string so frontend uses branded placeholder
-- (shows brand name with category-colored background via placehold.co)
-- ══════════════════════════════════════════════════════════════

-- Keep only the 12 verified working Amazon URLs, blank out the rest
-- Working URLs (verified 200 on 2026-03-06):
-- 61f1YfTkTDL (AirPods Pro 2)
-- 71vFKBpKakL (MacBook Air M3)
-- 71d7rfSl0wL (AirTag 4-Pack)
-- 51mWHXY8hyL (Bose QuietComfort - but may not be right product)
-- 71JB6hM6Z6L (Echo Dot)
-- 51JbsHSktkL (Bose QC)
-- 61SUj2aKoEL (Beats Studio Pro)
-- 51DpfV3dkVL (Acqua di Gio)
-- 61S7BrCBj7L (CeraVe Cream)
-- 61ajlWpkkrL (Kirkland Omega-3)
-- 31pjEqRPMcL (Kirkland Vit D3)
-- 71+H2mH61DL (Centrum Mulher)

-- Blank out all broken m.media-amazon.com URLs
-- (the frontend will show a branded placeholder with brand name)
UPDATE catalog_products
SET image_url = ''
WHERE image_url LIKE 'https://m.media-amazon.com%'
  AND image_url NOT IN (
    'https://m.media-amazon.com/images/I/61f1YfTkTDL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71vFKBpKakL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71d7rfSl0wL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/51mWHXY8hyL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71JB6hM6Z6L._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/51JbsHSktkL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/51DpfV3dkVL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61S7BrCBj7L._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61ajlWpkkrL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/31pjEqRPMcL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71+H2mH61DL._AC_SL1500_.jpg'
  );

-- Also fix any remaining Unsplash URLs (deprecated)
UPDATE catalog_products
SET image_url = ''
WHERE image_url LIKE '%unsplash.com%';

-- Also fix any remaining fimgs.net URLs (blocked hotlinking)
UPDATE catalog_products
SET image_url = ''
WHERE image_url LIKE '%fimgs.net%';
