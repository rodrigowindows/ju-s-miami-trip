import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/integrations/supabase/types';

export interface ClientWithStats extends Profile {
  total_orders: number;
  total_spent: number;
}

export function useClients(search?: string) {
  return useQuery<ClientWithStats[]>({
    queryKey: ['clients', search],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // For now, return with default stats - in production these would come from a view or RPC
      return (data as Profile[]).map((p) => ({
        ...p,
        total_orders: 0,
        total_spent: 0,
      }));
    },
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!id,
  });
}
