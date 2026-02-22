import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TripWithAllocated, Order } from "@/types";

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: async (): Promise<TripWithAllocated[]> => {
      const { data: trips, error } = await supabase
        .from("trips")
        .select("*")
        .order("departure_date", { ascending: false });

      if (error) throw error;

      const { data: orders } = await supabase
        .from("orders")
        .select("trip_id, estimated_weight_kg")
        .not("trip_id", "is", null);

      return (trips ?? []).map((trip) => {
        const tripOrders = (orders ?? []).filter((o: { trip_id: string | null }) => o.trip_id === trip.id);
        return {
          ...trip,
          allocated_weight_kg: tripOrders.reduce(
            (sum: number, o: { estimated_weight_kg: number | null }) => sum + (o.estimated_weight_kg ?? 0),
            0
          ),
          allocated_items_count: tripOrders.length,
        };
      }) as TripWithAllocated[];
    },
  });
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ["trips", id],
    queryFn: async () => {
      const { data: trip, error } = await supabase
        .from("trips")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("trip_id", id);

      // Get client names for each order
      const clientIds = [...new Set((orders ?? []).map((o: Order) => o.client_id))];
      let profileMap = new Map<string, string | null>();

      if (clientIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", clientIds);

        profileMap = new Map((profiles ?? []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name]));
      }

      const allocated_weight_kg = (orders ?? []).reduce(
        (sum: number, o: Order) => sum + (o.estimated_weight_kg ?? 0),
        0
      );

      const ordersWithClient = (orders ?? []).map((o: Order) => ({
        ...o,
        client_name: profileMap.get(o.client_id) ?? null,
      }));

      return {
        trip: {
          ...trip,
          allocated_weight_kg,
          allocated_items_count: (orders ?? []).length,
        } as TripWithAllocated,
        orders: ordersWithClient as (Order & { client_name: string | null })[],
      };
    },
    enabled: !!id,
  });
}

export function useUnassignedOrders() {
  return useQuery({
    queryKey: ["orders", "unassigned"],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .is("trip_id", null)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const clientIds = [...new Set((orders ?? []).map((o: Order) => o.client_id))];
      let profileMap = new Map<string, string | null>();

      if (clientIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", clientIds);

        profileMap = new Map((profiles ?? []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name]));
      }

      return (orders ?? []).map((o: Order) => ({
        ...o,
        client_name: profileMap.get(o.client_id) ?? null,
      })) as (Order & { client_name: string | null })[];
    },
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trip: {
      code: string;
      traveler_name: string;
      flight_number: string;
      departure_date: string;
      arrival_date: string;
      max_weight_kg: number;
    }) => {
      const { data, error } = await supabase
        .from("trips")
        .insert(trip)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      code?: string;
      traveler_name?: string;
      flight_number?: string;
      departure_date?: string;
      arrival_date?: string;
      max_weight_kg?: number;
    }) => {
      const { data, error } = await supabase
        .from("trips")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["trips", vars.id] });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("trips").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}

export function useAllocateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      tripId,
    }: {
      orderId: string;
      tripId: string;
    }) => {
      const { error } = await supabase
        .from("orders")
        .update({ trip_id: tripId })
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["trips", vars.tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "unassigned"] });
    },
  });
}
