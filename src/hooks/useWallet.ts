import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { WalletTransaction } from "@/lib/types";
import { toast } from "sonner";

export function useWalletTransactions(clientId: string) {
  return useQuery<WalletTransaction[]>({
    queryKey: ["wallet", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as WalletTransaction[];
    },
    enabled: !!clientId,
  });
}

export function useAdjustWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ clientId, amount, description }: { clientId: string; amount: number; description: string }) => {
      const { error: txError } = await supabase.from("wallet_transactions").insert({
        client_id: clientId,
        type: "admin_adjust",
        amount,
        description,
      });
      if (txError) throw txError;

      const { data: profile, error: fetchErr } = await supabase.from("profiles").select("wallet_balance").eq("id", clientId).single();
      if (fetchErr) throw fetchErr;

      const newBalance = (Number((profile as { wallet_balance: number }).wallet_balance) || 0) + amount;
      const { error: upErr } = await supabase.from("profiles").update({ wallet_balance: newBalance }).eq("id", clientId);
      if (upErr) throw upErr;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["wallet", vars.clientId] });
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["client", vars.clientId] });
      toast.success("Wallet ajustada!");
    },
    onError: () => toast.error("Erro ao ajustar wallet."),
  });
}
