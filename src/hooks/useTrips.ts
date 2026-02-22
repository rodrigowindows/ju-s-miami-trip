import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TripWithAllocated, Order } from "@/lib/types";
import { toast } from "sonner";

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: async (): Promise<TripWithAllocated[]> => {
      const { data: trips, error } = await supabase
        .from("trips")
        .select("*")
        .order("departure_date", { ascending: false });
      if (error) throw error;

      const { data: orders, error: oErr } = await supabase
        .from("orders")
        .select("trip_id, estimated_weight_kg")
        .not("trip_id", "is", null);
      if (oErr) throw oErr;

      return (trips ?? []).map((trip) => {
        const tripOrders = (orders ?? []).filter((o) => o.trip_id === trip.id);
        return {
          ...trip,
          allocated_weight_kg: tripOrders.reduce((s, o) => s + (o.estimated_weight_kg ?? 0), 0),
          allocated_items_count: tripOrders.length,
        };
      });
    },
  });
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ["trips", id],
    queryFn: async () => {
      const { data: trip, error } = await supabase.from("trips").select("*").eq("id", id).single();
      if (error) throw error;

      const { data: orders, error: oErr } = await supabase.from("orders").select("*").eq("trip_id", id);
      if (oErr) throw oErr;

      const allocated_weight_kg = (orders ?? []).reduce((s, o) => s + (o.estimated_weight_kg ?? 0), 0);
      return {
        trip: { ...trip, allocated_weight_kg, allocated_items_count: (orders ?? []).length } as TripWithAllocated,
        orders: (orders ?? []) as Order[],
      };
    },
    enabled: !!id,
  });
}

export function useUnassignedOrders() {
  return useQuery({
    queryKey: ["orders", "unassigned"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").is("trip_id", null).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Order[];
    },
  });
}

export function useCreateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (trip: { code: string; traveler_name: string; flight_number: string; departure_date: string; arrival_date: string; max_weight_kg: number }) => {
      const { data, error } = await supabase.from("trips").insert(trip).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["trips"] }); toast.success("Viagem criada!"); },
    onError: () => toast.error("Erro ao criar viagem."),
  });
}

export function useUpdateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; code?: string; traveler_name?: string; flight_number?: string; departure_date?: string; arrival_date?: string; max_weight_kg?: number }) => {
      const { data, error } = await supabase.from("trips").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => { qc.invalidateQueries({ queryKey: ["trips"] }); qc.invalidateQueries({ queryKey: ["trips", vars.id] }); toast.success("Viagem atualizada!"); },
    onError: () => toast.error("Erro ao atualizar viagem."),
  });
}

export function useDeleteTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("trips").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["trips"] }); toast.success("Viagem excluída!"); },
    onError: () => toast.error("Erro ao excluir. Verifique se não há pedidos alocados."),
  });
}

export function useAllocateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, tripId }: { orderId: string; tripId: string }) => {
      const { error } = await supabase.from("orders").update({ trip_id: tripId }).eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["trips", vars.tripId] });
      qc.invalidateQueries({ queryKey: ["trips"] });
      qc.invalidateQueries({ queryKey: ["orders", "unassigned"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido alocado na viagem!");
    },
    onError: () => toast.error("Erro ao alocar pedido."),
  });
}
