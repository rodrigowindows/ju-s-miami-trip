-- ═══════════════════════════════════════════════
-- Create notifications and chat_messages tables if they don't exist
-- ═══════════════════════════════════════════════

-- 1. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  title text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'system',
  read boolean NOT NULL DEFAULT false,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Clients view own notifications') THEN
    CREATE POLICY "Clients view own notifications" ON public.notifications
      FOR SELECT USING (auth.uid() = client_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Clients update own notifications') THEN
    CREATE POLICY "Clients update own notifications" ON public.notifications
      FOR UPDATE USING (auth.uid() = client_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Admin manages notifications') THEN
    CREATE POLICY "Admin manages notifications" ON public.notifications
      FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'System inserts notifications') THEN
    CREATE POLICY "System inserts notifications" ON public.notifications
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- 2. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  sender_role text NOT NULL DEFAULT 'client',
  sender_id uuid,
  message text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Clients view own chat') THEN
    CREATE POLICY "Clients view own chat" ON public.chat_messages
      FOR SELECT USING (auth.uid() = client_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Clients send own messages') THEN
    CREATE POLICY "Clients send own messages" ON public.chat_messages
      FOR INSERT WITH CHECK (auth.uid() = client_id AND sender_role = 'client');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Clients mark own chat as read') THEN
    CREATE POLICY "Clients mark own chat as read" ON public.chat_messages
      FOR UPDATE USING (auth.uid() = client_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Admin manages all chat') THEN
    CREATE POLICY "Admin manages all chat" ON public.chat_messages
      FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- Enable realtime (safe to re-run, will error silently if already added)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
