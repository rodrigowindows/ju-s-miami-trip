import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Referral } from "@/types";

export function useReferrals() {
  return useQuery<Referral[]>({
    queryKey: ["referrals"],
    queryFn: async () => {
      const { data, error } = await supabase.from("referrals").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Referral[];
    },
  });
}

export function useMyReferrals(userId: string) {
  return useQuery<Referral[]>({
    queryKey: ["referrals", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("referrals").select("*").eq("referrer_id", userId).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Referral[];
    },
    enabled: !!userId,
  });
}
