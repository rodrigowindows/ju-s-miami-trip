
-- Catalog products table
CREATE TABLE public.catalog_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  price_usd NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL DEFAULT '',
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active catalog products" ON public.catalog_products FOR SELECT USING (true);
CREATE POLICY "Admin manage catalog" ON public.catalog_products FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL DEFAULT '',
  product_url TEXT,
  product_image_url TEXT,
  price_usd NUMERIC,
  price_brl NUMERIC,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access on order_items" ON public.order_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Clients view own order_items" ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.client_id = auth.uid()));
CREATE POLICY "Clients insert own order_items" ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.client_id = auth.uid()));

-- Order events table
CREATE TABLE public.order_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'novo',
  title TEXT NOT NULL DEFAULT '',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access on order_events" ON public.order_events FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Clients view own order_events" ON public.order_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_events.order_id AND orders.client_id = auth.uid()));
CREATE POLICY "Clients insert own order_events" ON public.order_events FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_events.order_id AND orders.client_id = auth.uid()));

-- Add missing columns to orders for backward compat
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_brl NUMERIC;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_usd NUMERIC;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_weight_kg NUMERIC DEFAULT 0;
