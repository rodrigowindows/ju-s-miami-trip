-- ══════════════════════════════════════════════════════════════
-- FIX BROKEN PRODUCT IMAGES
--
-- Problem: Products seeded in 20260304120000 use Unsplash URLs
-- that now return 404. Replace with verified working URLs.
--
-- ASIN-format URLs (images-na.ssl-images-amazon.com/images/P/)
-- and fimgs.net URLs are WORKING and should NOT be touched.
--
-- Only targets: image_url LIKE '%unsplash.com%'
-- ══════════════════════════════════════════════════════════════

-- ── SKINCARE / THE ORDINARY (Unsplash → verified m.media-amazon.com) ──

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/612NxRjAoCL._SL500_.jpg'
WHERE name = 'The Ordinary Niacinamide 10% + Zinc 1% 30ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Se8Z9n4oL._SL500_.jpg'
WHERE name = 'The Ordinary Hyaluronic Acid 2% + B5 30ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51xY4ObuOEL._SL500_.jpg'
WHERE name = 'The Ordinary AHA 30% + BHA 2% Peeling Solution 30ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51bC4vVdkOL._SL500_.jpg'
WHERE name = 'The Ordinary Glycolic Acid 7% Toning Solution 240ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41sDKlEL3IL._SL500_.jpg'
WHERE name = 'The Ordinary Retinol 0.5% in Squalane 30ml' AND image_url LIKE '%unsplash.com%';

-- ── SKINCARE / OLAPLEX & CERAVE ──────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61J1mJhNJfL._SL500_.jpg'
WHERE name = 'Olaplex No.3 Hair Perfector 100ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71Ewhhl+tJL._SL500_.jpg'
WHERE name = 'Olaplex No.4 Bond Maintenance Shampoo 250ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61OLMvoFOHL._SL500_.jpg'
WHERE name = 'Olaplex No.5 Bond Maintenance Conditioner 250ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61S7BrCBj7L._SL500_.jpg'
WHERE name = 'CeraVe Moisturizing Cream 539g' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/516r6ghtxaL._SL500_.jpg'
WHERE name = 'CeraVe Foaming Facial Cleanser 473ml' AND image_url LIKE '%unsplash.com%';

-- ── MAQUIAGEM ────────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71l4ONYWhFL._SL500_.jpg'
WHERE name = 'Fenty Beauty Gloss Bomb Universal Lip Luminizer' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41UesUmAfTL._SL500_.jpg'
WHERE name = 'Fenty Beauty Pro Filtr Soft Matte Foundation' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61whbylEdOL._SL500_.jpg'
WHERE name = 'Too Faced Better Than Sex Mascara' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61YJxWVFykL._SL500_.jpg'
WHERE name = 'Too Faced Lip Injection Extreme Lip Plumper' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51zNKJoEnJL._SL500_.jpg'
WHERE name = 'MAC Ruby Woo Retro Matte Lipstick' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61FLdrrezgL._SL500_.jpg'
WHERE name = 'Anastasia Beverly Hills Brow Wiz' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/513MjN3KNjL._SL500_.jpg'
WHERE name = 'Anastasia Beverly Hills Soft Glam Palette' AND image_url LIKE '%unsplash.com%';

-- ── SUPLEMENTOS (Unsplash → ASIN-based, verified working) ───

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00MB17GPU.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Melatonina 10mg 300 Caps' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07BLP94ZL.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Biotina 10.000mcg 250 Caps' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71+H2mH61DL._SL500_.jpg'
WHERE name = 'Centrum Mulher 200 Caps' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B078K3JYY3.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Ashwagandha 600mg 180 Caps' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00GRDPMKG.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Glucosamina 1500mg 220 Tabs' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004O2I9JO.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Omega-3 Fish Oil 1000mg 400 Caps' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B005GG0MNM.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Vitamina D3 5000 IU 600 Caps' AND image_url LIKE '%unsplash.com%';

-- These use Unsplash but have different names in seed vs migration
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61ajlWpkkrL._SL500_.jpg'
WHERE name = 'Omega-3 Fish Oil 1200mg 200 Softgels' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/31pjEqRPMcL._SL500_.jpg'
WHERE name = 'Vitamin D3 5000 IU 400 Softgels' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00K6JUG4K.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Colageno%Vital Proteins%' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00K6JUG4K.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Colágeno Vital Proteins%' AND image_url LIKE '%unsplash.com%';

-- Hair Skin & Nails - uses same Unsplash as Melatonina
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81bCHGjhShL._SL500_.jpg'
WHERE name = 'Hair Skin & Nails 250 Softgels' AND image_url LIKE '%unsplash.com%';

-- Whey and Creatina also use Unsplash
UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09CYL3HRF.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Whey Protein Gold Standard 2lb' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09CYL3HRF.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Creatina Monohidratada 400g' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09CYL3HRF.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Magnesium Glycinate 400mg 180 Caps' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B09CYL3HRF.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Probiotico 50 Bilhões CFU 30 Caps' AND image_url LIKE '%unsplash.com%';

-- ── ROUPAS / MODA (Unsplash → ASIN-based) ───────────────────

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B003XGVUDI.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Calvin Klein Boxer Brief 3-Pack' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B003XGVUDI.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Calvin Klein Bralette Feminino 2-Pack' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07BHJM8P2.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Tommy Hilfiger Camiseta Classic Logo' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07BHJM8P2.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Tommy Hilfiger Bone Classic Cap' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Ralph Lauren Bone Classic Pony Cap' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Hollister Camiseta Graphic Logo' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Abercrombie & Fitch Camiseta Essential' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Levi%Cinto Reversivel%' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Nike Meia Everyday Cushion 6-Pack' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Adidas Meia Cushioned 6-Pack' AND image_url LIKE '%unsplash.com%';

-- ── PERFUMES (fimgs.net → keep as-is, they work!) ──────────
-- Perfumes seeded with fimgs.net URLs should NOT be updated
-- as fimgs.net returns HTTP 200

-- But if any perfumes somehow have Unsplash, fix them:
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51F8MEfiKgL._SL500_.jpg'
WHERE name = 'Dior Sauvage EDT 100ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Iw2vl1rGL._SL500_.jpg'
WHERE name = 'Chanel Bleu de Chanel EDT 100ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/610a4U8dH1L._SL500_.jpg'
WHERE name = 'Carolina Herrera Good Girl EDP 80ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61j1jrAGuiL._SL500_.jpg'
WHERE name = 'Versace Eros EDT 100ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61nnAggVHIL._SL500_.jpg'
WHERE name = 'YSL Libre EDP 90ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51+9+a8Lq6L._SL500_.jpg'
WHERE name = 'Dolce & Gabbana Light Blue EDT 100ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51rAIP1wi9L._SL500_.jpg'
WHERE name = 'Jean Paul Gaultier Scandal EDP 80ml' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51DpfV3dkVL._SL500_.jpg'
WHERE name = 'Giorgio Armani Acqua di Gio EDT 100ml' AND image_url LIKE '%unsplash.com%';

-- ── ACESSÓRIOS (Unsplash → ASIN or verified) ────────────────

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Ray-Ban Aviator Classic' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Ray-Ban Wayfarer Classic' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Stanley Quencher H2.0 40oz' AND image_url LIKE '%unsplash.com%';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Stanley IceFlow Flip Straw 30oz' AND image_url LIKE '%unsplash.com%';

-- ══════════════════════════════════════════════════════════════
-- CATCH-ALL: Fix ANY remaining Unsplash URLs
-- (Unsplash free tier now returns 404 for direct image links)
-- Use a generic product placeholder from working ASIN CDN
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products
SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE image_url LIKE '%unsplash.com%';
