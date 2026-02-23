
-- 1. Add missing columns to catalog_products
ALTER TABLE public.catalog_products
  ADD COLUMN IF NOT EXISTS sales_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS trending boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rating numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count integer NOT NULL DEFAULT 0;

-- 2. Add product_id to promotions
ALTER TABLE public.promotions
  ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES public.catalog_products(id) ON DELETE SET NULL;

-- 3. Create product_reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.catalog_products(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL DEFAULT 'Cliente',
  rating integer NOT NULL DEFAULT 5,
  comment text,
  verified_purchase boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Admin manages reviews" ON public.product_reviews FOR ALL USING (is_admin(auth.uid()));

-- 4. Create product_deals table
CREATE TABLE IF NOT EXISTS public.product_deals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.catalog_products(id) ON DELETE CASCADE,
  discount_percent numeric NOT NULL DEFAULT 10,
  deal_type text NOT NULL DEFAULT 'deal_of_day',
  starts_at timestamp with time zone NOT NULL DEFAULT now(),
  ends_at timestamp with time zone NOT NULL DEFAULT (now() + interval '24 hours'),
  claimed_count integer NOT NULL DEFAULT 0,
  max_claims integer,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.product_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active deals" ON public.product_deals FOR SELECT USING (true);
CREATE POLICY "Admin manages deals" ON public.product_deals FOR ALL USING (is_admin(auth.uid()));
