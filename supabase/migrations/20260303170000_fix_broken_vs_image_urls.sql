-- ============================================================
-- Fix: Replace broken Amazon/VS CDN image URLs with reliable
-- Unsplash URLs for Victoria's Secret products
-- ============================================================

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Bombshell Body Mist 250ml'
  AND (image_url LIKE '%victoriassecret.com%' OR image_url LIKE '%m.media-amazon.com%');

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Tease Body Mist 250ml'
  AND (image_url LIKE '%victoriassecret.com%' OR image_url LIKE '%m.media-amazon.com%');

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Velvet Petals Body Mist 250ml'
  AND (image_url LIKE '%victoriassecret.com%' OR image_url LIKE '%m.media-amazon.com%');

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1590156546946-ce55a12a09e0?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Pure Seduction Body Mist 250ml'
  AND (image_url LIKE '%victoriassecret.com%' OR image_url LIKE '%m.media-amazon.com%');

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1595535352626-4ea5e6c0ad24?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Love Spell Body Mist 250ml'
  AND image_url LIKE '%m.media-amazon.com%';

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Bombshell Eau de Parfum 100ml'
  AND image_url LIKE '%m.media-amazon.com%';

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1594035910387-fea081e38543?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Tease Eau de Parfum 100ml'
  AND image_url LIKE '%m.media-amazon.com%';

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Bombshell Body Lotion 236ml'
  AND image_url LIKE '%m.media-amazon.com%';

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Pure Seduction Body Lotion 236ml'
  AND image_url LIKE '%m.media-amazon.com%';

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Bare Vanilla Body Mist 250ml'
  AND image_url LIKE '%m.media-amazon.com%';

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Coconut Passion Body Mist 250ml'
  AND image_url LIKE '%m.media-amazon.com%';

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Kit Bombshell 3 Peças'
  AND image_url LIKE '%m.media-amazon.com%';

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Amber Romance Body Mist 250ml'
  AND image_url LIKE '%m.media-amazon.com%';

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Noir Tease Eau de Parfum 100ml'
  AND image_url LIKE '%m.media-amazon.com%';

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Strawberries & Champagne Body Mist 250ml'
  AND image_url LIKE '%m.media-amazon.com%';

UPDATE public.catalog_products
SET image_url = 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=400&fit=crop'
WHERE name = 'Victoria''s Secret Very Sexy Eau de Parfum 100ml'
  AND image_url LIKE '%m.media-amazon.com%';
