-- ═══════════════════════════════════════
-- Site Events / Analytics Tracking
-- ═══════════════════════════════════════

CREATE TABLE IF NOT EXISTS site_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  -- visitor identification
  visitor_id text NOT NULL,
  user_id uuid REFERENCES profiles(id),
  -- event context
  product_id uuid,
  product_name text,
  product_brand text,
  product_category text,
  product_price_brl numeric,
  -- page context
  page_path text,
  referrer text,
  -- device / session info
  user_agent text,
  screen_width integer,
  -- metadata (JSON for flexible extra data)
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_site_events_type ON site_events(event_type);
CREATE INDEX IF NOT EXISTS idx_site_events_created ON site_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_events_visitor ON site_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_site_events_product ON site_events(product_id);
CREATE INDEX IF NOT EXISTS idx_site_events_type_created ON site_events(event_type, created_at DESC);

-- Enable RLS
ALTER TABLE site_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (anonymous visitors can track)
CREATE POLICY "Anyone can insert site events"
  ON site_events FOR INSERT
  WITH CHECK (true);

-- Only admins can SELECT (view analytics)
CREATE POLICY "Admins can view site events"
  ON site_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
