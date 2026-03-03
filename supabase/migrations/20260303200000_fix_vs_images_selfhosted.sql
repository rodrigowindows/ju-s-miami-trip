-- ============================================================
-- Fix VS product images: use self-hosted images from /images/products/vs/
-- These images are served from the app's own domain (no CORS issues)
-- ============================================================

-- ── Body Mists ─────────────────────────────────────────────
UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-bombshell-mist.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Body Mist 250ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-tease-mist.jpg'
  WHERE name = 'Victoria''s Secret Tease Body Mist 250ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-velvet-petals-mist.jpg'
  WHERE name = 'Victoria''s Secret Velvet Petals Body Mist 250ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-pure-seduction-mist.jpg'
  WHERE name = 'Victoria''s Secret Pure Seduction Body Mist 250ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-love-spell-mist.jpg'
  WHERE name = 'Victoria''s Secret Love Spell Body Mist 250ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-bare-vanilla-mist.jpg'
  WHERE name = 'Victoria''s Secret Bare Vanilla Body Mist 250ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-coconut-passion-mist.jpg'
  WHERE name = 'Victoria''s Secret Coconut Passion Body Mist 250ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-amber-romance-mist.jpg'
  WHERE name = 'Victoria''s Secret Amber Romance Body Mist 250ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-strawberries-champagne-mist.jpg'
  WHERE name = 'Victoria''s Secret Strawberries & Champagne Body Mist 250ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-aqua-kiss-mist.jpg'
  WHERE name = 'Victoria''s Secret Aqua Kiss Body Mist 250ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-midnight-bloom-mist.jpg'
  WHERE name = 'Victoria''s Secret Midnight Bloom Body Mist 250ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-bombshell-shimmer-mist.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Shimmer Body Mist 250ml';

-- ── PINK Line ──────────────────────────────────────────────
UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-pink-fresh-clean-mist.jpg'
  WHERE name = 'Victoria''s Secret PINK Fresh & Clean Body Mist 250ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-pink-warm-cozy-mist.jpg'
  WHERE name = 'Victoria''s Secret PINK Warm & Cozy Body Mist 250ml';

-- ── Eau de Parfum ──────────────────────────────────────────
UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-bombshell-edp.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-tease-edp.jpg'
  WHERE name = 'Victoria''s Secret Tease Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-noir-tease-edp.jpg'
  WHERE name = 'Victoria''s Secret Noir Tease Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-very-sexy-edp.jpg'
  WHERE name = 'Victoria''s Secret Very Sexy Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-heavenly-edp.jpg'
  WHERE name = 'Victoria''s Secret Heavenly Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-bombshell-intense-edp.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Intense Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-bombshell-passion-edp.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Passion Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-tease-creme-cloud-edp.jpg'
  WHERE name = 'Victoria''s Secret Tease Crème Cloud Eau de Parfum 100ml';

-- ── Body Lotions ───────────────────────────────────────────
UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-bombshell-lotion.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Body Lotion 236ml';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-pure-seduction-lotion.jpg'
  WHERE name = 'Victoria''s Secret Pure Seduction Body Lotion 236ml';

-- ── Body Wash ──────────────────────────────────────────────
UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-love-spell-body-wash.jpg'
  WHERE name = 'Victoria''s Secret Love Spell La Crème Body Wash 250ml';

-- ── Gift Kits ──────────────────────────────────────────────
UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-bombshell-kit.jpg'
  WHERE name = 'Victoria''s Secret Kit Bombshell 3 Peças';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-pure-seduction-kit.jpg'
  WHERE name = 'Victoria''s Secret Kit Pure Seduction 3 Peças';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-love-spell-kit.jpg'
  WHERE name = 'Victoria''s Secret Kit Love Spell 3 Peças';

UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-mini-mist-gift-set.jpg'
  WHERE name = 'Victoria''s Secret Mini Mist Gift Set 4 Peças';

-- ── Rollerball ─────────────────────────────────────────────
UPDATE public.catalog_products SET image_url = '/images/products/vs/vs-bombshell-rollerball.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Rollerball 7ml';
