-- ============================================================
-- Notifications table for client notification center
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'system' CHECK (type IN ('order_update', 'promo', 'system')),
  read boolean NOT NULL DEFAULT false,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_client ON notifications(client_id);
CREATE INDEX IF NOT EXISTS idx_notifications_client_read ON notifications(client_id, read);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Client can view their own notifications
CREATE POLICY "Clients view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = client_id);

-- Client can update (mark as read) their own notifications
CREATE POLICY "Clients update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- Admin can manage all notifications
CREATE POLICY "Admin full access notifications"
  ON notifications FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- Add rating/review_count/sales_count/trending to catalog_products if missing
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'catalog_products' AND column_name = 'rating') THEN
    ALTER TABLE catalog_products ADD COLUMN rating numeric NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'catalog_products' AND column_name = 'review_count') THEN
    ALTER TABLE catalog_products ADD COLUMN review_count integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'catalog_products' AND column_name = 'sales_count') THEN
    ALTER TABLE catalog_products ADD COLUMN sales_count integer NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'catalog_products' AND column_name = 'trending') THEN
    ALTER TABLE catalog_products ADD COLUMN trending boolean NOT NULL DEFAULT false;
  END IF;
END$$;

-- ============================================================
-- Seed demo notifications for existing clients
-- ============================================================
INSERT INTO notifications (client_id, title, message, type, order_id)
SELECT
  o.client_id,
  'Pedido ' || o.order_number || ' atualizado',
  'Seu pedido foi atualizado para o status: ' || o.status,
  'order_update',
  o.id
FROM orders o
LIMIT 10
ON CONFLICT DO NOTHING;

-- System welcome notification for all clients
INSERT INTO notifications (client_id, title, message, type)
SELECT
  p.id,
  'Bem-vindo ao AjuVaiParaMiami!',
  'Explore nosso catálogo e aproveite as melhores ofertas de produtos dos EUA.',
  'system'
FROM profiles p
WHERE p.role = 'cliente'
ON CONFLICT DO NOTHING;

-- Promo notification for all clients
INSERT INTO notifications (client_id, title, message, type)
SELECT
  p.id,
  'Novas promoções disponíveis!',
  'Confira as ofertas especiais com desconto em produtos selecionados.',
  'promo'
FROM profiles p
WHERE p.role = 'cliente'
ON CONFLICT DO NOTHING;
