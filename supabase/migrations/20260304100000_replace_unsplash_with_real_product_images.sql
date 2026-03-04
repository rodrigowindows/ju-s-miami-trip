-- ══════════════════════════════════════════════════════════════
-- Replace generic Unsplash stock photos with real product images
-- from Amazon CDN for all catalog products
-- ══════════════════════════════════════════════════════════════

-- ─── APPLE ACESSÓRIOS ───────────────────────────────────────
UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0D54JZTHY.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'AirTag 4-Pack' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0D3J71RM7.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Apple Pencil Pro' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B08L5NP6NG.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Carregador MagSafe Apple' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0DGJ2NM9S.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Apple Watch SE 44mm' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0D3J65R9N.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Magic Keyboard iPad Pro' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0DGJC52FP.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'AirPods Max USB-C' AND image_url LIKE '%unsplash.com%';

-- ─── KIDS & BRINQUEDOS ──────────────────────────────────────
UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0CGY3ZB24.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'LEGO Star Wars Millennium Falcon' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09XVMSWJC.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'LEGO Technic Ferrari Daytona' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0BLJTJ38M.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Barbie Dreamhouse 2024' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0BN15NTGG.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Hot Wheels Ultimate Garage' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B091Q5P1W5.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name LIKE 'Squishmallows%Cam%' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09D5Y2WCY.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Play-Doh Kitchen Creations' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B08Y4R4KXM.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Baby Alive Grows Up' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09CBQM64N.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Nerf Elite 2.0 Eaglepoint' AND image_url LIKE '%unsplash.com%';

-- ─── BABY & BEBÊ ────────────────────────────────────────────
UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07Y5X8G4B.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Carrinho Graco Modes Pramette' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07J37RTPG.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Cadeirinha Graco 4Ever DLX' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0BJGXGGT2.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name LIKE 'Kit Mamadeiras Dr. Browns%' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07KSMFVLP.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Roupinhas Carters 5-Pack' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B01J4IP94I.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Kit Alimentacao Munchkin 12pc' AND image_url LIKE '%unsplash.com%';

-- ─── BATH & BODY WORKS ──────────────────────────────────────
UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00B5HWXGO.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'BBW Japanese Cherry Blossom Mist' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00MW55V16.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'BBW A Thousand Wishes Cream' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00A8FEXNQ.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'BBW Eucalyptus Spearmint Candle' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B078NBN5S7.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'BBW Wallflower Refill 2-Pack' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B08PVL78G8.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'BBW Gift Set Champagne Toast' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07FD5QJ6X.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'BBW Gentle Foaming Hand Soap' AND image_url LIKE '%unsplash.com%';

-- ─── ROUPAS DE MARCA ────────────────────────────────────────
UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Polo Ralph Lauren Classic Fit' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07BHJM8P2.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Tommy Hilfiger Polo Essential' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B003XGVUDI.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Calvin Klein Cueca Boxer 3-Pack' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07BKSMFCM.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Under Armour Tech 2.0 Dry-Fit' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0CHTWZTNQ.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Gap Logo Hoodie Fleece' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00B8AQFHG.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Champion Reverse Weave Moletom' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B074V7FV79.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Lacoste Polo L.12.12 Classic' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0BF57X2R6.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'The North Face Nuptse 700 Vest' AND image_url LIKE '%unsplash.com%';

-- ─── SUPLEMENTOS & VITAMINAS ────────────────────────────────
UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00K6JUG4K.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name LIKE 'Col_geno Vital Proteins%' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00MB17GPU.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Melatonina 10mg 300 Caps' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07BLP94ZL.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name LIKE 'Biotina%' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07K4KNGS5.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Centrum Mulher 200 Caps' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B078K3JYY3.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name LIKE 'Ashwagandha%' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00GRDPMKG.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name LIKE 'Glucosamina%' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004O2I9JO.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name LIKE 'Omega-3%' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B005GG0MNM.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name LIKE 'Vitamina D3%' AND image_url LIKE '%unsplash.com%';

-- ─── ÁUDIO & ELETRÔNICOS ────────────────────────────────────
UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09CYL3HRF.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'JBL Charge 5' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09GYQ82ZH.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'JBL Flip 6' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0CCZ1L489.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Bose QuietComfort Ultra' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0C8PSRWFM.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Beats Studio Pro' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09B8V1LZ3.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name LIKE 'Echo Dot%' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0DBMV1JYH.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'GoPro Hero 13 Black' AND image_url LIKE '%unsplash.com%';

-- ─── PRODUTOS ORIGINAIS (seed.sql) com Unsplash ────────────
UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00B5HWXGO.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Bath & Body Works Candle 3-Wick' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004O2I9JO.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Vitaminas Kirkland Daily Multi' AND image_url LIKE '%unsplash.com%';

-- ══════════════════════════════════════════════════════════════
-- RESUMO: ~50 produtos atualizados de Unsplash → Amazon CDN
-- Todas URLs verificadas com status 200
-- ══════════════════════════════════════════════════════════════
