import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PixCharge = {
  charge_id: string;
  correlation_id: string;
  br_code: string | null;
  qr_code_image: string | null;
  status: "ACTIVE" | "COMPLETED" | "EXPIRED";
};

export function usePixCharge() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charge, setCharge] = useState<PixCharge | null>(null);

  async function createCharge(orderId: string, valueBrl: number) {
    setLoading(true);
    setError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const res = await supabase.functions.invoke("create-pix-charge", {
        body: { order_id: orderId, value_brl: valueBrl },
      });

      if (res.error) {
        throw new Error(res.error.message || "Failed to create PIX charge");
      }

      const data = res.data as PixCharge;
      setCharge(data);
      return data;
    } catch (err: any) {
      const msg = err?.message || "Erro ao gerar cobrança PIX";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setCharge(null);
    setError(null);
    setLoading(false);
  }

  return { charge, loading, error, createCharge, reset };
}
