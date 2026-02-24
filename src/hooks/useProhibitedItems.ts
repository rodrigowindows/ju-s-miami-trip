import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useProhibitedItems() {
  return useQuery<string[]>({
    queryKey: ["prohibited_items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("value").eq("key", "prohibited_items").single();
      if (error && error.code !== "PGRST116") throw error;
      if (!data) return [];
      try { return JSON.parse(data.value as string) as string[]; } catch { return []; }
    },
  });
}

export function useSaveProhibitedItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: string[]) => {
      const { error } = await supabase.from("settings").upsert({ key: "prohibited_items", value: JSON.stringify(items), updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["prohibited_items"] }); toast.success("Itens proibidos atualizados!"); },
    onError: () => toast.error("Erro ao salvar itens proibidos."),
  });
}
