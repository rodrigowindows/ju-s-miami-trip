-- ══════════════════════════════════════════════════════════════
-- UPDATE image_url_2 WITH REAL PRODUCT IMAGE URLs
--
-- Uses verified image URLs from:
--   - img.perfume.com (stable CDN, product images)
--   - img.fragrancex.com (stable CDN, product images)
--   - i.ebayimg.com (product listing images)
--
-- Each product gets a DIFFERENT image from its primary image_url,
-- showing alternate angles, gift set views, or related product shots.
-- ══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- VICTORIA'S SECRET - Body Mists
-- ═══════════════════════════════════════════════════════════

-- 1. Bombshell Body Mist → Use fragrancex Bombshell EDP image (different product form)
UPDATE public.catalog_products SET image_url_2 = 'https://img.fragrancex.com/images/products/sku/large/vicbomb.jpg'
WHERE name ILIKE '%Bombshell Body Mist%' AND brand ILIKE '%Victoria%';

-- 2. Tease Body Mist → Use perfume.com Tease parent image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/75205w.jpg'
WHERE name ILIKE '%Tease Body Mist%' AND brand ILIKE '%Victoria%';

-- 3. Velvet Petals Body Mist → Use perfume.com Velvet Petals SKU image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/sku/small/vsvp84w.jpg'
WHERE name ILIKE '%Velvet Petals Body Mist%' AND brand ILIKE '%Victoria%';

-- 4. Pure Seduction Body Mist → Use perfume.com Pure Seduction parent image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/73553w.jpg'
WHERE name ILIKE '%Pure Seduction Body Mist%' AND brand ILIKE '%Victoria%';

-- 5. Love Spell Body Mist → Use perfume.com Love Spell SKU image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/sku/small/vsls84w.jpg'
WHERE name ILIKE '%Love Spell Body Mist%' AND brand ILIKE '%Victoria%';

-- 6. Bare Vanilla Body Mist → Use perfume.com Bare Vanilla parent image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/78031w.jpg'
WHERE name ILIKE '%Bare Vanilla Body Mist%' AND brand ILIKE '%Victoria%';

-- 7. Coconut Passion Body Mist → Use perfume.com Coconut Passion parent image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/78140w.jpg'
WHERE name ILIKE '%Coconut Passion Body Mist%' AND brand ILIKE '%Victoria%';

-- 8. Amber Romance Body Mist → Use perfume.com Amber Romance SKU image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/sku/small/ambr84fmw.jpg'
WHERE name ILIKE '%Amber Romance Body Mist%' AND brand ILIKE '%Victoria%';

-- 9. Strawberries & Champagne Body Mist → Use fragrancex Strawberries & Champagne parent image
UPDATE public.catalog_products SET image_url_2 = 'https://img.fragrancex.com/images/products/parent/medium/73587w.jpg'
WHERE name ILIKE '%Strawberries%Champagne%' AND brand ILIKE '%Victoria%';

-- 10. Aqua Kiss Body Mist → Use perfume.com Aqua Kiss parent image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/78280w.jpg'
WHERE name ILIKE '%Aqua Kiss Body Mist%' AND brand ILIKE '%Victoria%';

-- 11. Midnight Bloom Body Mist → Use perfume.com Velvet Petals parent (similar dark floral theme)
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/78034w.jpg'
WHERE name ILIKE '%Midnight Bloom Body Mist%' AND brand ILIKE '%Victoria%';

-- 12. Bombshell Shimmer Body Mist → Use fragrancex Bombshell Intense image (different variant)
UPDATE public.catalog_products SET image_url_2 = 'https://img.fragrancex.com/images/products/sku/large/bombin34.jpg'
WHERE name ILIKE '%Bombshell Shimmer Body Mist%' AND brand ILIKE '%Victoria%';

-- 13. PINK Fresh & Clean Body Mist → Use perfume.com Aqua Kiss SKU (fresh/clean theme)
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/sku/small/vsak84w.jpg'
WHERE name ILIKE '%PINK Fresh%Clean%' AND brand ILIKE '%Victoria%';

-- 14. PINK Warm & Cozy Body Mist → Use perfume.com Bare Vanilla SKU (warm/cozy theme)
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/sku/small/vsbv84w.jpg'
WHERE name ILIKE '%PINK Warm%Cozy%' AND brand ILIKE '%Victoria%';

-- ═══════════════════════════════════════════════════════════
-- VICTORIA'S SECRET - Eau de Parfum
-- ═══════════════════════════════════════════════════════════

-- 15. Bombshell EDP → Use perfume.com Bombshell Intense parent (similar but different)
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/78017w.jpg'
WHERE name ILIKE '%Bombshell Eau de Parfum%' AND name NOT ILIKE '%Intense%' AND name NOT ILIKE '%Passion%' AND brand ILIKE '%Victoria%';

-- 16. Tease EDP → Use fragrancex Tease Creme Cloud image
UPDATE public.catalog_products SET image_url_2 = 'https://img.fragrancex.com/images/products/sku/large/vicvcw.jpg'
WHERE name ILIKE '%Tease Eau de Parfum%' AND name NOT ILIKE '%Creme%' AND name NOT ILIKE '%Crème%' AND brand ILIKE '%Victoria%';

-- 17. Noir Tease EDP → Use perfume.com Noir Tease parent image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/69198w.jpg'
WHERE name ILIKE '%Noir Tease%' AND brand ILIKE '%Victoria%';

-- 18. Very Sexy EDP → Use fragrancex Very Sexy SKU image
UPDATE public.catalog_products SET image_url_2 = 'https://img.fragrancex.com/images/products/sku/large/vspw17ps.jpg'
WHERE name ILIKE '%Very Sexy%EDP%' OR (name ILIKE '%Very Sexy%Eau de Parfum%' AND brand ILIKE '%Victoria%');

-- 19. Heavenly EDP → Use fragrancex Heavenly SKU image
UPDATE public.catalog_products SET image_url_2 = 'https://img.fragrancex.com/images/products/sku/large/heav34wvs.jpg'
WHERE name ILIKE '%Heavenly%Eau de Parfum%' AND brand ILIKE '%Victoria%';

-- 20. Bombshell Intense EDP → Use fragrancex Bombshell Intense SKU image
UPDATE public.catalog_products SET image_url_2 = 'https://img.fragrancex.com/images/products/sku/large/bombin34.jpg'
WHERE name ILIKE '%Bombshell Intense%Eau de Parfum%' AND brand ILIKE '%Victoria%';

-- 21. Bombshell Passion EDP → Use fragrancex Bombshell Passion parent image
UPDATE public.catalog_products SET image_url_2 = 'https://img.fragrancex.com/images/products/parent/medium/79492w.jpg'
WHERE name ILIKE '%Bombshell Passion%Eau de Parfum%' AND brand ILIKE '%Victoria%';

-- 22. Tease Crème Cloud EDP → Use perfume.com Tease Creme Cloud parent image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/80433w.jpg'
WHERE name ILIKE '%Tease Cr_me Cloud%' OR (name ILIKE '%Tease Creme Cloud%' AND brand ILIKE '%Victoria%');

-- ═══════════════════════════════════════════════════════════
-- VICTORIA'S SECRET - Body Care (Lotion, Wash)
-- ═══════════════════════════════════════════════════════════

-- 23. Bombshell Body Lotion → Use fragrancex Bombshell EDP (different product form)
UPDATE public.catalog_products SET image_url_2 = 'https://img.fragrancex.com/images/products/sku/large/vicbomb.jpg'
WHERE name ILIKE '%Bombshell Body Lotion%' AND brand ILIKE '%Victoria%';

-- 24. Pure Seduction Body Lotion → Use perfume.com Pure Seduction SKU image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/sku/small/vspsed84.jpg'
WHERE name ILIKE '%Pure Seduction Body Lotion%' AND brand ILIKE '%Victoria%';

-- 25. Love Spell Body Wash → Use perfume.com Love Spell parent image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/73552w.jpg'
WHERE name ILIKE '%Love Spell%Body Wash%' AND brand ILIKE '%Victoria%';

-- ═══════════════════════════════════════════════════════════
-- VICTORIA'S SECRET - Kits & Gift Sets
-- ═══════════════════════════════════════════════════════════

-- 26. Kit Bombshell → Use perfume.com Bombshell Intense parent image (premium look)
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/78017w.jpg'
WHERE name ILIKE '%Kit Bombshell%' AND brand ILIKE '%Victoria%';

-- 27. Kit Pure Seduction → Use perfume.com Pure Seduction parent image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/73553w.jpg'
WHERE name ILIKE '%Kit Pure Seduction%' AND brand ILIKE '%Victoria%';

-- 28. Kit Love Spell → Use perfume.com Love Spell parent image
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/73552w.jpg'
WHERE name ILIKE '%Kit Love Spell%' AND brand ILIKE '%Victoria%';

-- 29. Mini Mist Gift Set → Use perfume.com Bare Vanilla parent (one of the included scents)
UPDATE public.catalog_products SET image_url_2 = 'https://img.perfume.com/images/products/parent/medium/78031w.jpg'
WHERE name ILIKE '%Mini Mist Gift Set%' AND brand ILIKE '%Victoria%';

-- 30. Bombshell Rollerball → Use fragrancex Bombshell EDP image (same fragrance, different form)
UPDATE public.catalog_products SET image_url_2 = 'https://img.fragrancex.com/images/products/sku/large/vicbomb.jpg'
WHERE name ILIKE '%Bombshell Rollerball%' AND brand ILIKE '%Victoria%';
