-- Link promotions to catalog products
ALTER TABLE promotions
  ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES catalog_products(id) ON DELETE SET NULL;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_promotions_product_id ON promotions(product_id);
