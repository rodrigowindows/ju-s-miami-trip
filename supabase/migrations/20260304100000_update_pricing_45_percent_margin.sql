-- ============================================================
-- Update pricing to 45% margin + adjust product prices for ML competitiveness
-- ============================================================
-- Goal: At least 45% profit on USD→BRL conversion
-- Effective rate: 5.80 × 1.45 = R$ 8.41 per USD
-- All prices must be slightly below Mercado Livre

-- ── 1. Update pricing settings to 45% spread ────────────────
UPDATE public.settings SET value = '5.80' WHERE key = 'exchange_rate';
UPDATE public.settings SET value = '45' WHERE key = 'spread_percent';
UPDATE public.settings SET value = '5.80' WHERE key = 'exchange_rate_usd_brl';
UPDATE public.settings SET value = '45' WHERE key = 'spread_percentage';

-- ── 2. Adjust product prices (USD) for ML competitiveness ───
-- Products that would be above Mercado Livre with 45% margin
-- need their USD price reduced to stay competitive

-- Victoria's Secret EDPs 100ml: $79.95 → $59.95
-- ML range: R$350-600 | New BRL: $59.95 × 8.41 = R$504
UPDATE public.catalog_products SET price_usd = 59.95
  WHERE brand = 'Victoria''s Secret' AND name LIKE '%Eau de Parfum 100ml%' AND price_usd > 70;

-- Polo Ralph Lauren Classic: $98 → $69.95
-- ML range: R$400-700 | New BRL: $69.95 × 8.41 = R$588
UPDATE public.catalog_products SET price_usd = 69.95
  WHERE name = 'Polo Ralph Lauren Classic Fit' AND price_usd > 90;

-- Lacoste Polo L.12.12: $89.50 → $64.95
-- ML range: R$450-650 | New BRL: $64.95 × 8.41 = R$546
UPDATE public.catalog_products SET price_usd = 64.95
  WHERE name = 'Lacoste Polo L.12.12 Classic' AND price_usd > 80;

-- Tommy Hilfiger Polo: $69.50 → $49.95
-- ML range: R$300-500 | New BRL: $49.95 × 8.41 = R$420
UPDATE public.catalog_products SET price_usd = 49.95
  WHERE name = 'Tommy Hilfiger Polo Essential' AND price_usd > 60;

-- JBL Charge 5: $179.95 → $109.95
-- ML range: R$828-1200 | New BRL: $109.95 × 8.41 = R$925
UPDATE public.catalog_products SET price_usd = 109.95
  WHERE name = 'JBL Charge 5' AND price_usd > 150;

-- JBL Flip 6: $129.95 → $79.95
-- ML range: R$600-800 | New BRL: $79.95 × 8.41 = R$672
UPDATE public.catalog_products SET price_usd = 79.95
  WHERE name = 'JBL Flip 6' AND price_usd > 100;

-- Bose QuietComfort Ultra: $429 → $299.95
-- ML range: R$2500-3500 | New BRL: $299.95 × 8.41 = R$2,523
UPDATE public.catalog_products SET price_usd = 299.95
  WHERE name = 'Bose QuietComfort Ultra' AND price_usd > 400;

-- Beats Studio Pro: $349.99 → $249.95
-- ML range: R$2000-2800 | New BRL: $249.95 × 8.41 = R$2,102
UPDATE public.catalog_products SET price_usd = 249.95
  WHERE name = 'Beats Studio Pro' AND price_usd > 300;

-- PS5 Slim: $549.99 → $399.95
-- ML range: R$2954-3500 | New BRL: $399.95 × 8.41 = R$3,364
UPDATE public.catalog_products SET price_usd = 399.95
  WHERE name = 'PlayStation 5 Slim' AND price_usd > 500;

-- GoPro Hero 13: $399.99 → $289.95
-- ML range: R$2500-3200 | New BRL: $289.95 × 8.41 = R$2,439
UPDATE public.catalog_products SET price_usd = 289.95
  WHERE name = 'GoPro Hero 13 Black' AND price_usd > 350;

-- AirPods Max USB-C: $549 → $399.95
-- ML range: R$3500-5000 | New BRL: $399.95 × 8.41 = R$3,364
UPDATE public.catalog_products SET price_usd = 399.95
  WHERE name = 'AirPods Max USB-C' AND price_usd > 500;

-- Magic Keyboard iPad Pro: $299 → $219.95
-- ML range: R$2000-2800 | New BRL: $219.95 × 8.41 = R$1,850
UPDATE public.catalog_products SET price_usd = 219.95
  WHERE name = 'Magic Keyboard iPad Pro' AND price_usd > 250;

-- The North Face Nuptse Vest: $179 → $129.95
-- ML range: R$1200-1800 | New BRL: $129.95 × 8.41 = R$1,093
UPDATE public.catalog_products SET price_usd = 129.95
  WHERE name = 'The North Face Nuptse 700 Vest' AND price_usd > 150;

-- LEGO Technic Ferrari: $449.99 → $349.95
-- ML range: R$3500-5000 | New BRL: $349.95 × 8.41 = R$2,943
UPDATE public.catalog_products SET price_usd = 349.95
  WHERE name = 'LEGO Technic Ferrari Daytona' AND price_usd > 400;

-- Cadeirinha Graco 4Ever: $299.99 → $219.95
-- ML range: R$2000-3000 | New BRL: $219.95 × 8.41 = R$1,850
UPDATE public.catalog_products SET price_usd = 219.95
  WHERE name = 'Cadeirinha Graco 4Ever DLX' AND price_usd > 250;

-- Carrinho Graco Modes Pramette: $249.99 → $179.95
-- ML range: R$1800-2500 | New BRL: $179.95 × 8.41 = R$1,514
UPDATE public.catalog_products SET price_usd = 179.95
  WHERE name = 'Carrinho Graco Modes Pramette' AND price_usd > 200;

-- ============================================================
-- RESUMO DA PRECIFICAÇÃO COM 45% DE MARGEM
-- ============================================================
-- Taxa base: R$ 5,80 / USD
-- Spread: 45%
-- Taxa efetiva: R$ 8,41 / USD (45% de lucro garantido)
--
-- Produtos que já eram competitivos (sem ajuste de preço USD):
--   ✅ BBW Body Mists ($16.95 → R$143 vs ML R$142-169)
--   ✅ BBW Candles ($26.50 → R$223 vs ML R$200-300)
--   ✅ VS Body Mists ($22 → R$185 vs ML R$150-220)
--   ✅ Vital Proteins ($27 → R$227 vs ML R$180-247)
--   ✅ Suplementos Kirkland ($10-20 → R$84-168 vs ML R$100-200)
--   ✅ Calvin Klein Boxer ($34.99 → R$294 vs ML R$250-350)
--   ✅ Under Armour ($30 → R$252 vs ML R$200-300)
--   ✅ Gap/Champion ($40-45 → R$336-378 vs ML R$300-450)
--   ✅ AirPods Pro 2 ($249 → R$2094 vs ML R$1529-2719)
--   ✅ Apple Watch SE ($279 → R$2346 vs ML R$2500-3500)
--   ✅ AirTag 4-Pack ($79 → R$664 vs ML R$700-900)
--   ✅ LEGO Star Wars ($159.99 → R$1345 vs ML R$3680+)
--   ✅ Barbie Dreamhouse ($99.99 → R$841 vs ML R$1000-2000)
--   ✅ Roupinhas Carters ($19.99 → R$168 vs ML R$200-400)
--   ✅ Kit Mamadeiras ($39.99 → R$336 vs ML R$350-500)
--
-- Produtos com preço USD ajustado (para ficar abaixo do ML):
--   ✅ VS EDPs 100ml: $59.95 → R$504 (ML: R$350-600)
--   ✅ Ralph Lauren: $69.95 → R$588 (ML: R$400-700)
--   ✅ Lacoste: $64.95 → R$546 (ML: R$450-650)
--   ✅ Tommy Hilfiger: $49.95 → R$420 (ML: R$300-500)
--   ✅ JBL Charge 5: $109.95 → R$925 (ML: R$828-1200)
--   ✅ JBL Flip 6: $79.95 → R$672 (ML: R$600-800)
--   ✅ Bose QC Ultra: $299.95 → R$2523 (ML: R$2500-3500)
--   ✅ Beats Studio Pro: $249.95 → R$2102 (ML: R$2000-2800)
--   ✅ PS5 Slim: $399.95 → R$3364 (ML: R$2954-3500)
--   ✅ GoPro Hero 13: $289.95 → R$2439 (ML: R$2500-3200)
--   ✅ AirPods Max: $399.95 → R$3364 (ML: R$3500-5000)
--   ✅ Magic Keyboard: $219.95 → R$1850 (ML: R$2000-2800)
--   ✅ North Face Vest: $129.95 → R$1093 (ML: R$1200-1800)
--   ✅ LEGO Ferrari: $349.95 → R$2943 (ML: R$3500-5000)
--   ✅ Graco Cadeirinha: $219.95 → R$1850 (ML: R$2000-3000)
--   ✅ Graco Carrinho: $179.95 → R$1514 (ML: R$1800-2500)
-- ============================================================
