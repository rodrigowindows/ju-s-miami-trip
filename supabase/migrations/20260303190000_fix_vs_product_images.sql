-- ============================================================
-- Fix Victoria's Secret product images with working URLs
-- Uses fragrantica CDN (fimgs.net) which serves product images
-- ============================================================

-- ── Body Mists ─────────────────────────────────────────────
UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.10190.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.47870.jpg'
  WHERE name = 'Victoria''s Secret Tease Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.55363.jpg'
  WHERE name = 'Victoria''s Secret Velvet Petals Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.7989.jpg'
  WHERE name = 'Victoria''s Secret Pure Seduction Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.7988.jpg'
  WHERE name = 'Victoria''s Secret Love Spell Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.55364.jpg'
  WHERE name = 'Victoria''s Secret Bare Vanilla Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.55365.jpg'
  WHERE name = 'Victoria''s Secret Coconut Passion Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.7981.jpg'
  WHERE name = 'Victoria''s Secret Amber Romance Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.55371.jpg'
  WHERE name = 'Victoria''s Secret Strawberries & Champagne Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.55370.jpg'
  WHERE name = 'Victoria''s Secret Aqua Kiss Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.19131.jpg'
  WHERE name = 'Victoria''s Secret Midnight Bloom Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.10190.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Shimmer Body Mist 250ml';

-- ── PINK Line Body Mists ───────────────────────────────────
UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.7989.jpg'
  WHERE name = 'Victoria''s Secret PINK Fresh & Clean Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.55364.jpg'
  WHERE name = 'Victoria''s Secret PINK Warm & Cozy Body Mist 250ml';

-- ── Eau de Parfum ──────────────────────────────────────────
UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.38144.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.50825.jpg'
  WHERE name = 'Victoria''s Secret Tease Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.19131.jpg'
  WHERE name = 'Victoria''s Secret Noir Tease Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.1573.jpg'
  WHERE name = 'Victoria''s Secret Very Sexy Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.1023.jpg'
  WHERE name = 'Victoria''s Secret Heavenly Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.56355.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Intense Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.62570.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Passion Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.68550.jpg'
  WHERE name = 'Victoria''s Secret Tease Crème Cloud Eau de Parfum 100ml';

-- ── Body Lotions ───────────────────────────────────────────
UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.10190.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Body Lotion 236ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.7989.jpg'
  WHERE name = 'Victoria''s Secret Pure Seduction Body Lotion 236ml';

-- ── Body Wash ──────────────────────────────────────────────
UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.7988.jpg'
  WHERE name = 'Victoria''s Secret Love Spell La Crème Body Wash 250ml';

-- ── Gift Kits ──────────────────────────────────────────────
UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.10190.jpg'
  WHERE name = 'Victoria''s Secret Kit Bombshell 3 Peças';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.7989.jpg'
  WHERE name = 'Victoria''s Secret Kit Pure Seduction 3 Peças';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.7988.jpg'
  WHERE name = 'Victoria''s Secret Kit Love Spell 3 Peças';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.10190.jpg'
  WHERE name = 'Victoria''s Secret Mini Mist Gift Set 4 Peças';

-- ── Rollerball ─────────────────────────────────────────────
UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.38144.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Rollerball 7ml';
