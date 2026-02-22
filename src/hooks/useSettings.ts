import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Settings } from "@/lib/types";
import { toast } from "sonner";

export interface AppSettings {
  exchange_rate: string;
  spread_percent: string;
  whatsapp_number: string;
  referral_credit: string;
}

export function useSettings() {
  return useQuery<AppSettings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*");
      if (error) throw error;
      const map: Record<string, string> = {};
      (data as Settings[]).forEach((s) => { map[s.key] = s.value; });
      return {
        exchange_rate: map.exchange_rate ?? "5.70",
        spread_percent: map.spread_percent ?? "3",
        whatsapp_number: map.whatsapp_number ?? "5561999999999",
        referral_credit: map.referral_credit ?? "30",
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
