
-- Purchase photos table: admin uploads photos of items bought at stores
CREATE TABLE public.purchase_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id uuid REFERENCES public.order_items(id) ON DELETE SET NULL,
  photo_url text NOT NULL,
  store_name text DEFAULT '',
  notes text,
  purchased_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.purchase_photos ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admin manages purchase photos"
  ON public.purchase_photos FOR ALL
  USING (public.is_admin(auth.uid()));

-- Clients can view photos of their own orders
CREATE POLICY "Clients view own purchase photos"
  ON public.purchase_photos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = purchase_photos.order_id
    AND orders.client_id = auth.uid()
  ));

-- Storage bucket for purchase photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('purchase-photos', 'purchase-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Admin uploads purchase photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'purchase-photos' AND public.is_admin(auth.uid()));

CREATE POLICY "Anyone views purchase photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'purchase-photos');

CREATE POLICY "Admin deletes purchase photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'purchase-photos' AND public.is_admin(auth.uid()));

-- Enable realtime for purchase_photos so clients get instant updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.purchase_photos;
