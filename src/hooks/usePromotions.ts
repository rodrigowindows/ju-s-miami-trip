import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Promotion, InsertTables, UpdateTables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export function usePromotions() {
  return useQuery<Promotion[]>({
    queryKey: ['promotions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Promotion[];
    },
  });
}

export function useActivePromotions() {
  return useQuery<Promotion[]>({
    queryKey: ['promotions', 'active'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('active', true)
        .lte('starts_at', now)
        .gte('expires_at', now)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Promotion[];
    },
  });
}

export function useCreatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (promo: InsertTables<'promotions'>) => {
      const { data, error } = await supabase.from('promotions').insert(promo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promoção criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar promoção.'),
  });
}

export function useUpdatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...update }: UpdateTables<'promotions'> & { id: string }) => {
      const { data, error } = await supabase.from('promotions').update(update).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promoção atualizada!');
    },
    onError: () => toast.error('Erro ao atualizar promoção.'),
  });
}

export function useTogglePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from('promotions').update({ active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Status atualizado!');
    },
    onError: () => toast.error('Erro ao alterar status.'),
  });
}
