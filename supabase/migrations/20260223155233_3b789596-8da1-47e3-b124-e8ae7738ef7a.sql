
-- Create order_reviews table
CREATE TABLE IF NOT EXISTS public.order_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  client_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(order_id)
);

-- Enable RLS
ALTER TABLE public.order_reviews ENABLE ROW LEVEL SECURITY;

-- Clients can view their own reviews
CREATE POLICY "Clients view own reviews"
ON public.order_reviews FOR SELECT
USING (auth.uid() = client_id);

-- Clients can insert review only for their own delivered orders (1 per order enforced by UNIQUE)
CREATE POLICY "Clients insert own review"
ON public.order_reviews FOR INSERT
WITH CHECK (
  auth.uid() = client_id
  AND EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_reviews.order_id
    AND orders.client_id = auth.uid()
    AND orders.status = 'entregue'
  )
);

-- Admin full access
CREATE POLICY "Admin manages reviews"
ON public.order_reviews FOR ALL
USING (is_admin(auth.uid()));
