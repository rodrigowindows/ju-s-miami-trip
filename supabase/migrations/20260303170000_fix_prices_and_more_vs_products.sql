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
  'https://m.media-amazon.com/images/I/51AhPqL8TvL._SL1500_.jpg',
  'Eau de Parfum celestial com notas de peônia branca, lírio d''água e sândalo almiscarado. Clássico atemporal.',
  true
),
(
  'Victoria''s Secret Bombshell Intense Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.95,
  'https://m.media-amazon.com/images/I/61bZQFzq0QL._SL1500_.jpg',
  'Versão mais intensa e sedutora do Bombshell com notas de cereja vermelha, peônia escarlate e baunilha sensual.',
  true
),
(
  'Victoria''s Secret Bombshell Passion Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.95,
  'https://m.media-amazon.com/images/I/51qr1VjmgJL._SL1500_.jpg',
  'EDP apaixonante com notas de maracujá dourado, jasmim sambac e musk aveludado.',
  true
),
(
  'Victoria''s Secret Tease Crème Cloud Eau de Parfum 100ml',
  'Victoria''s Secret',
  'Perfumes',
  79.95,
  'https://m.media-amazon.com/images/I/51yxC-s2EjL._SL1500_.jpg',
  'EDP gourmand e leve com notas de lavanda, chantilly e tonka cremosa. Conforto em frasco.',
  true
),
(
  'Victoria''s Secret PINK Fresh & Clean Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  'https://m.media-amazon.com/images/I/51l-JqCbfNL._SL1000_.jpg',
  'Body mist fresco da linha PINK com notas de lírio-do-vale e tangerina. Jovem e vibrante.',
  true
),
(
  'Victoria''s Secret PINK Warm & Cozy Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  'https://m.media-amazon.com/images/I/51mXq0YyEwL._SL1000_.jpg',
  'Body mist aconchegante da linha PINK com notas de baunilha, iris e almíscar suave.',
  true
),
(
  'Victoria''s Secret Aqua Kiss Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  'https://m.media-amazon.com/images/I/51o0AaV9CmL._SL1000_.jpg',
  'Body mist refrescante com notas de chuva de primavera e margarida. Leve e clean.',
  true
),
(
  'Victoria''s Secret Midnight Bloom Body Mist 250ml',
  'Victoria''s Secret',
  'Perfumes',
  18.50,
  'https://m.media-amazon.com/images/I/51j-ViXyBkL._SL1000_.jpg',
  'Body mist floral noturno com notas de jasmim, íris negra e musk escuro. Para noites especiais.',
  true
),
(
  'Victoria''s Secret Bombshell Shimmer Body Mist 250ml',
  'Victoria''s Secret',
  'Beauty',
  25.00,
  'https://m.media-amazon.com/images/I/51pAEF+fXBL._SL1000_.jpg',
  'Body mist com brilho dourado na fragrância Bombshell. Perfume + glow em um só produto.',
  true
),
(
  'Victoria''s Secret Kit Pure Seduction 3 Peças',
  'Victoria''s Secret',
  'Perfumes',
  42.00,
  'https://m.media-amazon.com/images/I/71bK7gHxCjL._SL1500_.jpg',
  'Kit com body mist, loção corporal e shower gel na fragrância Pure Seduction. Presente ideal.',
  true
),
(
  'Victoria''s Secret Kit Love Spell 3 Peças',
  'Victoria''s Secret',
  'Perfumes',
  42.00,
  'https://m.media-amazon.com/images/I/71Q3xc5sHOL._SL1500_.jpg',
  'Kit completo Love Spell com body mist, loção e shower gel. Fragrância romântica e floral.',
  true
),
(
  'Victoria''s Secret Mini Mist Gift Set 4 Peças',
  'Victoria''s Secret',
  'Perfumes',
  35.00,
  'https://m.media-amazon.com/images/I/71x8e5QXNxL._SL1500_.jpg',
  'Set com 4 mini body mists (75ml cada): Bombshell, Pure Seduction, Love Spell e Bare Vanilla. Perfeito para experimentar.',
  true
),
(
  'Victoria''s Secret Bombshell Rollerball 7ml',
  'Victoria''s Secret',
  'Perfumes',
  18.00,
  'https://m.media-amazon.com/images/I/41cTXnhpDTL._SL1000_.jpg',
  'Rollerball compacto do EDP Bombshell. Perfeito para levar na bolsa e reaplicar durante o dia.',
  true
),
(
  'Victoria''s Secret Love Spell La Crème Body Wash 250ml',
  'Victoria''s Secret',
  'Beauty',
  18.50,
  'https://m.media-amazon.com/images/I/51oB8r7n5vL._SL1000_.jpg',
  'Sabonete líquido cremoso com fragrância Love Spell. Banho perfumado e pele macia.',
  true
)
ON CONFLICT DO NOTHING;
