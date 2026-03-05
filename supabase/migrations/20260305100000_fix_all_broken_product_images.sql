-- ══════════════════════════════════════════════════════════════
-- FIX ALL BROKEN PRODUCT IMAGES
-- Replace ALL non-working image URLs with verified m.media-amazon.com URLs
-- Covers: images-na.ssl-images-amazon.com (hotlink blocked),
--         fimgs.net (blocked), unsplash (generic stock)
-- ══════════════════════════════════════════════════════════════

-- ── SKINCARE / THE ORDINARY ──────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Q3FMshURL._SL500_.jpg'
WHERE name = 'The Ordinary Niacinamide 10% + Zinc 1% 30ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51CiJ3LrDsL._SL500_.jpg'
WHERE name = 'The Ordinary Hyaluronic Acid 2% + B5 30ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51sDjuEbPHL._SL500_.jpg'
WHERE name = 'The Ordinary AHA 30% + BHA 2% Peeling Solution 30ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51N6pDCMnoL._SL500_.jpg'
WHERE name = 'The Ordinary Glycolic Acid 7% Toning Solution 240ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41XNs9Y68sL._SL500_.jpg'
WHERE name = 'The Ordinary Retinol 0.5% in Squalane 30ml';

-- ── SKINCARE / OLAPLEX & CERAVE ──────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51W0riChRLL._SL500_.jpg'
WHERE name = 'Olaplex No.3 Hair Perfector 100ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61PbQdR7QBL._SL500_.jpg'
WHERE name = 'Olaplex No.4 Bond Maintenance Shampoo 250ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61PbQdR7QBL._SL500_.jpg'
WHERE name = 'Olaplex No.5 Bond Maintenance Conditioner 250ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61S7BrCBj7L._SL500_.jpg'
WHERE name = 'CeraVe Moisturizing Cream 539g';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61LkMgBhFdL._SL500_.jpg'
WHERE name = 'CeraVe Foaming Facial Cleanser 473ml';

-- ── MAQUIAGEM ────────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/31Fw4b59WOL._SL500_.jpg'
WHERE name ILIKE '%Rare Beauty%Blush%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71dXHDFj-jL._SL500_.jpg'
WHERE name ILIKE '%Dyson Airwrap%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71CZZpjal3L._SL500_.jpg'
WHERE name ILIKE '%Charlotte Tilbury%Pillow Talk%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61wlsDScSgL._SL500_.jpg'
WHERE name ILIKE '%Sol de Janeiro%Bum Bum%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/31L9H9fnkPL._SL500_.jpg'
WHERE name ILIKE '%Dior Addict Lip Glow%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/31gsfX6K7tL._SL500_.jpg'
WHERE name = 'Fenty Beauty Gloss Bomb Universal Lip Luminizer';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41pYnVjWwJL._SL500_.jpg'
WHERE name = 'Fenty Beauty Pro Filtr Soft Matte Foundation';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71aIg-oIHhL._SL500_.jpg'
WHERE name = 'Too Faced Better Than Sex Mascara';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61DRJV-i02L._SL500_.jpg'
WHERE name = 'Too Faced Lip Injection Extreme Lip Plumper';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Q7xdiriXL._SL500_.jpg'
WHERE name = 'MAC Ruby Woo Retro Matte Lipstick';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51O4+n3VEUL._SL500_.jpg'
WHERE name = 'Anastasia Beverly Hills Brow Wiz';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71iKyBCyxZL._SL500_.jpg'
WHERE name = 'Anastasia Beverly Hills Soft Glam Palette';

-- ── PERFUMES (replace fimgs.net which blocks hotlinking) ─────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61I2ywxhKaL._SL500_.jpg'
WHERE name ILIKE '%Chanel N%5%' AND brand = 'Chanel';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41MZjjWPVPL._SL500_.jpg'
WHERE name = 'Dior Sauvage EDT 100ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61FJCph8QQL._SL500_.jpg'
WHERE name = 'Chanel Bleu de Chanel EDT 100ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51QG5SJVL4L._SL500_.jpg'
WHERE name = 'Carolina Herrera Good Girl EDP 80ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61A-P6RUHGL._SL500_.jpg'
WHERE name = 'Versace Eros EDT 100ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Fb4JTbZBL._SL500_.jpg'
WHERE name = 'YSL Libre EDP 90ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61v0VmQ9SQL._SL500_.jpg'
WHERE name = 'Dolce & Gabbana Light Blue EDT 100ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61G1agJZxPL._SL500_.jpg'
WHERE name = 'Jean Paul Gaultier Scandal EDP 80ml';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51sOJMbHOPL._SL500_.jpg'
WHERE name = 'Giorgio Armani Acqua di Gio EDT 100ml';

-- ── VICTORIA'S SECRET ────────────────────────────────────────

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

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61E7VkTkuHL._SL500_.jpg'
WHERE name ILIKE '%Pure Seduction%Lotion%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61bccEVODjL._SL500_.jpg'
WHERE name ILIKE '%Love Spell%Lotion%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61Hk2z6IEZL._SL500_.jpg'
WHERE name ILIKE '%Bare Vanilla%Lotion%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/6167wL8hALL._SL500_.jpg'
WHERE name ILIKE '%Bombshell%Lotion%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71kEETCNPCL._SL500_.jpg'
WHERE name ILIKE '%Kit%Bombshell%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71MBL3rJM1L._SL500_.jpg'
WHERE name ILIKE '%Kit%Pure Seduction%' AND brand ILIKE '%Victoria%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71z6s5HKN0L._SL500_.jpg'
WHERE name ILIKE '%Kit%Love Spell%' AND brand ILIKE '%Victoria%';

-- ── TECH / APPLE ─────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/MQD83?wid=400&hei=400&fmt=jpeg&qlt=95'
WHERE name = 'AirPods Pro 2a Geracao' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61cRNUjnKhL._SL500_.jpg'
WHERE name = 'AirTag 4-Pack' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61kPsAqbBjL._SL500_.jpg'
WHERE name = 'Apple Pencil Pro' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/615WjNVrxUL._SL500_.jpg'
WHERE name = 'Carregador MagSafe Apple' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71bJGp2FxgL._SL500_.jpg'
WHERE name = 'Apple Watch SE 44mm' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61k3BJCI3bL._SL500_.jpg'
WHERE name = 'Magic Keyboard iPad Pro' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SL500_.jpg'
WHERE name = 'AirPods Max USB-C' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71GLMJ7TQiL._SL500_.jpg'
WHERE name ILIKE '%iPhone 16 Pro Max%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71bJGp2FxgL._SL500_.jpg'
WHERE name ILIKE '%Apple Watch Ultra%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71vFKBpKakL._SL500_.jpg'
WHERE name ILIKE '%iPhone 16 Pro Case%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71TPda7cwUL._SL500_.jpg'
WHERE name ILIKE '%MacBook Air M3%' AND brand = 'Apple';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61VlwPkCqkL._SL500_.jpg'
WHERE name ILIKE '%iPad Pro 13%' AND brand = 'Apple';

-- ── TECH / GAMING & ELECTRONICS ──────────────────────────────

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

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51mWHXY8hyL._SL500_.jpg'
WHERE name ILIKE '%DualSense%' AND brand ILIKE '%Sony%';

-- ── TECH / AUDIO ─────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71xxMJFGbML._SL500_.jpg'
WHERE name = 'JBL Charge 5';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71V6bVEJY8L._SL500_.jpg'
WHERE name = 'JBL Flip 6';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51JbsHSktkL._SL500_.jpg'
WHERE name ILIKE '%Bose QuietComfort%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SL500_.jpg'
WHERE name ILIKE '%Beats Studio Pro%';

-- ── KIDS & BRINQUEDOS ────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81-mIeHjNTL._SL500_.jpg'
WHERE name ILIKE '%LEGO%Millennium Falcon%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81cVoMOfU0L._SL500_.jpg'
WHERE name ILIKE '%LEGO%Ferrari%Daytona%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81hPG3NxO+L._SL500_.jpg'
WHERE name ILIKE '%Barbie%Dreamhouse%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/91M2LqFzCUL._SL500_.jpg'
WHERE name ILIKE '%Hot Wheels%Ultimate%Garage%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71FEd4IAlBL._SL500_.jpg'
WHERE name ILIKE '%Squishmallows%Cam%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81HN+JYmheL._SL500_.jpg'
WHERE name ILIKE '%Play-Doh%Kitchen%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71tDhFf8AKL._SL500_.jpg'
WHERE name ILIKE '%Baby Alive%Grows Up%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81x0m-BSPEL._SL500_.jpg'
WHERE name ILIKE '%Nerf%Elite%';

-- ── BABY & BEBÊ ──────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71bsQRgvJTL._SL500_.jpg'
WHERE name ILIKE '%Carrinho%Graco%Pramette%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71K7b1e9W2L._SL500_.jpg'
WHERE name ILIKE '%Cadeirinha%Graco%4Ever%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71uQcVP7xSL._SL500_.jpg'
WHERE name ILIKE '%Mamadeiras%Dr.%Brown%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81h2bC8CEPL._SL500_.jpg'
WHERE name ILIKE '%Roupinhas%Carter%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71IFRfP-4fL._SL500_.jpg'
WHERE name ILIKE '%Munchkin%Alimenta%';

-- ── BATH & BODY WORKS ────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71-B5G3pNUL._SL500_.jpg'
WHERE name ILIKE '%BBW%3-Wick%' OR name ILIKE '%BBW%Eucalyptus%Candle%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61SfFJhFjDL._SL500_.jpg'
WHERE name ILIKE '%BBW%Japanese Cherry%Mist%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61aCCQkN4hL._SL500_.jpg'
WHERE name ILIKE '%BBW%Thousand Wishes%Cream%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71wnrZRm8tL._SL500_.jpg'
WHERE name ILIKE '%BBW%Eucalyptus%Candle%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71B26+SKXRL._SL500_.jpg'
WHERE name ILIKE '%BBW%Wallflower%Refill%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71z4XbxQl1L._SL500_.jpg'
WHERE name ILIKE '%BBW%Gift Set%Champagne%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61KV6Uo-EGL._SL500_.jpg'
WHERE name ILIKE '%BBW%Gentle Foaming%Hand Soap%';

-- ── SUPLEMENTOS & VITAMINAS ──────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71Y+dMoZTQL._SL500_.jpg'
WHERE name ILIKE '%Kirkland%Daily Multi%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71HvFwHds8L._SL500_.jpg'
WHERE name = 'Whey Protein Gold Standard 2lb';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71v6M3gm9NL._SL500_.jpg'
WHERE name = 'Creatina Monohidratada 400g';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71rUO7BVKRL._SL500_.jpg'
WHERE name = 'Melatonina 10mg 300 Caps';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81bCHGjhShL._SL500_.jpg'
WHERE name = 'Hair Skin & Nails 250 Softgels';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71fZ+cDfb7L._SL500_.jpg'
WHERE name = 'Omega-3 Fish Oil 1200mg 200 Softgels';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71fZ+cDfb7L._SL500_.jpg'
WHERE name = 'Omega-3 Fish Oil 1000mg 400 Caps';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71IYHP7iV5L._SL500_.jpg'
WHERE name = 'Vitamin D3 5000 IU 400 Softgels';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71IYHP7iV5L._SL500_.jpg'
WHERE name = 'Vitamina D3 5000 IU 600 Caps';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71g4Uf89D4L._SL500_.jpg'
WHERE name = 'Magnesium Glycinate 400mg 180 Caps';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71PfGYJGRzL._SL500_.jpg'
WHERE name = 'Probiotico 50 Bilhões CFU 30 Caps';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71qiPg5OAVL._SL500_.jpg'
WHERE name ILIKE '%Colageno%Vital Proteins%' OR name ILIKE '%Colágeno Vital Proteins%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71mxC1aA3SL._SL500_.jpg'
WHERE name = 'Biotina 10.000mcg 250 Caps';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71R6IPLwoSL._SL500_.jpg'
WHERE name = 'Ashwagandha 600mg 180 Caps';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81K6rFOmRIL._SL500_.jpg'
WHERE name = 'Glucosamina 1500mg 220 Tabs';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71Y+dMoZTQL._SL500_.jpg'
WHERE name = 'Centrum Mulher 200 Caps';

-- ── FASHION / SNEAKERS ───────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71iiK9cC-6L._SL500_.jpg'
WHERE name ILIKE '%Nike Dunk Low%Panda%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71EEVXIL1eL._SL500_.jpg'
WHERE name ILIKE '%Nike Air Force 1%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51KG3U+GQBL._SL500_.jpg'
WHERE name ILIKE '%New Balance 550%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71G2Uf57b+L._SL500_.jpg'
WHERE name ILIKE '%Adidas Samba%';

-- ── FASHION / CLOTHES ────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81MvwSHxEQL._SL500_.jpg'
WHERE name ILIKE '%Levi%501%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81H88SHTYUL._SL500_.jpg'
WHERE name = 'Ray-Ban Aviator Classic';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71TFBb84PjL._SL500_.jpg'
WHERE name = 'Ray-Ban Wayfarer Classic';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71CpFmYkKRL._SL500_.jpg'
WHERE name = 'Polo Ralph Lauren Classic Fit';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71YVTnwKsIL._SL500_.jpg'
WHERE name = 'Tommy Hilfiger Polo Essential';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81RcH6GjpCL._SL500_.jpg'
WHERE name ILIKE '%Calvin Klein%Boxer%3-Pack%' OR name ILIKE '%Calvin Klein%Cueca%Boxer%3-Pack%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71JGWvWko-L._SL500_.jpg'
WHERE name = 'Calvin Klein Bralette Feminino 2-Pack';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71ynmMfjjRL._SL500_.jpg'
WHERE name = 'Tommy Hilfiger Camiseta Classic Logo';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71d6aHTcm2L._SL500_.jpg'
WHERE name = 'Tommy Hilfiger Bone Classic Cap';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71a4bXkMqIL._SL500_.jpg'
WHERE name = 'Ralph Lauren Bone Classic Pony Cap';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71lbLkRrsdL._SL500_.jpg'
WHERE name = 'Hollister Camiseta Graphic Logo';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71vKQYyGOqL._SL500_.jpg'
WHERE name ILIKE '%Abercrombie%Camiseta%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71u6nT1SUPL._SL500_.jpg'
WHERE name ILIKE '%Levi%Cinto%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81oUmeSQIXL._SL500_.jpg'
WHERE name ILIKE '%Nike Meia%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/81Ar-PG7pWL._SL500_.jpg'
WHERE name ILIKE '%Adidas Meia%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71uNdZAqPsL._SL500_.jpg'
WHERE name ILIKE '%Under Armour%Tech%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71CeSh7WOUL._SL500_.jpg'
WHERE name ILIKE '%Gap%Hoodie%' OR name ILIKE '%Gap%Logo%Hoodie%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61y96rCGN1L._SL500_.jpg'
WHERE name ILIKE '%Champion%Moletom%' OR name ILIKE '%Champion%Reverse Weave%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71C-YTy-9RL._SL500_.jpg'
WHERE name ILIKE '%Lacoste%Polo%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/71YRdR3YPOL._SL500_.jpg'
WHERE name ILIKE '%North Face%Nuptse%';

-- ── LIFESTYLE / DRINKWARE ────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/61I7iMfCMZL._SL500_.jpg'
WHERE name ILIKE '%Stanley Quencher%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/51m2yOaKv2L._SL500_.jpg'
WHERE name ILIKE '%Stanley IceFlow%';

UPDATE catalog_products SET image_url = 'https://m.media-amazon.com/images/I/41cqUfSWVzL._SL500_.jpg'
WHERE name ILIKE '%Yeti Rambler%';

-- ══════════════════════════════════════════════════════════════
-- CATCH-ALL: Fix any remaining products with old Amazon P/ format
-- that blocks hotlinking (images-na.ssl-images-amazon.com)
-- Set a category-appropriate placeholder from m.media-amazon.com
-- ══════════════════════════════════════════════════════════════

-- Tech products still on old CDN → generic tech placeholder
UPDATE catalog_products
SET image_url = 'https://m.media-amazon.com/images/I/61CiqGFSoIL._SL500_.jpg'
WHERE image_url LIKE '%images-na.ssl-images-amazon.com%'
  AND category = 'Tech';

-- Beauty products still on old CDN → generic beauty placeholder
UPDATE catalog_products
SET image_url = 'https://m.media-amazon.com/images/I/61Q3FMshURL._SL500_.jpg'
WHERE image_url LIKE '%images-na.ssl-images-amazon.com%'
  AND category = 'Beauty';

-- Fashion products still on old CDN → generic fashion placeholder
UPDATE catalog_products
SET image_url = 'https://m.media-amazon.com/images/I/71CpFmYkKRL._SL500_.jpg'
WHERE image_url LIKE '%images-na.ssl-images-amazon.com%'
  AND category = 'Fashion';

-- Kids products still on old CDN → generic kids placeholder
UPDATE catalog_products
SET image_url = 'https://m.media-amazon.com/images/I/81-mIeHjNTL._SL500_.jpg'
WHERE image_url LIKE '%images-na.ssl-images-amazon.com%'
  AND category = 'Kids';

-- Health products still on old CDN → generic health placeholder
UPDATE catalog_products
SET image_url = 'https://m.media-amazon.com/images/I/71HvFwHds8L._SL500_.jpg'
WHERE image_url LIKE '%images-na.ssl-images-amazon.com%'
  AND category = 'Health';

-- Lifestyle products still on old CDN → generic lifestyle placeholder
UPDATE catalog_products
SET image_url = 'https://m.media-amazon.com/images/I/61I7iMfCMZL._SL500_.jpg'
WHERE image_url LIKE '%images-na.ssl-images-amazon.com%'
  AND category = 'Lifestyle';

-- Perfumes still on old CDN or fimgs.net → generic perfume placeholder
UPDATE catalog_products
SET image_url = 'https://m.media-amazon.com/images/I/41MZjjWPVPL._SL500_.jpg'
WHERE (image_url LIKE '%images-na.ssl-images-amazon.com%' OR image_url LIKE '%fimgs.net%')
  AND category = 'Perfumes';

-- Any remaining products on old CDN (any category)
UPDATE catalog_products
SET image_url = 'https://m.media-amazon.com/images/I/61Q3FMshURL._SL500_.jpg'
WHERE image_url LIKE '%images-na.ssl-images-amazon.com%';

-- Any remaining products on fimgs.net
UPDATE catalog_products
SET image_url = 'https://m.media-amazon.com/images/I/41MZjjWPVPL._SL500_.jpg'
WHERE image_url LIKE '%fimgs.net%';

-- Any remaining products on unsplash (generic stock)
UPDATE catalog_products
SET image_url = 'https://m.media-amazon.com/images/I/61Q3FMshURL._SL500_.jpg'
WHERE image_url LIKE '%unsplash.com%';
