
CREATE OR REPLACE FUNCTION public.notify_review_reply()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.admin_reply IS DISTINCT FROM NEW.admin_reply AND NEW.admin_reply IS NOT NULL AND NEW.admin_reply <> '' THEN
    INSERT INTO public.notifications (client_id, title, message, type, order_id)
    VALUES (
      NEW.client_id,
      'Resposta à sua avaliação ⭐',
      'O admin respondeu à sua avaliação: "' || LEFT(NEW.admin_reply, 100) || CASE WHEN LENGTH(NEW.admin_reply) > 100 THEN '...' ELSE '' END || '"',
      'system',
      NEW.order_id
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_review_reply
  AFTER UPDATE ON public.order_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_review_reply();
