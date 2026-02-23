-- Order Reviews: avaliações pós-entrega
CREATE TABLE IF NOT EXISTS order_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(order_id) -- one review per order
);

ALTER TABLE order_reviews ENABLE ROW LEVEL SECURITY;

-- Client can view their own reviews
CREATE POLICY "Clients can view own reviews" ON order_reviews FOR SELECT
  USING (client_id = auth.uid());

-- Client can insert review for their own delivered order
CREATE POLICY "Clients can create review" ON order_reviews FOR INSERT
  WITH CHECK (
    client_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_reviews.order_id
        AND orders.client_id = auth.uid()
        AND orders.status = 'entregue'
    )
  );

-- Admin can view all reviews
CREATE POLICY "Admin can view all reviews" ON order_reviews FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admin can delete reviews
CREATE POLICY "Admin can delete reviews" ON order_reviews FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_order_reviews_client ON order_reviews(client_id);
CREATE INDEX IF NOT EXISTS idx_order_reviews_order ON order_reviews(order_id);
