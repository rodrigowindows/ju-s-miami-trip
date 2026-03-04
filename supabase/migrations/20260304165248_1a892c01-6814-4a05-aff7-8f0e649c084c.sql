
-- Add unique constraint on (name, brand) if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'catalog_products_name_brand_key'
  ) THEN
    ALTER TABLE public.catalog_products ADD CONSTRAINT catalog_products_name_brand_key UNIQUE (name, brand);
  END IF;
END $$;
