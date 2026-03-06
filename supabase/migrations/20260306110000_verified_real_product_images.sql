-- ══════════════════════════════════════════════════════════════
-- VERIFIED REAL PRODUCT IMAGES
--
-- All URLs verified to return HTTP 200 on 2026-03-06.
-- Extracted from actual Amazon product pages using ASIN lookups.
-- ══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────
-- TECH / APPLE (verified from Amazon product pages)
-- ──────────────────────────────────────────────────────────────

-- ASIN: B0D1XD1ZV3
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'
WHERE name = 'AirPods Pro 2' AND brand = 'Apple';

-- ASIN: B0DHJ896RY
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61bOls8zUZL._AC_SL1500_.jpg'
WHERE name = 'iPhone 16 Pro Max 256GB' AND brand = 'Apple';

-- ASIN: B0CX24BN3L
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71O14N5GYLL._AC_SL1500_.jpg'
WHERE name ILIKE '%MacBook Air M3 15%' AND brand = 'Apple';

-- ASIN: B0D3J98W75
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/7147JzEtrqL._AC_SL1500_.jpg'
WHERE name ILIKE '%iPad Pro 13%M4%' AND brand = 'Apple';

-- ASIN: B0DGHYDYMR
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81LqeMp4GRL._AC_SL1500_.jpg'
WHERE name ILIKE '%Apple Watch Ultra 2%' AND brand = 'Apple';

-- ASIN: B0DGHKP48R
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41I8pqWpYkL._AC_SL1200_.jpg'
WHERE name = 'iPhone 16 Pro Case MagSafe' AND brand = 'Apple';

-- ASIN: B0D54JZTHY
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61bMNCeAUAL._AC_SL1500_.jpg'
WHERE name = 'AirTag 4-Pack' AND brand = 'Apple';

-- ASIN: B0D3J71RM7
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41iLLpfSWxL._AC_SL1500_.jpg'
WHERE name = 'Apple Pencil Pro' AND brand = 'Apple';

-- ASIN: B0FQFKMMYB
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/5186BhHRqbL._AC_SL1500_.jpg'
WHERE name = 'Carregador MagSafe Apple' AND brand = 'Apple';

-- ASIN: B0DGJ2NM9S
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61seN4mfgOL._AC_SL1500_.jpg'
WHERE name = 'Apple Watch SE 44mm' AND brand = 'Apple';

-- ASIN: B0D3J63BWD
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71YMMFyaCPL._AC_SL1500_.jpg'
WHERE name = 'Magic Keyboard iPad Pro' AND brand = 'Apple';

-- ASIN: B0DGJC52FP
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/715izx6g41L._AC_SL1500_.jpg'
WHERE name = 'AirPods Max USB-C' AND brand = 'Apple';

-- ──────────────────────────────────────────────────────────────
-- TECH / GAMING & ELECTRONICS
-- ──────────────────────────────────────────────────────────────

-- ASIN: B08FC5L3RG
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51QKZfyi-dL._SL1465_.jpg'
WHERE name ILIKE '%PlayStation 5%' AND brand = 'Sony';

-- ASIN: B098RKWHHZ
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61nqNujSF2L._SL1330_.jpg'
WHERE name ILIKE '%Nintendo Switch OLED%' AND brand = 'Nintendo';

-- ASIN: B0CFPJYX7P
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71YwNBmu+aL._AC_SL1500_.jpg'
WHERE name ILIKE '%Kindle Paperwhite%' AND brand = 'Amazon';

-- ASIN: B09B8V1LZ3
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71jJawyjDFL._AC_SL1500_.jpg'
WHERE name ILIKE '%Echo Dot%' AND brand = 'Amazon';

-- ASIN: B0DCLRRHSP
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/613kXwYXRjL._AC_SL1500_.jpg'
WHERE name ILIKE '%GoPro Hero%' AND brand = 'GoPro';

-- ──────────────────────────────────────────────────────────────
-- TECH / AUDIO
-- ──────────────────────────────────────────────────────────────

-- ASIN: B08X4YMTPM
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61qMO3TS2RL._AC_SL1500_.jpg'
WHERE name = 'JBL Charge 5' AND brand = 'JBL';

-- ASIN: B09GJZKQ3K
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/614f5R8ReXL._AC_SL1500_.jpg'
WHERE name = 'JBL Flip 6' AND brand = 'JBL';

-- ASIN: B0CCZ1SQ8G
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51y5xR-XcfL._AC_SL1500_.jpg'
WHERE name ILIKE '%Bose QuietComfort%' AND brand = 'Bose';

-- ASIN: B0C8PR4W22
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61u-OaDSfQL._AC_SL1500_.jpg'
WHERE name ILIKE '%Beats Studio Pro%' AND brand = 'Beats';
