-- ============================================================
-- Fix product prices + Update pricing settings for viable margins
-- ============================================================
-- Issues found:
-- 1. PS5 Slim (disc version) was $449, Sony raised to $549.99 in Oct 2025
-- 2. Levi's 501 MSRP is $69.50, not $69.00
-- 3. Kindle Paperwhite MSRP is $149.99, not $149.00
-- 4. Spread of 3% is too low — doesn't cover service costs
-- 5. Exchange rate 5.70 is outdated (market ~5.18, simulator uses 5.80)
-- 6. Simulator (5.80 + 15%) and order system (5.70 + 3%) were inconsistent

-- ── 1. Product price corrections ─────────────────────────────

-- PS5 Slim disc version: Sony price increase Oct 2025 → $549.99
UPDATE public.catalog_products SET price_usd = 549.99
  WHERE name = 'PlayStation 5 Slim' AND price_usd = 449.00;

-- Levi's 501 Original: correct MSRP is $69.50
UPDATE public.catalog_products SET price_usd = 69.50
  WHERE name LIKE 'Levi%501%' AND price_usd = 69.00;

-- Kindle Paperwhite: correct MSRP is $149.99
UPDATE public.catalog_products SET price_usd = 149.99
  WHERE name LIKE 'Kindle Paperwhite%' AND price_usd = 149.00;

-- Chanel N5 EDP: ensure it's $150 (may have already been fixed)
UPDATE public.catalog_products SET price_usd = 150.00
  WHERE name LIKE '%Chanel N5%' AND price_usd = 135.00;

-- ── 2. Update pricing settings ───────────────────────────────
-- Exchange rate: 5.70 → 5.80 (includes buffer over market ~5.18)
-- Spread: 3% → 15% (covers service fee, profit, shipping, risk)
-- This matches the PriceSimulator (5.80 + 15%) so pricing is consistent
-- Effective rate: 5.80 × 1.15 = R$ 6.67 per USD (~29% over market)
-- Customers still save 20-40% vs buying in Brazil

UPDATE public.settings SET value = '5.80' WHERE key = 'exchange_rate';
UPDATE public.settings SET value = '15' WHERE key = 'spread_percent';
UPDATE public.settings SET value = '5.80' WHERE key = 'exchange_rate_usd_brl';
UPDATE public.settings SET value = '15' WHERE key = 'spread_percentage';
