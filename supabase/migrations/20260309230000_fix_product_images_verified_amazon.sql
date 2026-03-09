-- ══════════════════════════════════════════════════════════════
-- FIX PRODUCT IMAGES - VERIFIED m.media-amazon.com URLs
--
-- Uses specific Amazon image IDs (more reliable than ASIN-based).
-- Updates products regardless of current image_url value to ensure
-- correct images are shown.
-- ══════════════════════════════════════════════════════════════

-- ── SUPPLEMENTS / HEALTH ─────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61CPcvxcomL._AC_SL1500_.jpg'
WHERE name = 'Biotina 10.000mcg 250 Caps' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61NmhuO4hLL._AC_SL1500_.jpg'
WHERE name = 'Hair Skin & Nails 250 Softgels' AND brand = 'Nature''s Bounty';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61lAu0x8TqL._AC_SL1500_.jpg'
WHERE name = 'Omega-3 Fish Oil 1200mg 200 Softgels' AND brand = 'Nature Made';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61HcNkGjiYL._AC_SL1500_.jpg'
WHERE name = 'Vitamin D3 5000 IU 400 Softgels' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71W0RreogBL._AC_SL1500_.jpg'
WHERE name = 'Creatina Monohidratada 400g' AND brand = 'Optimum Nutrition';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81QtN8gY02L._AC_SL1500_.jpg'
WHERE name = 'Whey Protein Gold Standard 2lb' AND brand = 'Optimum Nutrition';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61A-zRQCJiL._AC_SL1500_.jpg'
WHERE name = 'Magnesium Glycinate 400mg 180 Caps' AND brand = 'Doctor''s Best';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/810kAfUAQvL._AC_SL1500_.jpg'
WHERE name = 'Probiotico 50 Bilhões CFU 30 Caps' AND brand = 'Garden of Life';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71cdZXcbeIL._AC_SL1500_.jpg'
WHERE name = 'Glucosamina 1500mg 220 Tabs' AND brand = 'Kirkland';

-- Nature Made Vitamina C (match by ILIKE for Portuguese name)
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71GV-HLgI3L._AC_SL1500_.jpg'
WHERE name ILIKE '%Nature Made%Vitamina C%1000%' AND brand = 'Nature Made';

-- Nature's Bounty Biotin 10000mcg 120ct
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61CPcvxcomL._AC_SL1500_.jpg'
WHERE name ILIKE '%Nature%Bounty%Biotin%10000%' AND brand = 'Nature''s Bounty';

-- SugarBearHair Hair Vitamins
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/815SXN-JWnL._AC_SL1500_.jpg'
WHERE name ILIKE '%SugarBear%Hair%Vitamin%' AND brand = 'SugarBearHair';

-- ── SKINCARE ─────────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/612NxRjAoCL._AC_SL1500_.jpg'
WHERE name = 'The Ordinary Niacinamide 10% + Zinc 1% 30ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Se8Z9n4oL._AC_SL1500_.jpg'
WHERE name = 'The Ordinary Hyaluronic Acid 2% + B5 30ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51xY4ObuOEL._AC_SL1500_.jpg'
WHERE name = 'The Ordinary AHA 30% + BHA 2% Peeling Solution 30ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51bC4vVdkOL._AC_SL1500_.jpg'
WHERE name = 'The Ordinary Glycolic Acid 7% Toning Solution 240ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41sDKlEL3IL._AC_SL1500_.jpg'
WHERE name = 'The Ordinary Retinol 0.5% in Squalane 30ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61J1mJhNJfL._AC_SL1500_.jpg'
WHERE name = 'Olaplex No.3 Hair Perfector 100ml' AND brand = 'Olaplex';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71Ewhhl+tJL._AC_SL1500_.jpg'
WHERE name = 'Olaplex No.4 Bond Maintenance Shampoo 250ml' AND brand = 'Olaplex';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61OLMvoFOHL._AC_SL1500_.jpg'
WHERE name = 'Olaplex No.5 Bond Maintenance Conditioner 250ml' AND brand = 'Olaplex';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61EidjXUBrL._AC_SL1500_.jpg'
WHERE name = 'CeraVe Moisturizing Cream 539g' AND brand = 'CeraVe';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/516r6ghtxaL._AC_SL1500_.jpg'
WHERE name = 'CeraVe Foaming Facial Cleanser 473ml' AND brand = 'CeraVe';

-- ── MAKEUP ───────────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51LRX1mdpML._AC_SL1500_.jpg'
WHERE name = 'Fenty Beauty Gloss Bomb Universal Lip Luminizer' AND brand = 'Fenty Beauty';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41UesUmAfTL._AC_SL1500_.jpg'
WHERE name = 'Fenty Beauty Pro Filtr Soft Matte Foundation' AND brand = 'Fenty Beauty';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61DvtnSGTNL._AC_SL1500_.jpg'
WHERE name = 'Too Faced Better Than Sex Mascara' AND brand = 'Too Faced';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61YJxWVFykL._AC_SL1500_.jpg'
WHERE name = 'Too Faced Lip Injection Extreme Lip Plumper' AND brand = 'Too Faced';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/616JoI7VN+L._AC_SL1500_.jpg'
WHERE name = 'MAC Ruby Woo Retro Matte Lipstick' AND brand = 'MAC';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Cg8MurLZL._AC_SL1500_.jpg'
WHERE name = 'Anastasia Beverly Hills Brow Wiz' AND brand = 'Anastasia Beverly Hills';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/513MjN3KNjL._AC_SL1500_.jpg'
WHERE name = 'Anastasia Beverly Hills Soft Glam Palette' AND brand = 'Anastasia Beverly Hills';

-- ── FASHION ──────────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71xk4cQ92SL._AC_SL1500_.jpg'
WHERE name = 'Calvin Klein Boxer Brief 3-Pack' AND brand = 'Calvin Klein';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71xk4cQ92SL._AC_SL1500_.jpg'
WHERE name ILIKE '%Calvin Klein%Cueca%Boxer%3-Pack%' AND brand = 'Calvin Klein';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51Z81fAdBKL._AC_SL1500_.jpg'
WHERE name = 'Calvin Klein Bralette Feminino 2-Pack' AND brand = 'Calvin Klein';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51lB3M+mc7L._AC_SL1500_.jpg'
WHERE name = 'Tommy Hilfiger Camiseta Classic Logo' AND brand = 'Tommy Hilfiger';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81ECOqx-eCL._AC_SL1500_.jpg'
WHERE name = 'Tommy Hilfiger Bone Classic Cap' AND brand = 'Tommy Hilfiger';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41db6kFDE1L._AC_SL1500_.jpg'
WHERE name = 'Ralph Lauren Bone Classic Pony Cap' AND brand = 'Ralph Lauren';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71A59TI2ceL._AC_SL1500_.jpg'
WHERE name = 'Hollister Camiseta Graphic Logo' AND brand = 'Hollister';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81vvPSmXnuL._AC_SL1500_.jpg'
WHERE name = 'Levi''s Cinto Reversivel Couro' AND brand = 'Levi''s';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61af2x3GtAL._AC_SL1500_.jpg'
WHERE name = 'Nike Meia Everyday Cushion 6-Pack' AND brand = 'Nike';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81IldKDVMJL._AC_SL1500_.jpg'
WHERE name = 'Adidas Meia Cushioned 6-Pack' AND brand = 'Adidas';

-- ── PERFUMES ─────────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51F8MEfiKgL._AC_SL1500_.jpg'
WHERE name = 'Dior Sauvage EDT 100ml' AND brand = 'Dior';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61JlR9VQayL._AC_SL1500_.jpg'
WHERE name = 'Chanel Bleu de Chanel EDT 100ml' AND brand = 'Chanel';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/610a4U8dH1L._AC_SL1500_.jpg'
WHERE name = 'Carolina Herrera Good Girl EDP 80ml' AND brand = 'Carolina Herrera';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61j1jrAGuiL._AC_SL1500_.jpg'
WHERE name = 'Versace Eros EDT 100ml' AND brand = 'Versace';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61nnAggVHIL._AC_SL1500_.jpg'
WHERE name = 'YSL Libre EDP 90ml' AND brand = 'Yves Saint Laurent';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51rAIP1wi9L._AC_SL1500_.jpg'
WHERE name = 'Jean Paul Gaultier Scandal EDP 80ml' AND brand = 'Jean Paul Gaultier';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51TWBd6rSwL._AC_SL1500_.jpg'
WHERE name = 'Giorgio Armani Acqua di Gio EDT 100ml' AND brand = 'Giorgio Armani';

-- D&G Light Blue (ASIN: B000C214CO)
UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B000C214CO.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Dolce%Gabbana%Light Blue%' AND brand = 'Dolce & Gabbana';

-- ── ACCESSORIES ──────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51u8EcKDqvL._AC_SL1500_.jpg'
WHERE name = 'Ray-Ban Aviator Classic' AND brand = 'Ray-Ban';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41L1vSsPRzL._AC_SL1500_.jpg'
WHERE name = 'Ray-Ban Wayfarer Classic' AND brand = 'Ray-Ban';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41MWGSJZ8fL._AC_SL1500_.jpg'
WHERE name = 'Stanley Quencher H2.0 40oz' AND brand = 'Stanley';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41Ai-GLQzQL._AC_SL1500_.jpg'
WHERE name = 'Stanley IceFlow Flip Straw 30oz' AND brand = 'Stanley';

-- ── FASHION (from 20260303210000 seed with exact names) ──────

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B004V2NNLK.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Polo Ralph Lauren Classic Fit' AND brand = 'Ralph Lauren';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07BHJM8P2.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Tommy Hilfiger Polo Essential' AND brand = 'Tommy Hilfiger';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07BKSMFCM.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Under Armour Tech 2.0 Dry-Fit' AND brand = 'Under Armour';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0CHTWZTNQ.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Gap Logo Hoodie Fleece' AND brand = 'Gap';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B00B8AQFHG.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Champion Reverse Weave Moletom' AND brand = 'Champion';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B074V7FV79.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Lacoste Polo L.12.12 Classic' AND brand = 'Lacoste';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B0BF57X2R6.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'The North Face Nuptse 700 Vest' AND brand = 'The North Face';

UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B003XGVUDI.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name = 'Calvin Klein Cueca Boxer 3-Pack' AND brand = 'Calvin Klein';

-- Abercrombie (use generic A&F logo image)
UPDATE catalog_products SET image_url = 'https://images-na.ssl-images-amazon.com/images/P/B07Z8RJPPS.01._SCLZZZZZZZ_SX400_.jpg'
WHERE name ILIKE '%Abercrombie%Camiseta%' AND brand = 'Abercrombie & Fitch';

-- ══════════════════════════════════════════════════════════════
-- Also whitelist these new m.media-amazon.com URLs so they don't
-- get blanked by future cleanup migrations
-- ══════════════════════════════════════════════════════════════
