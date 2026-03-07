-- Fix Apple Pencil Pro (white-on-white issue) and Garden of Life broken image
-- Both URLs verified with HTTP 200 and correct file sizes

-- Apple Pencil Pro: use apple.com hero image (127KB, clear product shot)
UPDATE catalog_products
SET image_url = 'https://www.apple.com/v/apple-pencil/ag/images/overview/pro/hero__cwrg2eertpyu_large.jpg'
WHERE name = 'Apple Pencil Pro' AND brand = 'Apple';

-- Garden of Life Probiotico: eBay URL was broken (1.4KB stub)
-- Clear it so frontend shows branded placeholder
UPDATE catalog_products
SET image_url = ''
WHERE name ILIKE '%Probiotico 50 Bilhoes%'
  AND brand = 'Garden of Life';
