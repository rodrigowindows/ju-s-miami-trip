-- Trigger: when a new profile is created with referral meta, create pending referral
CREATE OR REPLACE FUNCTION public.process_referral_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  referrer_record RECORD;
  ref_code text;
BEGIN
  -- Check raw_user_meta_data for referral_code (passed during signup)
  -- We look it up from auth.users
  SELECT raw_user_meta_data->>'referral_code' INTO ref_code
  FROM auth.users WHERE id = NEW.id;
  
  IF ref_code IS NULL OR ref_code = '' THEN
    RETURN NEW;
  END IF;

  SELECT id INTO referrer_record
  FROM public.profiles
  WHERE referral_code = ref_code
  LIMIT 1;

  IF referrer_record.id IS NULL OR referrer_record.id = NEW.id THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.referrals (referrer_id, referred_id, referral_code, status, credit_amount)
  VALUES (referrer_record.id, NEW.id, ref_code, 'pending', 30)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_process_referral ON public.profiles;
CREATE TRIGGER trg_process_referral
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.process_referral_on_signup();

-- Credit referrer R$30 when referred user's first order is delivered
CREATE OR REPLACE FUNCTION public.credit_referral_on_delivery()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  ref RECORD;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'entregue' THEN
    FOR ref IN
      SELECT id, referrer_id, credit_amount
      FROM public.referrals
      WHERE referred_id = NEW.client_id AND status = 'pending'
    LOOP
      INSERT INTO public.wallet_transactions (client_id, type, amount, description, order_id)
      VALUES (ref.referrer_id, 'referral_credit', ref.credit_amount, 
              'Bônus de indicação - amigo fez primeira compra', NEW.id);
      
      UPDATE public.profiles 
      SET wallet_balance = wallet_balance + ref.credit_amount 
      WHERE id = ref.referrer_id;

      UPDATE public.referrals SET status = 'completed' WHERE id = ref.id;

      INSERT INTO public.notifications (client_id, title, message, type)
      VALUES (ref.referrer_id, 'Bônus de indicação! 🎉', 
              'Você ganhou R$ ' || ref.credit_amount || ' porque seu amigo fez a primeira compra!', 
              'system');
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_credit_referral ON public.orders;
CREATE TRIGGER trg_credit_referral
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.credit_referral_on_delivery();