-- Fix health/supplement product images: use locally downloaded real product images
-- Previous Amazon URLs were returning 404 or showing wrong products

-- Centrum Mulher 200 Caps - Real Centrum Women 200 Tablets packaging
UPDATE catalog_products
SET image_url = '/images/products/health/centrum-women-200.jpg'
WHERE name ILIKE '%Centrum Mulher%';

-- Melatonina 10mg 300 Caps - Real melatonin supplement bottle
UPDATE catalog_products
SET image_url = '/images/products/health/melatonina-10mg-300.jpg'
WHERE name ILIKE '%Melatonina%10mg%';

-- Biotina 10.000mcg 250 Caps - Real biotin supplement bottle
UPDATE catalog_products
SET image_url = '/images/products/health/biotina-10000mcg-250.jpg'
WHERE name ILIKE '%Biotina%10%000%';

-- Ashwagandha 600mg 180 Caps - Real ashwagandha supplement bottle
UPDATE catalog_products
SET image_url = '/images/products/health/ashwagandha-600mg-180.jpg'
WHERE name ILIKE '%Ashwagandha%600%';

-- Omega-3 Fish Oil 1000mg 400 Caps - Real Kirkland Fish Oil bottle
UPDATE catalog_products
SET image_url = '/images/products/health/kirkland-fish-oil.jpg'
WHERE name ILIKE '%Omega-3%Fish Oil%1000mg%';

-- Vitamina D3 5000 IU 600 Caps - Real Kirkland D3 bottle
UPDATE catalog_products
SET image_url = '/images/products/health/kirkland-vitamin-d3.jpg'
WHERE name ILIKE '%Vitamina D3%5000%';

-- Colágeno Vital Proteins 284g - Real Vital Proteins canister
UPDATE catalog_products
SET image_url = '/images/products/health/vital-proteins-colageno.jpg'
WHERE name ILIKE '%Colag%Vital Proteins%' OR (name ILIKE '%Colágeno%' AND brand = 'Vital Proteins');
