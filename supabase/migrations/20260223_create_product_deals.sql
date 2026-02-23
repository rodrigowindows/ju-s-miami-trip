-- Product Deals (Ofertas do Dia / Lightning Deals)
CREATE TABLE IF NOT EXISTS product_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES catalog_products(id) ON DELETE CASCADE,
  discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 1 AND 99),
  deal_type TEXT NOT NULL DEFAULT 'deal_of_day' CHECK (deal_type IN ('deal_of_day', 'lightning', 'clearance')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL,
  claimed_count INTEGER NOT NULL DEFAULT 0,
  max_claims INTEGER,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE product_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active deals"
  ON product_deals FOR SELECT USING (true);

CREATE POLICY "Admin can manage deals"
  ON product_deals FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_product_deals_product_id ON product_deals(product_id);
CREATE INDEX IF NOT EXISTS idx_product_deals_active ON product_deals(active, ends_at);

-- Seed some deals
INSERT INTO product_deals (product_id, discount_percent, deal_type, starts_at, ends_at, max_claims, claimed_count) VALUES
  ((SELECT id FROM catalog_products WHERE name LIKE 'AirPods Pro%' LIMIT 1), 25, 'deal_of_day', now(), now() + interval '24 hours', 50, 32),
  ((SELECT id FROM catalog_products WHERE name LIKE 'JBL Charge%' LIMIT 1), 30, 'lightning', now(), now() + interval '6 hours', 20, 14),
  ((SELECT id FROM catalog_products WHERE name LIKE 'Sol de Janeiro%' LIMIT 1), 20, 'deal_of_day', now(), now() + interval '24 hours', 40, 18),
  ((SELECT id FROM catalog_products WHERE name LIKE 'Ray-Ban%' LIMIT 1), 15, 'deal_of_day', now(), now() + interval '24 hours', 30, 9),
  ((SELECT id FROM catalog_products WHERE name LIKE 'Whey Protein%' LIMIT 1), 35, 'lightning', now(), now() + interval '4 hours', 15, 11),
  ((SELECT id FROM catalog_products WHERE name LIKE 'Kindle%' LIMIT 1), 22, 'deal_of_day', now(), now() + interval '24 hours', 25, 7);
