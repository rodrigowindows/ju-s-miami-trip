-- ============================================================
-- Fix product prices + Add more Victoria's Secret products
-- ============================================================

-- ── Price corrections ──────────────────────────────────────
-- Chanel N°5 EDP 100ml: retail is ~$150
UPDATE public.catalog_products SET price_usd = 150.00
  WHERE name = 'Perfume Chanel N5 EDP 100ml' AND price_usd = 135.00;

-- New Balance 550: retail is $110
UPDATE public.catalog_products SET price_usd = 110.00
  WHERE name = 'New Balance 550' AND price_usd = 130.00;

-- Adidas Samba OG: retail is $100
UPDATE public.catalog_products SET price_usd = 100.00
  WHERE name = 'Adidas Samba OG' AND price_usd = 120.00;

-- VS Bombshell/Tease body mists: retail ~$21-22 on VS website
UPDATE public.catalog_products SET price_usd = 22.00
  WHERE name = 'Victoria''s Secret Bombshell Body Mist 250ml' AND price_usd = 25.00;

UPDATE public.catalog_products SET price_usd = 22.00
  WHERE name = 'Victoria''s Secret Tease Body Mist 250ml' AND price_usd = 25.00;

-- VS EDPs 100ml: retail is $79.95
UPDATE public.catalog_products SET price_usd = 79.95
  WHERE brand = 'Victoria''s Secret' AND name LIKE '%Eau de Parfum 100ml%' AND price_usd = 79.50;

-- ── More Victoria's Secret products ────────────────────────
INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active) VALUES
(
  'Victoria''s Secret Heavenly Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.95,
  '/images/products/vs/vs-heavenly-edp.jpg',
  'Eau de Parfum celestial com notas de peônia branca, lírio d''água e sândalo almiscarado. Clássico atemporal.',
  true
),
(
  'Victoria''s Secret Bombshell Intense Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.95,
  '/images/products/vs/vs-bombshell-intense-edp.jpg',
  'Versão mais intensa e sedutora do Bombshell com notas de cereja vermelha, peônia escarlate e baunilha sensual.',
  true
),
(
  'Victoria''s Secret Bombshell Passion Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.95,
  '/images/products/vs/vs-bombshell-passion-edp.jpg',
  'EDP apaixonante com notas de maracujá dourado, jasmim sambac e musk aveludado.',
  true
),
(
  'Victoria''s Secret Tease Crème Cloud Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.95,
  '/images/products/vs/vs-tease-creme-cloud-edp.jpg',
  'EDP gourmand e leve com notas de lavanda, chantilly e tonka cremosa. Conforto em frasco.',
  true
),
(
  'Victoria''s Secret PINK Fresh & Clean Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  '/images/products/vs/vs-pink-fresh-clean-mist.jpg',
  'Body mist fresco da linha PINK com notas de lírio-do-vale e tangerina. Jovem e vibrante.',
  true
),
(
  'Victoria''s Secret PINK Warm & Cozy Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  '/images/products/vs/vs-pink-warm-cozy-mist.jpg',
  'Body mist aconchegante da linha PINK com notas de baunilha, iris e almíscar suave.',
  true
),
(
  'Victoria''s Secret Aqua Kiss Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  '/images/products/vs/vs-aqua-kiss-mist.jpg',
  'Body mist refrescante com notas de chuva de primavera e margarida. Leve e clean.',
  true
),
(
  'Victoria''s Secret Midnight Bloom Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  '/images/products/vs/vs-midnight-bloom-mist.jpg',
  'Body mist floral noturno com notas de jasmim, íris negra e musk escuro. Para noites especiais.',
  true
),
(
  'Victoria''s Secret Bombshell Shimmer Body Mist 250ml',
  'Victoria''s Secret',
  'Beauty',
  25.00,
  '/images/products/vs/vs-bombshell-shimmer-mist.jpg',
  'Body mist com brilho dourado na fragrância Bombshell. Perfume + glow em um só produto.',
  true
),
(
  'Victoria''s Secret Kit Pure Seduction 3 Peças',
  'Victoria''s Secret',
  'Perfumes',
  42.00,
  '/images/products/vs/vs-pure-seduction-kit.jpg',
  'Kit com body mist, loção corporal e shower gel na fragrância Pure Seduction. Presente ideal.',
  true
),
(
  'Victoria''s Secret Kit Love Spell 3 Peças',
  'Victoria''s Secret',
  'Perfumes',
  42.00,
  '/images/products/vs/vs-love-spell-kit.jpg',
  'Kit completo Love Spell com body mist, loção e shower gel. Fragrância romântica e floral.',
  true
),
(
  'Victoria''s Secret Mini Mist Gift Set 4 Peças',
  'Victoria''s Secret',
  'Perfumes',
  35.00,
  '/images/products/vs/vs-mini-mist-gift-set.jpg',
  'Set com 4 mini body mists (75ml cada): Bombshell, Pure Seduction, Love Spell e Bare Vanilla. Perfeito para experimentar.',
  true
),
(
  'Victoria''s Secret Bombshell Rollerball 7ml',
  'Victoria''s Secret',
  'Perfumes',
  18.00,
  '/images/products/vs/vs-bombshell-rollerball.jpg',
  'Rollerball compacto do EDP Bombshell. Perfeito para levar na bolsa e reaplicar durante o dia.',
  true
),
(
  'Victoria''s Secret Love Spell La Crème Body Wash 250ml',
  'Victoria''s Secret',
  'Beauty',
  18.50,
  '/images/products/vs/vs-love-spell-body-wash.jpg',
  'Sabonete líquido cremoso com fragrância Love Spell. Banho perfumado e pele macia.',
  true
)
ON CONFLICT DO NOTHING;
