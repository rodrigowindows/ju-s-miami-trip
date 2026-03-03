-- PIX charges table for OpenPix integration
CREATE TABLE IF NOT EXISTS pix_charges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  correlation_id TEXT NOT NULL UNIQUE,
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'EXPIRED')),
  value_cents INTEGER NOT NULL,
  br_code TEXT,
  qr_code_image TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_pix_charges_order_id ON pix_charges(order_id);
CREATE INDEX IF NOT EXISTS idx_pix_charges_correlation_id ON pix_charges(correlation_id);

-- RLS
ALTER TABLE pix_charges ENABLE ROW LEVEL SECURITY;

-- Clients can view their own PIX charges
CREATE POLICY "clients_view_own_pix_charges" ON pix_charges
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE client_id = auth.uid())
  );

-- Service role can do everything (used by Edge Functions)
CREATE POLICY "service_role_all_pix_charges" ON pix_charges
  FOR ALL USING (auth.role() = 'service_role');
