
ALTER TABLE public.catalog_products
ADD COLUMN IF NOT EXISTS availability_type text NOT NULL DEFAULT 'sob_encomenda',
ADD COLUMN IF NOT EXISTS estimated_days integer,
ADD COLUMN IF NOT EXISTS stock_quantity integer NOT NULL DEFAULT 0;
