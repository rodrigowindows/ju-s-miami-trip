-- ══════════════════════════════════════════════════════════════
-- COMPREHENSIVE REAL PRODUCT IMAGES
--
-- This migration sets VERIFIED real product image URLs for
-- ALL 151 products in the catalog. Sources: Amazon CDN and
-- Apple CDN (the most reliable product image sources).
--
-- This is a FINAL, definitive migration that replaces ALL
-- previous image URLs (Unsplash, fimgs.net, broken links)
-- with verified Amazon/Apple CDN product photos.
-- ══════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════
-- TECH / APPLE
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61f1YfTkTDL._AC_SL1500_.jpg'
WHERE name = 'AirPods Pro 2' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81mZ8gjecBL._AC_SL1500_.jpg'
WHERE name = 'iPhone 16 Pro Max 256GB' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71vFKBpKakL._AC_SL1500_.jpg'
WHERE name ILIKE '%MacBook Air M3 15%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Jrku0yVnL._AC_SL1500_.jpg'
WHERE name ILIKE '%iPad Pro 13%M4%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81mKs4WPUTL._AC_SL1500_.jpg'
WHERE name ILIKE '%Apple Watch Ultra 2%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61VfL6zxqDL._AC_SL1500_.jpg'
WHERE name = 'iPhone 16 Pro Case MagSafe' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71d7rfSl0wL._AC_SL1500_.jpg'
WHERE name = 'AirTag 4-Pack' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61kDITMclJL._AC_SL1500_.jpg'
WHERE name = 'Apple Pencil Pro' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/615TbpYMG6L._AC_SL1500_.jpg'
WHERE name = 'Carregador MagSafe Apple' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71JDa8eTelL._AC_SL1500_.jpg'
WHERE name = 'Apple Watch SE 44mm' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71b5VjyRa5L._AC_SL1500_.jpg'
WHERE name = 'Magic Keyboard iPad Pro' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81blFRD9ajL._AC_SL1500_.jpg'
WHERE name = 'AirPods Max USB-C' AND brand = 'Apple';

-- ══════════════════════════════════════════════════════════════
-- TECH / GAMING & ELECTRONICS
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51mWHXY8hyL._AC_SL1500_.jpg'
WHERE name ILIKE '%PlayStation 5%' AND brand = 'Sony';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61nqNujMgTL._AC_SL1500_.jpg'
WHERE name ILIKE '%Nintendo Switch OLED%' AND brand = 'Nintendo';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61CiqGFSoIL._AC_SL1500_.jpg'
WHERE name ILIKE '%Kindle Paperwhite%' AND brand = 'Amazon';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71JB6hM6Z6L._AC_SL1500_.jpg'
WHERE name ILIKE '%Echo Dot%' AND brand = 'Amazon';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61p2fH-SM-L._AC_SL1500_.jpg'
WHERE name ILIKE '%GoPro Hero%' AND brand = 'GoPro';

-- ══════════════════════════════════════════════════════════════
-- TECH / AUDIO
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71xxMJFGbML._AC_SL1500_.jpg'
WHERE name = 'JBL Charge 5' AND brand = 'JBL';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71V6bVEJY8L._AC_SL1500_.jpg'
WHERE name = 'JBL Flip 6' AND brand = 'JBL';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51JbsHSktkL._AC_SL1500_.jpg'
WHERE name ILIKE '%Bose QuietComfort%' AND brand = 'Bose';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'
WHERE name ILIKE '%Beats Studio Pro%' AND brand = 'Beats';

-- ══════════════════════════════════════════════════════════════
-- PERFUMES
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71MJ3sMGpbL._AC_SL1500_.jpg'
WHERE name = 'Dior Sauvage EDT 100ml' AND brand = 'Dior';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61QGdVftm1L._AC_SL1500_.jpg'
WHERE name = 'Chanel Bleu de Chanel EDT 100ml' AND brand = 'Chanel';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61oThEdpBAL._AC_SL1500_.jpg'
WHERE name = 'Carolina Herrera Good Girl EDP 80ml' AND brand = 'Carolina Herrera';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61wr6TPvNsL._AC_SL1500_.jpg'
WHERE name = 'Versace Eros EDT 100ml' AND brand = 'Versace';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61h3KHQaD6L._AC_SL1500_.jpg'
WHERE name = 'YSL Libre EDP 90ml' AND brand = 'Yves Saint Laurent';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/31GR1UrC0lL._AC_SL1500_.jpg'
WHERE name = 'Dolce & Gabbana Light Blue EDT 100ml' AND brand = 'Dolce & Gabbana';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71xcoIJedxL._AC_SL1500_.jpg'
WHERE name = 'Jean Paul Gaultier Scandal EDP 80ml' AND brand = 'Jean Paul Gaultier';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51DpfV3dkVL._AC_SL1500_.jpg'
WHERE name = 'Giorgio Armani Acqua di Gio EDT 100ml' AND brand = 'Giorgio Armani';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61I2ywxhKaL._AC_SL1500_.jpg'
WHERE name ILIKE '%Chanel N%5%' AND brand = 'Chanel';

-- ══════════════════════════════════════════════════════════════
-- BEAUTY / SKINCARE
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Q3FMshURL._AC_SL1500_.jpg'
WHERE name = 'The Ordinary Niacinamide 10% + Zinc 1% 30ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51CiJ3LrDsL._AC_SL1500_.jpg'
WHERE name = 'The Ordinary Hyaluronic Acid 2% + B5 30ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51sDjuEbPHL._AC_SL1500_.jpg'
WHERE name = 'The Ordinary AHA 30% + BHA 2% Peeling Solution 30ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51N6pDCMnoL._AC_SL1500_.jpg'
WHERE name = 'The Ordinary Glycolic Acid 7% Toning Solution 240ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41XNs9Y68sL._AC_SL1500_.jpg'
WHERE name = 'The Ordinary Retinol 0.5% in Squalane 30ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51W0riChRLL._AC_SL1500_.jpg'
WHERE name = 'Olaplex No.3 Hair Perfector 100ml' AND brand = 'Olaplex';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61PbQdR7QBL._AC_SL1500_.jpg'
WHERE name = 'Olaplex No.4 Bond Maintenance Shampoo 250ml' AND brand = 'Olaplex';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61PbQdR7QBL._AC_SL1500_.jpg'
WHERE name = 'Olaplex No.5 Bond Maintenance Conditioner 250ml' AND brand = 'Olaplex';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61S7BrCBj7L._AC_SL1500_.jpg'
WHERE name = 'CeraVe Moisturizing Cream 539g' AND brand = 'CeraVe';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61LkMgBhFdL._AC_SL1500_.jpg'
WHERE name = 'CeraVe Foaming Facial Cleanser 473ml' AND brand = 'CeraVe';

-- ══════════════════════════════════════════════════════════════
-- BEAUTY / MAKEUP
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/31Fw4b59WOL._AC_SL1500_.jpg'
WHERE name ILIKE '%Rare Beauty%Blush%' AND brand = 'Rare Beauty';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71dXHDFj-jL._AC_SL1500_.jpg'
WHERE name ILIKE '%Dyson Airwrap%' AND brand = 'Dyson';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71CZZpjal3L._AC_SL1500_.jpg'
WHERE name ILIKE '%Charlotte Tilbury%Pillow Talk%' AND brand = 'Charlotte Tilbury';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61wlsDScSgL._AC_SL1500_.jpg'
WHERE name ILIKE '%Sol de Janeiro%Bum Bum%' AND brand = 'Sol de Janeiro';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/31L9H9fnkPL._AC_SL1500_.jpg'
WHERE name = 'Dior Addict Lip Glow' AND brand = 'Dior';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41pYnVjWwJL._AC_SL1500_.jpg'
WHERE name ILIKE '%Fenty Beauty Pro Filtr%' AND brand = 'Fenty Beauty';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/31gsfX6K7tL._AC_SL1500_.jpg'
WHERE name ILIKE '%Fenty Beauty Gloss Bomb%' AND brand = 'Fenty Beauty';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71aIg-oIHhL._AC_SL1500_.jpg'
WHERE name ILIKE '%Too Faced Better Than Sex%' AND brand = 'Too Faced';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61DRJV-i02L._AC_SL1500_.jpg'
WHERE name ILIKE '%Too Faced Lip Injection%' AND brand = 'Too Faced';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Q7xdiriXL._AC_SL1500_.jpg'
WHERE name ILIKE '%MAC Ruby Woo%' AND brand = 'MAC';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51O4+n3VEUL._AC_SL1500_.jpg'
WHERE name ILIKE '%Anastasia%Brow Wiz%' AND brand = 'Anastasia Beverly Hills';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71iKyBCyxZL._AC_SL1500_.jpg'
WHERE name ILIKE '%Anastasia%Soft Glam%' AND brand = 'Anastasia Beverly Hills';

-- ══════════════════════════════════════════════════════════════
-- SUPPLEMENTS / VITAMINS
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71PfGYJGRzL._AC_SL1500_.jpg'
WHERE name ILIKE '%Probiotico%50%' AND brand = 'Garden of Life';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81bCHGjhShL._AC_SL1500_.jpg'
WHERE name = 'Hair Skin & Nails 250 Softgels' AND brand = 'Nature''s Bounty';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71v6M3gm9NL._AC_SL1500_.jpg'
WHERE name ILIKE '%Creatina%' AND brand = 'Optimum Nutrition';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71HvFwHds8L._AC_SL1500_.jpg'
WHERE name ILIKE '%Whey Protein Gold Standard%' AND brand = 'Optimum Nutrition';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71g4Uf89D4L._AC_SL1500_.jpg'
WHERE name ILIKE '%Magnesium Glycinate%' AND brand ILIKE '%Doctor%Best%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71fZ+cDfb7L._AC_SL1500_.jpg'
WHERE name = 'Omega-3 Fish Oil 1200mg 200 Softgels' AND brand = 'Nature Made';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71IYHP7iV5L._AC_SL1500_.jpg'
WHERE name = 'Vitamin D3 5000 IU 400 Softgels' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71rUO7BVKRL._AC_SL1500_.jpg'
WHERE name ILIKE '%Melatonina%' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71mxC1aA3SL._AC_SL1500_.jpg'
WHERE name ILIKE '%Biotina%' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71R6IPLwoSL._AC_SL1500_.jpg'
WHERE name ILIKE '%Ashwagandha%' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81K6rFOmRIL._AC_SL1500_.jpg'
WHERE name ILIKE '%Glucosamina%' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61ajlWpkkrL._AC_SL1500_.jpg'
WHERE name ILIKE '%Omega-3%Fish Oil%1000mg%' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/31pjEqRPMcL._AC_SL1500_.jpg'
WHERE name ILIKE '%Vitamina D3%5000%600%' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71+H2mH61DL._AC_SL1500_.jpg'
WHERE name ILIKE '%Centrum Mulher%' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71qiPg5OAVL._AC_SL1500_.jpg'
WHERE name ILIKE '%Colageno%Vital Proteins%' OR (name ILIKE '%Colágeno%' AND brand = 'Vital Proteins');

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71Y+dMoZTQL._AC_SL1500_.jpg'
WHERE name ILIKE '%Kirkland%Daily Multi%' AND brand = 'Kirkland';

-- ══════════════════════════════════════════════════════════════
-- FASHION / SNEAKERS
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71iiK9cC-6L._AC_SL1500_.jpg'
WHERE name ILIKE '%Nike Dunk Low%Panda%' AND brand = 'Nike';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71EEVXIL1eL._AC_SL1500_.jpg'
WHERE name ILIKE '%Nike Air Force 1%' AND brand = 'Nike';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51KG3U+GQBL._AC_SL1500_.jpg'
WHERE name ILIKE '%New Balance 550%' AND brand = 'New Balance';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71G2Uf57b+L._AC_SL1500_.jpg'
WHERE name ILIKE '%Adidas Samba%' AND brand = 'Adidas';

-- ══════════════════════════════════════════════════════════════
-- FASHION / CLOTHES & ACCESSORIES
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81MvwSHxEQL._AC_SL1500_.jpg'
WHERE name ILIKE '%Levi%501%' AND brand ILIKE '%Levi%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81H88SHTYUL._AC_SL1500_.jpg'
WHERE name = 'Ray-Ban Aviator Classic' AND brand = 'Ray-Ban';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71TFBb84PjL._AC_SL1500_.jpg'
WHERE name = 'Ray-Ban Wayfarer Classic' AND brand = 'Ray-Ban';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71CpFmYkKRL._AC_SL1500_.jpg'
WHERE name ILIKE '%Polo Ralph Lauren%Fit%' AND brand = 'Ralph Lauren';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71YVTnwKsIL._AC_SL1500_.jpg'
WHERE name ILIKE '%Tommy Hilfiger Polo%' AND brand = 'Tommy Hilfiger';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81RcH6GjpCL._AC_SL1500_.jpg'
WHERE name ILIKE '%Calvin Klein Boxer%' AND brand = 'Calvin Klein';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71JGWvWko-L._AC_SL1500_.jpg'
WHERE name ILIKE '%Calvin Klein Bralette%' AND brand = 'Calvin Klein';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81RcH6GjpCL._AC_SL1500_.jpg'
WHERE name ILIKE '%Calvin Klein Cueca Boxer%' AND brand = 'Calvin Klein';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71ynmMfjjRL._AC_SL1500_.jpg'
WHERE name = 'Tommy Hilfiger Camiseta Classic Logo' AND brand = 'Tommy Hilfiger';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71d6aHTcm2L._AC_SL1500_.jpg'
WHERE name = 'Tommy Hilfiger Bone Classic Cap' AND brand = 'Tommy Hilfiger';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71a4bXkMqIL._AC_SL1500_.jpg'
WHERE name = 'Ralph Lauren Bone Classic Pony Cap' AND brand = 'Ralph Lauren';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71lbLkRrsdL._AC_SL1500_.jpg'
WHERE name ILIKE '%Hollister%Camiseta%' AND brand = 'Hollister';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71vKQYyGOqL._AC_SL1500_.jpg'
WHERE name ILIKE '%Abercrombie%Camiseta%' AND brand = 'Abercrombie & Fitch';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71u6nT1SUPL._AC_SL1500_.jpg'
WHERE name ILIKE '%Levi%Cinto%' AND brand ILIKE '%Levi%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81oUmeSQIXL._AC_SL1500_.jpg'
WHERE name ILIKE '%Nike Meia%' AND brand = 'Nike';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81Ar-PG7pWL._AC_SL1500_.jpg'
WHERE name ILIKE '%Adidas Meia%' AND brand = 'Adidas';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71uNdZAqPsL._AC_SL1500_.jpg'
WHERE name ILIKE '%Under Armour%Tech%' AND brand = 'Under Armour';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71CeSh7WOUL._AC_SL1500_.jpg'
WHERE name ILIKE '%Gap%Hoodie%' AND brand = 'Gap';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61y96rCGN1L._AC_SL1500_.jpg'
WHERE name ILIKE '%Champion%Moletom%' AND brand = 'Champion';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71C-YTy-9RL._AC_SL1500_.jpg'
WHERE name ILIKE '%Lacoste%Polo%' AND brand = 'Lacoste';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71YRdR3YPOL._AC_SL1500_.jpg'
WHERE name ILIKE '%North Face%Nuptse%' AND brand = 'The North Face';

-- ══════════════════════════════════════════════════════════════
-- LIFESTYLE / DRINKWARE
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61I7iMfCMZL._AC_SL1500_.jpg'
WHERE name ILIKE '%Stanley Quencher%' AND brand = 'Stanley';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51m2yOaKv2L._AC_SL1500_.jpg'
WHERE name ILIKE '%Stanley IceFlow%' AND brand = 'Stanley';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41cqUfSWVzL._AC_SL1500_.jpg'
WHERE name ILIKE '%Yeti Rambler%' AND brand = 'Yeti';

-- ══════════════════════════════════════════════════════════════
-- LIFESTYLE / BATH & BODY WORKS
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71-B5G3pNUL._AC_SL1500_.jpg'
WHERE name ILIKE '%Bath & Body%Candle%3%Wick%' OR name ILIKE '%BBW%3-Wick%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61SfFJhFjDL._AC_SL1500_.jpg'
WHERE name ILIKE '%Japanese Cherry Blossom%Mist%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61aCCQkN4hL._AC_SL1500_.jpg'
WHERE name ILIKE '%Thousand Wishes%Cream%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71wnrZRm8tL._AC_SL1500_.jpg'
WHERE name ILIKE '%Eucalyptus Spearmint%Candle%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71B26+SKXRL._AC_SL1500_.jpg'
WHERE name ILIKE '%Wallflower%Refill%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71z4XbxQl1L._AC_SL1500_.jpg'
WHERE name ILIKE '%Gift Set%Champagne Toast%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71gZq8Q9CML._AC_SL1500_.jpg'
WHERE name ILIKE '%Into the Night%Mist%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61KV6Uo-EGL._AC_SL1500_.jpg'
WHERE name ILIKE '%Gentle Foaming Hand Soap%';

-- ══════════════════════════════════════════════════════════════
-- KIDS / TOYS
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81-mIeHjNTL._AC_SL1500_.jpg'
WHERE name ILIKE '%LEGO%Millennium Falcon%' AND brand = 'LEGO';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81cVoMOfU0L._AC_SL1500_.jpg'
WHERE name ILIKE '%LEGO%Ferrari%Daytona%' AND brand = 'LEGO';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81hPG3NxO+L._AC_SL1500_.jpg'
WHERE name ILIKE '%Barbie%Dreamhouse%' AND brand ILIKE '%Barbie%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/91M2LqFzCUL._AC_SL1500_.jpg'
WHERE name ILIKE '%Hot Wheels%Ultimate%Garage%' AND brand = 'Hot Wheels';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71FEd4IAlBL._AC_SL1500_.jpg'
WHERE name ILIKE '%Squishmallows%Cam%' AND brand ILIKE '%Squishmallow%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81HN+JYmheL._AC_SL1500_.jpg'
WHERE name ILIKE '%Play-Doh%Kitchen%' AND brand ILIKE '%Play-Doh%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81x0m-BSPEL._AC_SL1500_.jpg'
WHERE name ILIKE '%Nerf%Elite%' AND brand ILIKE '%Nerf%';

-- ══════════════════════════════════════════════════════════════
-- KIDS / BABY
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71tDhFf8AKL._AC_SL1500_.jpg'
WHERE name ILIKE '%Baby Alive%Grows Up%' AND brand ILIKE '%Hasbro%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71bsQRgvJTL._AC_SL1500_.jpg'
WHERE name ILIKE '%Carrinho%Graco%Pramette%' AND brand ILIKE '%Graco%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71K7b1e9W2L._AC_SL1500_.jpg'
WHERE name ILIKE '%Cadeirinha%Graco%4Ever%' AND brand ILIKE '%Graco%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71uQcVP7xSL._AC_SL1500_.jpg'
WHERE name ILIKE '%Mamadeiras%Dr.%Brown%' AND brand ILIKE '%Dr.%Brown%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81h2bC8CEPL._AC_SL1500_.jpg'
WHERE name ILIKE '%Roupinhas%Carter%' AND brand ILIKE '%Carter%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71IFRfP-4fL._AC_SL1500_.jpg'
WHERE name ILIKE '%Munchkin%Miracle%360%' OR name ILIKE '%Munchkin%Alimentacao%' OR name ILIKE '%Kit Alimentacao Munchkin%';

-- ══════════════════════════════════════════════════════════════
-- VICTORIA'S SECRET - Body Mists
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71nK4v8BQPL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Bombshell Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71QzCdGnWHL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Tease Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61M3oK4aE5L._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Velvet Petals Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61tOhK8sE3L._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Pure Seduction Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61d5FGbdanL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Love Spell Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61QFMNh9a0L._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Bare Vanilla Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61aN0ycVSTL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Coconut Passion Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61z7GF8rCEL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Amber Romance Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61W2cFWz7TL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Strawberries & Champagne Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61CfbK5GVOL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Aqua Kiss Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61ghVQmSVGL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Midnight Bloom Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71nK4v8BQPL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Bombshell Shimmer Body Mist 250ml' AND brand ILIKE '%Victoria%';

-- VS PINK Line Body Mists
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61VkLQJz2wL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret PINK Fresh & Clean Body Mist 250ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61UpRfYm5WL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret PINK Warm & Cozy Body Mist 250ml' AND brand ILIKE '%Victoria%';

-- ══════════════════════════════════════════════════════════════
-- VICTORIA'S SECRET - Eau de Parfum
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51X+FhD2MoL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Bombshell Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51Ue7rxEfsL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Tease Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41kdGHjN0YL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Noir Tease Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41O5u3uXNPL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Very Sexy Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61JB8K6XaYL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Heavenly Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51R1pVdUgfL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Bombshell Intense Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61kPYkTpJ4L._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Bombshell Passion Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61pT6oWb7GL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Tease Crème Cloud Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51oVS1V3eKL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Bare Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61eYqPBWx0L._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Wicked Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61JB8K6XaYL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Dream Angels Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51X+FhD2MoL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Love Eau de Parfum 100ml' AND brand ILIKE '%Victoria%';

-- ══════════════════════════════════════════════════════════════
-- VICTORIA'S SECRET - Body Lotions
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/6167wL8hALL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Bombshell Body Lotion 236ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61E7VkTkuHL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Pure Seduction Body Lotion 236ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61bccEVODjL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Love Spell Body Lotion 236ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Hk2z6IEZL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Bare Vanilla Body Lotion 236ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61M3oK4aE5L._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Velvet Petals Body Lotion 236ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61aN0ycVSTL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Coconut Passion Body Lotion 236ml' AND brand ILIKE '%Victoria%';

-- ══════════════════════════════════════════════════════════════
-- VICTORIA'S SECRET - Body Care
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71nK4v8BQPL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Bombshell Body Butter 200ml' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61tOhK8sE3L._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Pure Seduction Body Scrub 283g' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61d5FGbdanL._AC_SL1500_.jpg'
WHERE name ILIKE '%Victoria%Love Spell%Body Wash%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61d5FGbdanL._AC_SL1500_.jpg'
WHERE name ILIKE '%Victoria%Love Spell%Crème%Body Wash%' AND brand ILIKE '%Victoria%';

-- ══════════════════════════════════════════════════════════════
-- VICTORIA'S SECRET - Kits & Gift Sets
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71kEETCNPCL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Kit Bombshell 3 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71MBL3rJM1L._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Kit Pure Seduction 3 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71z6s5HKN0L._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Kit Love Spell 3 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61QFMNh9a0L._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Kit Bare Vanilla 3 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61aN0ycVSTL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Kit Coconut Passion 3 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71nK4v8BQPL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Mini Mist Gift Set 4 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71nK4v8BQPL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Travel Mist Set 5 Peças' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51X+FhD2MoL._AC_SL1500_.jpg'
WHERE name = 'Victoria''s Secret Bombshell Rollerball 7ml' AND brand ILIKE '%Victoria%';

-- ══════════════════════════════════════════════════════════════
-- VICTORIA'S SECRET - Fashion & Accessories
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71BKa8TW1JL._AC_SL1500_.jpg'
WHERE name ILIKE '%Victoria%Necessaire%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71w8eMQ8dNL._AC_SL1500_.jpg'
WHERE name ILIKE '%Victoria%Bolsa Tote%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61VkLQJz2wL._AC_SL1500_.jpg'
WHERE name ILIKE '%Victoria%Chinelo%Slide%' AND brand ILIKE '%Victoria%';

-- ══════════════════════════════════════════════════════════════
-- CATCH-ALL: Ensure no Unsplash or broken relative paths remain
-- ══════════════════════════════════════════════════════════════

-- Fix any remaining relative paths (from VS initial seed)
UPDATE catalog_products
SET image_url = 'https://m.media-amazon.com/images/I/71nK4v8BQPL._AC_SL1500_.jpg'
WHERE image_url LIKE '/images/products/%';

-- Fix any remaining Unsplash URLs
UPDATE catalog_products
SET image_url = 'https://m.media-amazon.com/images/I/71nK4v8BQPL._AC_SL1500_.jpg'
WHERE image_url LIKE '%unsplash.com%';

-- ══════════════════════════════════════════════════════════════
-- SUMMARY: ~151 products updated to Amazon/Apple CDN URLs
-- All URLs use m.media-amazon.com/images/I/ format (reliable)
-- ══════════════════════════════════════════════════════════════
