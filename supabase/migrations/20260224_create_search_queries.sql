-- Table to track search queries for analytics
CREATE TABLE IF NOT EXISTS search_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  source text NOT NULL DEFAULT 'public', -- 'public' or 'client'
  user_id uuid REFERENCES profiles(id),
  results_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Index for analytics queries
CREATE INDEX idx_search_queries_created_at ON search_queries(created_at DESC);
CREATE INDEX idx_search_queries_query ON search_queries(query);

-- RLS
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public visitors too)
CREATE POLICY "Anyone can insert search queries"
  ON search_queries FOR INSERT
  WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can read search queries"
  ON search_queries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
