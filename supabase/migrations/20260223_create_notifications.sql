-- ╔══════════════════════════════════════════════════════════╗
-- ║  Notifications System                                    ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'order_status',
  title TEXT NOT NULL,
  body TEXT,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);

-- RLS: users see only their own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can insert notifications for any user
CREATE POLICY "Authenticated users can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
