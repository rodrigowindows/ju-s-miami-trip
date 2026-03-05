-- ══════════════════════════════════════════════════════════════
-- RESTORE ASIN-based product images that were incorrectly
-- replaced by 20260304140000_real_product_images.sql
--
-- That migration replaced working ASIN URLs with m.media-amazon.com
-- /images/I/ URLs that return 404. This migration restores working
-- ASIN URLs for products NOT covered by verified m.media-amazon.com URLs.
--
-- Strategy:
-- 1. Products with verified m.media-amazon.com URLs (batch 1/2) → use those
-- 2. All other products → restore ASIN-based URLs that work
-- ══════════════════════════════════════════════════════════════

-- ── TECH / APPLE (restore ASIN URLs) ─────────────────────────

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0D54JZTHY.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'AirTag 4-Pack' AND brand = 'Apple'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0D3J71RM7.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Apple Pencil Pro' AND brand = 'Apple'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B08L5NP6NG.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Carregador MagSafe Apple' AND brand = 'Apple'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0DGJ2NM9S.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Apple Watch SE 44mm' AND brand = 'Apple'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0D3J65R9N.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Magic Keyboard iPad Pro' AND brand = 'Apple'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0DGJC52FP.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'AirPods Max USB-C' AND brand = 'Apple'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

-- ── TECH / GAMING & ELECTRONICS ──────────────────────────────

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09CYL3HRF.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'JBL Charge 5'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09GYQ82ZH.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'JBL Flip 6'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0CCZ1L489.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Bose QuietComfort%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0C8PSRWFM.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Beats Studio Pro%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09B8V1LZ3.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Echo Dot%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0DBMV1JYH.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%GoPro Hero%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

-- ── KIDS & BRINQUEDOS ────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0CGY3ZB24.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%LEGO%Millennium Falcon%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09XVMSWJC.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%LEGO%Ferrari%Daytona%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0BLJTJ38M.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Barbie%Dreamhouse%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0BN15NTGG.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Hot Wheels%Ultimate%Garage%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B091Q5P1W5.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Squishmallows%Cam%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09D5Y2WCY.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Play-Doh%Kitchen%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B08Y4R4KXM.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Baby Alive%Grows Up%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09CBQM64N.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Nerf%Elite%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

-- ── BABY & BEBÊ ──────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07Y5X8G4B.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Carrinho%Graco%Pramette%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07J37RTPG.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Cadeirinha%Graco%4Ever%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0BJGXGGT2.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Mamadeiras%Dr.%Brown%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07KSMFVLP.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Roupinhas%Carter%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B01J4IP94I.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Munchkin%Alimenta%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

-- ── BATH & BODY WORKS ────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00B5HWXGO.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%BBW%Japanese Cherry%Mist%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00MW55V16.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%BBW%Thousand Wishes%Cream%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00A8FEXNQ.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%BBW%Eucalyptus%Candle%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B078NBN5S7.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%BBW%Wallflower%Refill%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B08PVL78G8.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%BBW%Gift Set%Champagne%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07FD5QJ6X.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%BBW%Gentle Foaming%Hand Soap%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

-- ── FASHION / ROUPAS ─────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Polo Ralph Lauren Classic Fit'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07BHJM8P2.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Tommy Hilfiger Polo Essential'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B003XGVUDI.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Calvin Klein Cueca Boxer 3-Pack'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07BKSMFCM.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Under Armour%Tech%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0CHTWZTNQ.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Gap%Hoodie%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00B8AQFHG.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Champion%Moletom%' OR name ILIKE '%Champion%Reverse Weave%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B074V7FV79.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Lacoste%Polo%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0BF57X2R6.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%North Face%Nuptse%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

-- ── SUPLEMENTOS ──────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00MB17GPU.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Melatonina 10mg 300 Caps'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07BLP94ZL.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Biotina 10.000mcg 250 Caps'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B078K3JYY3.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Ashwagandha 600mg 180 Caps'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00GRDPMKG.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Glucosamina 1500mg 220 Tabs'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004O2I9JO.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Omega-3 Fish Oil 1000mg 400 Caps'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B005GG0MNM.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Vitamina D3 5000 IU 600 Caps%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00K6JUG4K.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Colag%Vital Proteins%'
  AND image_url NOT LIKE '%images-na.ssl-images-amazon.com%';
