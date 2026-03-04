-- ══════════════════════════════════════════════════════════════
-- Fix missing / broken / generic product images
-- Replace generic Unsplash placeholders with product-accurate images
-- ══════════════════════════════════════════════════════════════

-- ── SKINCARE / THE ORDINARY ──────────────────────────────────

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop'
WHERE name = 'The Ordinary Niacinamide 10% + Zinc 1% 30ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop'
WHERE name = 'The Ordinary Hyaluronic Acid 2% + B5 30ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop'
WHERE name = 'The Ordinary AHA 30% + BHA 2% Peeling Solution 30ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop'
WHERE name = 'The Ordinary Glycolic Acid 7% Toning Solution 240ml' AND brand = 'The Ordinary';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=400&h=400&fit=crop'
WHERE name = 'The Ordinary Retinol 0.5% in Squalane 30ml' AND brand = 'The Ordinary';

-- ── SKINCARE / OLAPLEX & CERAVE ──────────────────────────────

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop'
WHERE name = 'Olaplex No.3 Hair Perfector 100ml' AND brand = 'Olaplex';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=400&h=400&fit=crop'
WHERE name = 'Olaplex No.4 Bond Maintenance Shampoo 250ml' AND brand = 'Olaplex';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop'
WHERE name = 'Olaplex No.5 Bond Maintenance Conditioner 250ml' AND brand = 'Olaplex';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop'
WHERE name = 'CeraVe Moisturizing Cream 539g' AND brand = 'CeraVe';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
WHERE name = 'CeraVe Foaming Facial Cleanser 473ml' AND brand = 'CeraVe';

-- ── MAQUIAGEM ────────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&h=400&fit=crop'
WHERE name = 'Fenty Beauty Gloss Bomb Universal Lip Luminizer' AND brand = 'Fenty Beauty';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1590156546573-4eb8a439620b?w=400&h=400&fit=crop'
WHERE name = 'Fenty Beauty Pro Filtr Soft Matte Foundation' AND brand = 'Fenty Beauty';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop'
WHERE name = 'Too Faced Better Than Sex Mascara' AND brand = 'Too Faced';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400&h=400&fit=crop'
WHERE name = 'Too Faced Lip Injection Extreme Lip Plumper' AND brand = 'Too Faced';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop'
WHERE name = 'MAC Ruby Woo Retro Matte Lipstick' AND brand = 'MAC';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?w=400&h=400&fit=crop'
WHERE name = 'Anastasia Beverly Hills Brow Wiz' AND brand = 'Anastasia Beverly Hills';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400&h=400&fit=crop'
WHERE name = 'Anastasia Beverly Hills Soft Glam Palette' AND brand = 'Anastasia Beverly Hills';

-- ── SUPLEMENTOS ──────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop'
WHERE name = 'Melatonina 10mg 300 Caps' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop'
WHERE name = 'Hair Skin & Nails 250 Softgels' AND brand = 'Nature''s Bounty';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop'
WHERE name = 'Omega-3 Fish Oil 1200mg 200 Softgels' AND brand = 'Nature Made';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop'
WHERE name = 'Vitamin D3 5000 IU 400 Softgels' AND brand = 'Kirkland';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1593095948071-474c5cc2c989?w=400&h=400&fit=crop'
WHERE name = 'Creatina Monohidratada 400g' AND brand = 'Optimum Nutrition';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=400&h=400&fit=crop'
WHERE name = 'Whey Protein Gold Standard 2lb' AND brand = 'Optimum Nutrition';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop'
WHERE name = 'Magnesium Glycinate 400mg 180 Caps' AND brand = 'Doctor''s Best';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop'
WHERE name = 'Probiotico 50 Bilhões CFU 30 Caps' AND brand = 'Garden of Life';

-- ── ROUPAS / MODA LEVE ───────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop'
WHERE name = 'Calvin Klein Boxer Brief 3-Pack' AND brand = 'Calvin Klein';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop'
WHERE name = 'Calvin Klein Bralette Feminino 2-Pack' AND brand = 'Calvin Klein';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
WHERE name = 'Tommy Hilfiger Camiseta Classic Logo' AND brand = 'Tommy Hilfiger';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=400&fit=crop'
WHERE name = 'Tommy Hilfiger Bone Classic Cap' AND brand = 'Tommy Hilfiger';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=400&fit=crop'
WHERE name = 'Ralph Lauren Bone Classic Pony Cap' AND brand = 'Ralph Lauren';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1503341504253-dff4f94032e4?w=400&h=400&fit=crop'
WHERE name = 'Hollister Camiseta Graphic Logo' AND brand = 'Hollister';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop'
WHERE name = 'Abercrombie & Fitch Camiseta Essential' AND brand = 'Abercrombie & Fitch';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'
WHERE name = 'Levi''s Cinto Reversivel Couro' AND brand = 'Levi''s';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop'
WHERE name = 'Nike Meia Everyday Cushion 6-Pack' AND brand = 'Nike';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop'
WHERE name = 'Adidas Meia Cushioned 6-Pack' AND brand = 'Adidas';

-- ── PERFUMES (fimgs.net pode estar bloqueado → usar Unsplash) ─

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop'
WHERE name = 'Dior Sauvage EDT 100ml' AND brand = 'Dior';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop'
WHERE name = 'Chanel Bleu de Chanel EDT 100ml' AND brand = 'Chanel';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&h=400&fit=crop'
WHERE name = 'Carolina Herrera Good Girl EDP 80ml' AND brand = 'Carolina Herrera';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1594035910387-fea081dc9b3c?w=400&h=400&fit=crop'
WHERE name = 'Versace Eros EDT 100ml' AND brand = 'Versace';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop'
WHERE name = 'YSL Libre EDP 90ml' AND brand = 'Yves Saint Laurent';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1595425959667-0f5af1f5cb44?w=400&h=400&fit=crop'
WHERE name = 'Dolce & Gabbana Light Blue EDT 100ml' AND brand = 'Dolce & Gabbana';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop'
WHERE name = 'Jean Paul Gaultier Scandal EDP 80ml' AND brand = 'Jean Paul Gaultier';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1594035910387-fea081dc9b3c?w=400&h=400&fit=crop'
WHERE name = 'Giorgio Armani Acqua di Gio EDT 100ml' AND brand = 'Giorgio Armani';

-- ── ACESSÓRIOS ───────────────────────────────────────────────

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
WHERE name = 'Ray-Ban Aviator Classic' AND brand = 'Ray-Ban';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop'
WHERE name = 'Ray-Ban Wayfarer Classic' AND brand = 'Ray-Ban';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop'
WHERE name = 'Stanley Quencher H2.0 40oz' AND brand = 'Stanley';

UPDATE catalog_products SET image_url = 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop'
WHERE name = 'Stanley IceFlow Flip Straw 30oz' AND brand = 'Stanley';
