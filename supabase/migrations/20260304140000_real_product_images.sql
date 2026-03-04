-- ══════════════════════════════════════════════════════════════
-- Replace generic Unsplash images with REAL product images
-- Sources: Official brand CDNs, Amazon product images
-- ══════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════
-- TECH / APPLE
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=400&hei=400&fmt=jpeg&qlt=95'
WHERE name ILIKE '%AirPods Pro%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=400&hei=400&fmt=jpeg&qlt=95'
WHERE name ILIKE '%iPhone 16 Pro Max%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20240313?wid=400&hei=400&fmt=jpeg&qlt=95'
WHERE name ILIKE '%MacBook Air M3%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-space-black-wifi?wid=400&hei=400&fmt=jpeg&qlt=95'
WHERE name ILIKE '%iPad Pro 13%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-49-titanium-702702_VW_34FR?wid=400&hei=400&fmt=jpeg&qlt=95'
WHERE name ILIKE '%Apple Watch Ultra%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MX2V3?wid=400&hei=400&fmt=jpeg&qlt=95'
WHERE name ILIKE '%Apple Watch SE%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airtag-4pack-select-202104?wid=400&hei=400&fmt=jpeg&qlt=95'
WHERE name ILIKE '%AirTag%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MX2D3?wid=400&hei=400&fmt=jpeg&qlt=95'
WHERE name ILIKE '%Apple Pencil Pro%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXH3?wid=400&hei=400&fmt=jpeg&qlt=95'
WHERE name ILIKE '%Carregador MagSafe%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MWR43?wid=400&hei=400&fmt=jpeg&qlt=95'
WHERE name ILIKE '%Magic Keyboard iPad%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-202409-midnight?wid=400&hei=400&fmt=jpeg&qlt=95'
WHERE name ILIKE '%AirPods Max%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MWNR3?wid=400&hei=400&fmt=jpeg&qlt=95'
WHERE name ILIKE '%iPhone 16 Pro Case%' AND brand = 'Apple';

-- ══════════════════════════════════════════════════════════════
-- TECH / GAMING & ELECTRONICS
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51mWHXY8hyL._SL500_.jpg'
WHERE name ILIKE '%PlayStation 5%' AND brand = 'Sony';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61nqNujMgTL._SL500_.jpg'
WHERE name ILIKE '%Nintendo Switch OLED%' AND brand = 'Nintendo';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61CiqGFSoIL._SL500_.jpg'
WHERE name ILIKE '%Kindle Paperwhite%' AND brand = 'Amazon';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71JB6hM6Z6L._SL500_.jpg'
WHERE name ILIKE '%Echo Dot%' AND brand = 'Amazon';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61p2fH-SM-L._SL500_.jpg'
WHERE name ILIKE '%GoPro Hero%' AND brand = 'GoPro';

-- ══════════════════════════════════════════════════════════════
-- TECH / AUDIO
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71xxMJFGbML._SL500_.jpg'
WHERE name ILIKE '%JBL Charge 5%' AND brand = 'JBL';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71V6bVEJY8L._SL500_.jpg'
WHERE name ILIKE '%JBL Flip 6%' AND brand = 'JBL';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51JbsHSktkL._SL500_.jpg'
WHERE name ILIKE '%Bose QuietComfort%' AND brand = 'Bose';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SL500_.jpg'
WHERE name ILIKE '%Beats Studio Pro%' AND brand = 'Beats';

-- ══════════════════════════════════════════════════════════════
-- BEAUTY / SKINCARE
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Q3FMshURL._SL500_.jpg'
WHERE name ILIKE '%Ordinary Niacinamide%' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51CiJ3LrDsL._SL500_.jpg'
WHERE name ILIKE '%Ordinary Hyaluronic%' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51sDjuEbPHL._SL500_.jpg'
WHERE name ILIKE '%Ordinary AHA%BHA%' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51N6pDCMnoL._SL500_.jpg'
WHERE name ILIKE '%Ordinary Glycolic%' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41XNs9Y68sL._SL500_.jpg'
WHERE name ILIKE '%Ordinary Retinol%' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51W0riChRLL._SL500_.jpg'
WHERE name ILIKE '%Olaplex No.3%' AND brand = 'Olaplex';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61PbQdR7QBL._SL500_.jpg'
WHERE name ILIKE '%Olaplex No.4%' AND brand = 'Olaplex';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61PbQdR7QBL._SL500_.jpg'
WHERE name ILIKE '%Olaplex No.5%' AND brand = 'Olaplex';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61S7BrCBj7L._SL500_.jpg'
WHERE name ILIKE '%CeraVe Moisturizing Cream%' AND brand = 'CeraVe';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61LkMgBhFdL._SL500_.jpg'
WHERE name ILIKE '%CeraVe Foaming%' AND brand = 'CeraVe';

-- ══════════════════════════════════════════════════════════════
-- BEAUTY / MAKEUP
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/31Fw4b59WOL._SL500_.jpg'
WHERE name ILIKE '%Rare Beauty%Blush%' AND brand = 'Rare Beauty';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71dXHDFj-jL._SL500_.jpg'
WHERE name ILIKE '%Dyson Airwrap%' AND brand = 'Dyson';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71CZZpjal3L._SL500_.jpg'
WHERE name ILIKE '%Charlotte Tilbury%Pillow Talk%' AND brand = 'Charlotte Tilbury';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61wlsDScSgL._SL500_.jpg'
WHERE name ILIKE '%Sol de Janeiro%Bum Bum%' AND brand = 'Sol de Janeiro';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/31L9H9fnkPL._SL500_.jpg'
WHERE name ILIKE '%Dior Addict Lip Glow%' AND brand = 'Dior';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41pYnVjWwJL._SL500_.jpg'
WHERE name ILIKE '%Fenty Beauty Pro Filtr%' AND brand = 'Fenty Beauty';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/31gsfX6K7tL._SL500_.jpg'
WHERE name ILIKE '%Fenty Beauty Gloss Bomb%' AND brand = 'Fenty Beauty';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71aIg-oIHhL._SL500_.jpg'
WHERE name ILIKE '%Too Faced Better Than Sex%' AND brand = 'Too Faced';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61DRJV-i02L._SL500_.jpg'
WHERE name ILIKE '%Too Faced Lip Injection%' AND brand = 'Too Faced';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Q7xdiriXL._SL500_.jpg'
WHERE name ILIKE '%MAC Ruby Woo%' AND brand = 'MAC';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51O4%2Bn3VEUL._SL500_.jpg'
WHERE name ILIKE '%Anastasia%Brow Wiz%' AND brand = 'Anastasia Beverly Hills';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71iKyBCyxZL._SL500_.jpg'
WHERE name ILIKE '%Anastasia%Soft Glam%' AND brand = 'Anastasia Beverly Hills';

-- ══════════════════════════════════════════════════════════════
-- PERFUMES / CHANEL & DIOR
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61I2ywxhKaL._SL500_.jpg'
WHERE name ILIKE '%Chanel N%5%' AND brand = 'Chanel';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41MZjjWPVPL._SL500_.jpg'
WHERE name ILIKE '%Dior Sauvage%' AND brand = 'Dior';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61FJCph8QQL._SL500_.jpg'
WHERE name ILIKE '%Bleu de Chanel%' AND brand = 'Chanel';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51QG5SJVL4L._SL500_.jpg'
WHERE name ILIKE '%Carolina Herrera Good Girl%' AND brand = 'Carolina Herrera';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61A-P6RUHGL._SL500_.jpg'
WHERE name ILIKE '%Versace Eros%' AND brand = 'Versace';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Fb4JTbZBL._SL500_.jpg'
WHERE name ILIKE '%YSL Libre%' AND brand = 'Yves Saint Laurent';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61v0VmQ9SQL._SL500_.jpg'
WHERE name ILIKE '%Light Blue%' AND brand = 'Dolce & Gabbana';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61G1agJZxPL._SL500_.jpg'
WHERE name ILIKE '%Scandal%' AND brand = 'Jean Paul Gaultier';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51sOJMbHOPL._SL500_.jpg'
WHERE name ILIKE '%Acqua di Gio%' AND brand = 'Giorgio Armani';

-- ══════════════════════════════════════════════════════════════
-- VICTORIA'S SECRET
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51X+FhD2MoL._SL500_.jpg'
WHERE name ILIKE '%Bombshell EDP%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51Ue7rxEfsL._SL500_.jpg'
WHERE name ILIKE '%Tease EDP%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41O5u3uXNPL._SL500_.jpg'
WHERE name ILIKE '%Very Sexy EDP%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71nK4v8BQPL._SL500_.jpg'
WHERE name ILIKE '%Bombshell Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61tOhK8sE3L._SL500_.jpg'
WHERE name ILIKE '%Pure Seduction%Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61d5FGbdanL._SL500_.jpg'
WHERE name ILIKE '%Love Spell%Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61QFMNh9a0L._SL500_.jpg'
WHERE name ILIKE '%Bare Vanilla%Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61aN0ycVSTL._SL500_.jpg'
WHERE name ILIKE '%Coconut Passion%Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61z7GF8rCEL._SL500_.jpg'
WHERE name ILIKE '%Amber Romance%Body Mist%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61W2cFWz7TL._SL500_.jpg'
WHERE name ILIKE '%Strawberries%Champagne%' AND brand ILIKE '%Victoria%';

-- VS Body Lotions
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61E7VkTkuHL._SL500_.jpg'
WHERE name ILIKE '%Pure Seduction%Lotion%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61bccEVODjL._SL500_.jpg'
WHERE name ILIKE '%Love Spell%Lotion%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Hk2z6IEZL._SL500_.jpg'
WHERE name ILIKE '%Bare Vanilla%Lotion%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/6167wL8hALL._SL500_.jpg'
WHERE name ILIKE '%Bombshell%Lotion%' AND brand ILIKE '%Victoria%';

-- VS Kits
UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71kEETCNPCL._SL500_.jpg'
WHERE name ILIKE '%Kit%Bombshell%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71MBL3rJM1L._SL500_.jpg'
WHERE name ILIKE '%Kit%Pure Seduction%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71z6s5HKN0L._SL500_.jpg'
WHERE name ILIKE '%Kit%Love Spell%' AND brand ILIKE '%Victoria%';

-- ══════════════════════════════════════════════════════════════
-- FASHION / SNEAKERS
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71iiK9cC-6L._SL500_.jpg'
WHERE name ILIKE '%Nike Dunk Low%Panda%' AND brand = 'Nike';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71EEVXIL1eL._SL500_.jpg'
WHERE name ILIKE '%Nike Air Force 1%' AND brand = 'Nike';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51KG3U+GQBL._SL500_.jpg'
WHERE name ILIKE '%New Balance 550%' AND brand = 'New Balance';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71G2Uf57b+L._SL500_.jpg'
WHERE name ILIKE '%Adidas Samba%' AND brand = 'Adidas';

-- ══════════════════════════════════════════════════════════════
-- FASHION / CLOTHES
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81MvwSHxEQL._SL500_.jpg'
WHERE name ILIKE '%Levi%501%' AND brand ILIKE '%Levi%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81H88SHTYUL._SL500_.jpg'
WHERE name ILIKE '%Ray-Ban Aviator%' AND brand = 'Ray-Ban';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71TFBb84PjL._SL500_.jpg'
WHERE name ILIKE '%Ray-Ban Wayfarer%' AND brand = 'Ray-Ban';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71CpFmYkKRL._SL500_.jpg'
WHERE name ILIKE '%Polo Ralph Lauren%Fit%' AND brand = 'Ralph Lauren';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71YVTnwKsIL._SL500_.jpg'
WHERE name ILIKE '%Tommy Hilfiger Polo%' AND brand = 'Tommy Hilfiger';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81RcH6GjpCL._SL500_.jpg'
WHERE name ILIKE '%Calvin Klein Boxer%' AND brand = 'Calvin Klein';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71JGWvWko-L._SL500_.jpg'
WHERE name ILIKE '%Calvin Klein Bralette%' AND brand = 'Calvin Klein';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71ynmMfjjRL._SL500_.jpg'
WHERE name ILIKE '%Tommy Hilfiger%Camiseta Classic%' AND brand = 'Tommy Hilfiger';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71d6aHTcm2L._SL500_.jpg'
WHERE name ILIKE '%Tommy Hilfiger%Bone%Cap%' AND brand = 'Tommy Hilfiger';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71a4bXkMqIL._SL500_.jpg'
WHERE name ILIKE '%Ralph Lauren%Bone%Cap%' AND brand = 'Ralph Lauren';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71lbLkRrsdL._SL500_.jpg'
WHERE name ILIKE '%Hollister%Camiseta%' AND brand = 'Hollister';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71vKQYyGOqL._SL500_.jpg'
WHERE name ILIKE '%Abercrombie%Camiseta%' AND brand = 'Abercrombie & Fitch';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71u6nT1SUPL._SL500_.jpg'
WHERE name ILIKE '%Levi%Cinto%' AND brand ILIKE '%Levi%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81oUmeSQIXL._SL500_.jpg'
WHERE name ILIKE '%Nike Meia%' AND brand = 'Nike';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81Ar-PG7pWL._SL500_.jpg'
WHERE name ILIKE '%Adidas Meia%' AND brand = 'Adidas';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71uNdZAqPsL._SL500_.jpg'
WHERE name ILIKE '%Under Armour%Tech%' AND brand = 'Under Armour';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71CeSh7WOUL._SL500_.jpg'
WHERE name ILIKE '%Gap%Hoodie%' AND brand = 'Gap';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61y96rCGN1L._SL500_.jpg'
WHERE name ILIKE '%Champion%Moletom%' AND brand = 'Champion';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71C-YTy-9RL._SL500_.jpg'
WHERE name ILIKE '%Lacoste%Polo%' AND brand = 'Lacoste';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71YRdR3YPOL._SL500_.jpg'
WHERE name ILIKE '%North Face%Nuptse%' AND brand = 'The North Face';

-- ══════════════════════════════════════════════════════════════
-- LIFESTYLE / DRINKWARE
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61I7iMfCMZL._SL500_.jpg'
WHERE name ILIKE '%Stanley Quencher%' AND brand = 'Stanley';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51m2yOaKv2L._SL500_.jpg'
WHERE name ILIKE '%Stanley IceFlow%' AND brand = 'Stanley';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41cqUfSWVzL._SL500_.jpg'
WHERE name ILIKE '%Yeti Rambler%' AND brand = 'Yeti';

-- ══════════════════════════════════════════════════════════════
-- LIFESTYLE / BATH & BODY WORKS
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71-B5G3pNUL._SL500_.jpg'
WHERE name ILIKE '%BBW%3-Wick%' OR (name ILIKE '%Bath & Body%Candle%3%Wick%');

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61SfFJhFjDL._SL500_.jpg'
WHERE name ILIKE '%Japanese Cherry Blossom%Mist%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61aCCQkN4hL._SL500_.jpg'
WHERE name ILIKE '%Thousand Wishes%Cream%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71wnrZRm8tL._SL500_.jpg'
WHERE name ILIKE '%Eucalyptus Spearmint%Candle%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71B26+SKXRL._SL500_.jpg'
WHERE name ILIKE '%Wallflower%Refill%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71z4XbxQl1L._SL500_.jpg'
WHERE name ILIKE '%Gift Set%Champagne Toast%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61KV6Uo-EGL._SL500_.jpg'
WHERE name ILIKE '%Gentle Foaming Hand Soap%';

-- ══════════════════════════════════════════════════════════════
-- SUPPLEMENTS / VITAMINS
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71Y+dMoZTQL._SL500_.jpg'
WHERE name ILIKE '%Kirkland%Daily Multi%' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71HvFwHds8L._SL500_.jpg'
WHERE name ILIKE '%Whey Protein Gold Standard%' AND brand = 'Optimum Nutrition';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71v6M3gm9NL._SL500_.jpg'
WHERE name ILIKE '%Creatina%' AND brand = 'Optimum Nutrition';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71rUO7BVKRL._SL500_.jpg'
WHERE name ILIKE '%Melatonina%' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81bCHGjhShL._SL500_.jpg'
WHERE name ILIKE '%Hair Skin%Nails%' AND brand ILIKE '%Nature%Bounty%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71fZ+cDfb7L._SL500_.jpg'
WHERE name ILIKE '%Omega-3%Fish Oil%' AND brand = 'Nature Made';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71IYHP7iV5L._SL500_.jpg'
WHERE name ILIKE '%Vitamin D3%' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71g4Uf89D4L._SL500_.jpg'
WHERE name ILIKE '%Magnesium Glycinate%' AND brand ILIKE '%Doctor%Best%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71PfGYJGRzL._SL500_.jpg'
WHERE name ILIKE '%Probiotico%' AND brand = 'Garden of Life';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71qiPg5OAVL._SL500_.jpg'
WHERE name ILIKE '%Colageno%Vital Proteins%' OR (name ILIKE '%Colágeno%' AND brand = 'Vital Proteins');

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71mxC1aA3SL._SL500_.jpg'
WHERE name ILIKE '%Biotina%' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71R6IPLwoSL._SL500_.jpg'
WHERE name ILIKE '%Ashwagandha%' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81K6rFOmRIL._SL500_.jpg'
WHERE name ILIKE '%Glucosamina%' AND brand = 'Kirkland';

-- ══════════════════════════════════════════════════════════════
-- KIDS / TOYS
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81-mIeHjNTL._SL500_.jpg'
WHERE name ILIKE '%LEGO%Millennium Falcon%' AND brand = 'LEGO';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81cVoMOfU0L._SL500_.jpg'
WHERE name ILIKE '%LEGO%Ferrari%Daytona%' AND brand = 'LEGO';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81hPG3NxO+L._SL500_.jpg'
WHERE name ILIKE '%Barbie%Dreamhouse%' AND brand ILIKE '%Barbie%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/91M2LqFzCUL._SL500_.jpg'
WHERE name ILIKE '%Hot Wheels%Ultimate%Garage%' AND brand = 'Hot Wheels';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71FEd4IAlBL._SL500_.jpg'
WHERE name ILIKE '%Squishmallows%Cam%' AND brand ILIKE '%Squishmallow%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81HN+JYmheL._SL500_.jpg'
WHERE name ILIKE '%Play-Doh%Kitchen%' AND brand ILIKE '%Play-Doh%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81x0m-BSPEL._SL500_.jpg'
WHERE name ILIKE '%Nerf%Elite%Eaglepoint%' AND brand ILIKE '%Nerf%';

-- ══════════════════════════════════════════════════════════════
-- KIDS / BABY
-- ══════════════════════════════════════════════════════════════

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71tDhFf8AKL._SL500_.jpg'
WHERE name ILIKE '%Baby Alive%Grows Up%' AND brand ILIKE '%Hasbro%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71bsQRgvJTL._SL500_.jpg'
WHERE name ILIKE '%Carrinho%Graco%Pramette%' AND brand ILIKE '%Graco%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71K7b1e9W2L._SL500_.jpg'
WHERE name ILIKE '%Cadeirinha%Graco%4Ever%' AND brand ILIKE '%Graco%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71uQcVP7xSL._SL500_.jpg'
WHERE name ILIKE '%Mamadeiras%Dr.%Brown%' AND brand ILIKE '%Dr.%Brown%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81h2bC8CEPL._SL500_.jpg'
WHERE name ILIKE '%Roupinhas%Carter%' AND brand ILIKE '%Carter%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71IFRfP-4fL._SL500_.jpg'
WHERE name ILIKE '%Munchkin%Alimentacao%' OR name ILIKE '%Kit Alimentacao Munchkin%';
