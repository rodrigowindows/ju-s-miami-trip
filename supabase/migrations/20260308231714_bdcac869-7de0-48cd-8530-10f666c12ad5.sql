
-- Create product_alerts table for "notify me" feature
CREATE TABLE IF NOT EXISTS public.product_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.catalog_products(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  whatsapp text,
  notified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert product alerts"
  ON public.product_alerts FOR INSERT
  WITH CHECK (user_email IS NOT NULL AND user_email <> '');

CREATE POLICY "Admin manages product alerts"
  ON public.product_alerts FOR ALL
  USING (is_admin(auth.uid()));

-- Create search_queries table for search analytics
CREATE TABLE IF NOT EXISTS public.search_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  results_count integer NOT NULL DEFAULT 0,
  source text NOT NULL DEFAULT 'public',
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert search queries"
  ON public.search_queries FOR INSERT
  WITH CHECK (query IS NOT NULL AND query <> '');

CREATE POLICY "Admin views search queries"
  ON public.search_queries FOR SELECT
  USING (is_admin(auth.uid()));
