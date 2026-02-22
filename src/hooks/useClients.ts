import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types";

export interface ClientWithStats extends Profile {
  total_orders: number;
  total_spent: number;
}

export function useClients(search?: string) {
  return useQuery<ClientWithStats[]>({
    queryKey: ["clients", search],
    queryFn: async () => {
      let query = supabase.from("profiles").select("*").eq("role", "cliente").order("created_at", { ascending: false });
      if (search) query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);

      const { data, error } = await query;
      if (error) throw error;

      const profiles = (data ?? []) as Profile[];
      const ids = profiles.map((p) => p.id);
      if (ids.length === 0) return [];

      const { data: orders } = await supabase.from("orders").select("client_id, total_amount").in("client_id", ids);
      const statsMap = new Map<string, { count: number; spent: number }>();
      (orders ?? []).forEach((o) => {
        const cur = statsMap.get(o.client_id) ?? { count: 0, spent: 0 };
        cur.count++;
        cur.spent += Number(o.total_amount ?? 0);
        statsMap.set(o.client_id, cur);
      });

      return profiles.map((p) => ({
        ...p,
        total_orders: statsMap.get(p.id)?.count ?? 0,
        total_spent: statsMap.get(p.id)?.spent ?? 0,
      }));
    },
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!id,
  });
}
