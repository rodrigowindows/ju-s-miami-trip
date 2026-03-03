-- ============================================================
-- Fix VS duplicates, broken images & add diverse new products
-- ============================================================

-- ── Step 1: Remove duplicate products (keep oldest per name+brand) ──
DELETE FROM public.catalog_products
WHERE id NOT IN (
  SELECT DISTINCT ON (name, brand) id
  FROM public.catalog_products
  ORDER BY name, brand, created_at ASC
);

-- ── Step 2: Add UNIQUE constraint to prevent future duplicates ──
ALTER TABLE public.catalog_products
  ADD CONSTRAINT catalog_products_name_brand_unique UNIQUE (name, brand);

-- ── Step 3: Fix ALL Victoria's Secret image URLs ──────────────
-- Use Fragrantica fimgs.net CDN (reliable, permanent product images)

-- EDPs
UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.1573.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.55364.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Intense Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.55365.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Passion Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.15777.jpg'
  WHERE name = 'Victoria''s Secret Tease Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.55371.jpg'
  WHERE name = 'Victoria''s Secret Tease Crème Cloud Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.532.jpg'
  WHERE name = 'Victoria''s Secret Heavenly Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.12178.jpg'
  WHERE name = 'Victoria''s Secret Noir Tease Eau de Parfum 100ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.1558.jpg'
  WHERE name = 'Victoria''s Secret Very Sexy Eau de Parfum 100ml';

-- Body Mists (use each fragrance's Fragrantica image)
UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.1573.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.15777.jpg'
  WHERE name = 'Victoria''s Secret Tease Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.38144.jpg'
  WHERE name = 'Victoria''s Secret Velvet Petals Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.7981.jpg'
  WHERE name = 'Victoria''s Secret Pure Seduction Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.689.jpg'
  WHERE name = 'Victoria''s Secret Love Spell Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.50825.jpg'
  WHERE name = 'Victoria''s Secret Bare Vanilla Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.19131.jpg'
  WHERE name = 'Victoria''s Secret Coconut Passion Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.8697.jpg'
  WHERE name = 'Victoria''s Secret Amber Romance Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.10006.jpg'
  WHERE name = 'Victoria''s Secret Strawberries & Champagne Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.51440.jpg'
  WHERE name = 'Victoria''s Secret PINK Fresh & Clean Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.23966.jpg'
  WHERE name = 'Victoria''s Secret PINK Warm & Cozy Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.13636.jpg'
  WHERE name = 'Victoria''s Secret Aqua Kiss Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.45671.jpg'
  WHERE name = 'Victoria''s Secret Midnight Bloom Body Mist 250ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.1573.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Shimmer Body Mist 250ml';

-- Lotions & Body Wash
UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.1573.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Body Lotion 236ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.7981.jpg'
  WHERE name = 'Victoria''s Secret Pure Seduction Body Lotion 236ml';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.689.jpg'
  WHERE name = 'Victoria''s Secret Love Spell La Crème Body Wash 250ml';

-- Kits & Gift Sets
UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.1573.jpg'
  WHERE name = 'Victoria''s Secret Kit Bombshell 3 Peças';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.7981.jpg'
  WHERE name = 'Victoria''s Secret Kit Pure Seduction 3 Peças';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.689.jpg'
  WHERE name = 'Victoria''s Secret Kit Love Spell 3 Peças';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.1573.jpg'
  WHERE name = 'Victoria''s Secret Mini Mist Gift Set 4 Peças';

UPDATE public.catalog_products SET image_url = 'https://fimgs.net/mdimg/perfume/375x500.1573.jpg'
  WHERE name = 'Victoria''s Secret Bombshell Rollerball 7ml';

-- ── Step 4: Add new diverse VS products ──────────────────────
INSERT INTO public.catalog_products (name, brand, category, price_usd, image_url, description, active) VALUES
-- More EDPs (popular fragrances not yet in catalog)
(
  'Victoria''s Secret Bare Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.95,
  'https://fimgs.net/mdimg/perfume/375x500.72618.jpg',
  'EDP clean e moderno com notas de lavanda, iris e pele quente. A fragrância que virou febre no TikTok.',
  true
),
(
  'Victoria''s Secret Wicked Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.95,
  'https://fimgs.net/mdimg/perfume/375x500.60870.jpg',
  'EDP ousado e dark com notas de âmbar, sândalo negro e musk almiscarado. Para noites especiais.',
  true
),
(
  'Victoria''s Secret Dream Angels Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.95,
  'https://fimgs.net/mdimg/perfume/375x500.3003.jpg',
  'EDP angelical com notas de peônia, gardênia e musgo de carvalho. Romântico e etéreo.',
  true
),
(
  'Victoria''s Secret Love Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.95,
  'https://fimgs.net/mdimg/perfume/375x500.37791.jpg',
  'EDP romântico com notas de juniper, apricot blush e iris cremosa. Amor em frasco.',
  true
),
-- Body Care (Beauty category)
(
  'Victoria''s Secret Bombshell Body Butter 200ml',
  'Victoria''s Secret',
  'Beauty',
  22.00,
  'https://fimgs.net/mdimg/perfume/375x500.1573.jpg',
  'Manteiga corporal ultra-hidratante com fragrância Bombshell. Pele aveludada e perfumada por horas.',
  true
),
(
  'Victoria''s Secret Pure Seduction Body Scrub 283g',
  'Victoria''s Secret',
  'Beauty',
  18.50,
  'https://fimgs.net/mdimg/perfume/375x500.7981.jpg',
  'Esfoliante corporal com micropartículas e fragrância Pure Seduction. Pele renovada e macia.',
  true
),
(
  'Victoria''s Secret Coconut Passion Body Lotion 236ml',
  'Victoria''s Secret',
  'Beauty',
  18.50,
  'https://fimgs.net/mdimg/perfume/375x500.19131.jpg',
  'Loção corporal hidratante com coco e lírio branco. Hidratação tropical para o dia todo.',
  true
),
(
  'Victoria''s Secret Bare Vanilla Body Lotion 236ml',
  'Victoria''s Secret',
  'Beauty',
  18.50,
  'https://fimgs.net/mdimg/perfume/375x500.50825.jpg',
  'Loção corporal com baunilha e almíscar. Hidratação doce e reconfortante.',
  true
),
(
  'Victoria''s Secret Love Spell Body Lotion 236ml',
  'Victoria''s Secret',
  'Beauty',
  18.50,
  'https://fimgs.net/mdimg/perfume/375x500.689.jpg',
  'Loção corporal perfumada com cereja e flor de pêssego. Combo perfeito com o body mist.',
  true
),
(
  'Victoria''s Secret Velvet Petals Body Lotion 236ml',
  'Victoria''s Secret',
  'Beauty',
  18.50,
  'https://fimgs.net/mdimg/perfume/375x500.38144.jpg',
  'Loção corporal floral com pétalas cremosas e cacau. Hidratação delicada e feminina.',
  true
),
-- Acessórios & Fashion
(
  'Victoria''s Secret Necessaire de Viagem Pink Striped',
  'Victoria''s Secret',
  'Fashion',
  29.50,
  'https://fimgs.net/mdimg/perfume/375x500.1573.jpg',
  'Necessaire icônica com listras rosa VS. Perfeita para guardar mists, lotions e maquiagem na viagem.',
  true
),
(
  'Victoria''s Secret Bolsa Tote Canvas Logo',
  'Victoria''s Secret',
  'Fashion',
  35.00,
  'https://fimgs.net/mdimg/perfume/375x500.15777.jpg',
  'Bolsa tote grande em canvas com logo VS. Ideal para praia, compras ou dia a dia em Miami.',
  true
),
(
  'Victoria''s Secret Chinelo Slide Logo Pink',
  'Victoria''s Secret',
  'Fashion',
  24.50,
  'https://fimgs.net/mdimg/perfume/375x500.7981.jpg',
  'Chinelo slide confortável com logo PINK. Essencial para pool day e passeios casuais.',
  true
),
-- Kits e Gift Sets especiais
(
  'Victoria''s Secret Kit Bare Vanilla 3 Peças',
  'Victoria''s Secret',
  'Perfumes',
  42.00,
  'https://fimgs.net/mdimg/perfume/375x500.50825.jpg',
  'Kit com body mist, loção corporal e shower gel na fragrância Bare Vanilla. Doce e acolhedor.',
  true
),
(
  'Victoria''s Secret Travel Mist Set 5 Peças',
  'Victoria''s Secret',
  'Perfumes',
  28.00,
  'https://fimgs.net/mdimg/perfume/375x500.1573.jpg',
  'Set com 5 mini mists (75ml): Bombshell, Pure Seduction, Love Spell, Bare Vanilla e Velvet Petals. Perfeito para viagem.',
  true
),
(
  'Victoria''s Secret Kit Coconut Passion 3 Peças',
  'Victoria''s Secret',
  'Perfumes',
  39.50,
  'https://fimgs.net/mdimg/perfume/375x500.19131.jpg',
  'Kit tropical com body mist, loção e shower gel Coconut Passion. Presente com vibe de verão.',
  true
)
ON CONFLICT (name, brand) DO NOTHING;
