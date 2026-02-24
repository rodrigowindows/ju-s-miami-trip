import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Setting, AppSettings } from "@/types";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { toast } from "sonner";

export function useSettings() {
  return useQuery<AppSettings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*");
      if (error) throw error;
      const map: Record<string, string> = {};
      (data as Setting[]).forEach((s) => { map[s.key] = s.value; });
      return {
        exchange_rate: map.exchange_rate ?? DEFAULT_SETTINGS.exchange_rate,
        spread_percent: map.spread_percent ?? DEFAULT_SETTINGS.spread_percent,
        whatsapp_number: map.whatsapp_number ?? DEFAULT_SETTINGS.whatsapp_number,
        referral_credit: map.referral_credit ?? DEFAULT_SETTINGS.referral_credit,
        store_name: map.store_name ?? DEFAULT_SETTINGS.store_name,
        store_tagline: map.store_tagline ?? DEFAULT_SETTINGS.store_tagline,
        instagram_url: map.instagram_url ?? DEFAULT_SETTINGS.instagram_url,
        categories: map.categories ?? DEFAULT_SETTINGS.categories,
        prohibited_items: map.prohibited_items ?? DEFAULT_SETTINGS.prohibited_items,
        default_weight_kg: map.default_weight_kg ?? DEFAULT_SETTINGS.default_weight_kg,
        promo_ticker_text: map.promo_ticker_text ?? DEFAULT_SETTINGS.promo_ticker_text,
      };
    },
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Partial<AppSettings>) => {
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from("settings")
          .upsert({ key, value: String(value), updated_at: new Date().toISOString() }, { onConflict: "key" });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["settings"] }); toast.success("Configurações salvas!"); },
    onError: () => toast.error("Erro ao salvar configurações."),
  });
}
