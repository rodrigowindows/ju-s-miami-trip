-- Migration: Create order-related tables and storage
-- Run this in your Supabase SQL editor or via supabase db push

-- 1. Add trip_id to orders table
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS trip_id uuid REFERENCES trips(id) ON DELETE SET NULL;

-- 2. Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  name text NOT NULL,
  store text NOT NULL,
  price_usd numeric NOT NULL DEFAULT 0,
  price_brl numeric NOT NULL DEFAULT 0,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Create order_events table
CREATE TABLE IF NOT EXISTS order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  title text NOT NULL,
  description text,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON order_events(order_id);
CREATE INDEX IF NOT EXISTS idx_order_events_created_at ON order_events(order_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_trip_id ON orders(trip_id);

-- 5. Enable RLS (Row Level Security)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;

-- 6. RLS policies (allow all for authenticated users - adjust as needed)
CREATE POLICY "Allow all for authenticated users" ON order_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON order_events
  FOR ALL USING (auth.role() = 'authenticated');

-- 7. Create storage bucket for order files
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-files', 'order-files', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage policy: public read access
CREATE POLICY "Public read access for order-files" ON storage.objects
  FOR SELECT USING (bucket_id = 'order-files');

-- 9. Storage policy: authenticated users can upload
CREATE POLICY "Authenticated users can upload to order-files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'order-files' AND auth.role() = 'authenticated');

-- 10. Storage policy: authenticated users can update their uploads
CREATE POLICY "Authenticated users can update order-files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'order-files' AND auth.role() = 'authenticated');
