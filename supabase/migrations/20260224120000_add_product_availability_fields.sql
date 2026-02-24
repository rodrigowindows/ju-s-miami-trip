ALTER TABLE public.catalog_products
ADD COLUMN IF NOT EXISTS availability_type text NOT NULL DEFAULT 'sob_encomenda'
  CHECK (availability_type IN ('pronta_entrega', 'sob_encomenda', 'esgotado')),
ADD COLUMN IF NOT EXISTS estimated_days integer,
ADD COLUMN IF NOT EXISTS stock_quantity integer NOT NULL DEFAULT 0;

UPDATE public.catalog_products
SET availability_type = CASE
  WHEN active = false THEN 'esgotado'
  WHEN stock_quantity > 0 THEN 'pronta_entrega'
  ELSE 'sob_encomenda'
END
WHERE availability_type IS NULL OR availability_type = '';

