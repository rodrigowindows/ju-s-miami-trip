
-- ═══════════════════════════════════════════════
-- 1. NOTIFICATIONS TABLE
-- ═══════════════════════════════════════════════
CREATE TABLE public.notifications (
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

CREATE POLICY "Clients view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Clients update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Admin manages notifications" ON public.notifications
  FOR ALL USING (is_admin(auth.uid()));

-- Allow triggers/functions to insert notifications
CREATE POLICY "System inserts notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- ═══════════════════════════════════════════════
-- 2. CHAT MESSAGES TABLE
-- ═══════════════════════════════════════════════
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  sender_role text NOT NULL DEFAULT 'client',
  sender_id uuid NOT NULL,
  message text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view own chat" ON public.chat_messages
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Clients send own messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = client_id AND sender_role = 'client');

CREATE POLICY "Clients mark own chat as read" ON public.chat_messages
  FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Admin manages all chat" ON public.chat_messages
  FOR ALL USING (is_admin(auth.uid()));

-- Enable realtime for chat and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ═══════════════════════════════════════════════
-- 3. ORDER STATUS NOTIFICATION TRIGGER
-- ═══════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (client_id, title, message, type, order_id)
    VALUES (
      NEW.client_id,
      'Pedido ' || NEW.order_number || ' atualizado',
      CASE NEW.status
        WHEN 'orcamento' THEN 'Seu pedido está sendo orçado.'
        WHEN 'aprovado' THEN 'Seu pedido foi aprovado!'
        WHEN 'comprando' THEN 'Estamos comprando seus produtos nos EUA!'
        WHEN 'comprado' THEN 'Seus produtos foram comprados!'
        WHEN 'em_transito' THEN 'Seus produtos estão a caminho do Brasil!'
        WHEN 'chegou_brasil' THEN 'Seus produtos chegaram ao Brasil!'
        WHEN 'entregue' THEN 'Seu pedido foi entregue! Obrigado pela compra!'
        WHEN 'cancelado' THEN 'Seu pedido foi cancelado.'
        ELSE 'Status atualizado para: ' || NEW.status
      END,
      'order_update',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER order_status_notification
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_status_change();

-- ═══════════════════════════════════════════════
-- 4. LOYALTY POINTS TRIGGER (5% cashback on delivery)
-- ═══════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.award_loyalty_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  points_amount numeric;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'entregue' THEN
    points_amount := ROUND(NEW.total_amount * 0.05, 2);
    IF points_amount > 0 THEN
      INSERT INTO public.wallet_transactions (client_id, type, amount, description, order_id)
      VALUES (NEW.client_id, 'loyalty_credit', points_amount, 'Cashback 5% - Pedido ' || NEW.order_number, NEW.id);
      
      UPDATE public.profiles SET wallet_balance = wallet_balance + points_amount WHERE id = NEW.client_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER order_loyalty_points
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.award_loyalty_points();
