-- ══════════════════════════════════════════════════════════════
-- Fix broken Unsplash image URLs (404) across all products
-- ══════════════════════════════════════════════════════════════

-- LEGO Star Wars Millennium Falcon
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400&h=400&fit=crop'
WHERE name = 'LEGO Star Wars Millennium Falcon' AND image_url LIKE '%photo-1587654780291%';

-- Barbie Dreamhouse 2024
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop'
WHERE name = 'Barbie Dreamhouse 2024' AND image_url LIKE '%photo-1613682988402%';

-- Baby Alive Grows Up
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=400&h=400&fit=crop'
WHERE name = 'Baby Alive Grows Up' AND image_url LIKE '%photo-1558618666%';

-- Carrinho Graco Modes Pramette
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop'
WHERE name = 'Carrinho Graco Modes Pramette' AND image_url LIKE '%photo-1590693563776%';

-- Kit Mamadeiras Dr. Browns
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop'
WHERE name LIKE 'Kit Mamadeiras Dr. Browns%' AND image_url LIKE '%photo-1584839404210%';

-- BBW Japanese Cherry Blossom Mist
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=400&fit=crop'
WHERE name = 'BBW Japanese Cherry Blossom Mist' AND image_url LIKE '%photo-1594035910387%';

-- BBW Eucalyptus Spearmint Candle
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=400&h=400&fit=crop'
WHERE name = 'BBW Eucalyptus Spearmint Candle' AND image_url LIKE '%photo-1602607616524%';

-- BBW Wallflower Refill 2-Pack
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&h=400&fit=crop'
WHERE name = 'BBW Wallflower Refill 2-Pack' AND image_url LIKE '%photo-1602607616524%';

-- Bath & Body Works Candle 3-Wick (original product)
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=400&h=400&fit=crop'
WHERE name = 'Bath & Body Works Candle 3-Wick' AND image_url LIKE '%photo-1602607616524%';

-- Calvin Klein Cueca Boxer 3-Pack
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop'
WHERE name = 'Calvin Klein Cueca Boxer 3-Pack' AND image_url LIKE '%photo-1584208124218%';

-- The North Face Nuptse 700 Vest
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=400&h=400&fit=crop'
WHERE name = 'The North Face Nuptse 700 Vest' AND image_url LIKE '%photo-1544966503%';

-- Biotina 10.000mcg 250 Caps
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop'
WHERE name LIKE 'Biotina%' AND image_url LIKE '%photo-1550572017%';

-- Ashwagandha 600mg 180 Caps
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop'
WHERE name LIKE 'Ashwagandha%' AND image_url LIKE '%photo-1550572017%';

-- Omega-3 Fish Oil 1000mg 400 Caps
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop'
WHERE name LIKE 'Omega-3%' AND image_url LIKE '%photo-1550572017%';

-- Vitaminas Kirkland Daily Multi
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop'
WHERE name = 'Vitaminas Kirkland Daily Multi' AND image_url LIKE '%photo-1550572017%';

-- Echo Dot 5a Geracao
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=400&h=400&fit=crop'
WHERE name LIKE 'Echo Dot%' AND image_url LIKE '%photo-1543512214%';

-- Dyson Airwrap Complete
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop'
WHERE name = 'Dyson Airwrap Complete' AND image_url LIKE '%photo-1522338242992%';

-- Whey Protein Gold Standard
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=400&h=400&fit=crop'
WHERE name = 'Whey Protein Gold Standard' AND image_url LIKE '%photo-1593095948071%';

-- Dior Addict Lip Glow
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop'
WHERE name = 'Dior Addict Lip Glow' AND image_url LIKE '%photo-1631214500115%';

-- Vitaminas Kirkland Combo (seed-live)
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop'
WHERE name = 'Vitaminas Kirkland Combo' AND image_url LIKE '%photo-1584308666744%';

-- Kindle Paperwhite 11th Gen
UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop'
WHERE name = 'Kindle Paperwhite 11th Gen' AND image_url LIKE '%photo-1594980596870%';

-- Fix order_items referencing broken Dyson URL
UPDATE order_items SET product_image_url = 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop'
WHERE product_name = 'Dyson Airwrap Complete' AND product_image_url LIKE '%photo-1522338242992%';
