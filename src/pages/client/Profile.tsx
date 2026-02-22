import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { WalletTransaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, LogOut, Wallet, MapPin, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    if (!user) return;
    async function fetch() {
      const { data } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("client_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setTransactions((data as WalletTransaction[]) ?? []);
    }
    fetch();
  }, [user]);

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  function copyReferral() {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      toast({ title: "Código copiado!", description: profile.referral_code });
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border px-4 pt-3 pb-3">
        <h1 className="font-display text-xl font-bold text-foreground">Perfil</h1>
      </header>

      <main className="px-4 pt-6 pb-24 space-y-6">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mb-3">
            <User size={32} className="text-violet-600" />
          </div>
          <h2 className="font-display text-lg font-bold text-foreground">
            {profile?.full_name || "Usuário"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {profile?.role === "cliente" ? "Cliente" : profile?.role}
          </p>
        </div>

        {/* Wallet Balance */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={20} />
            <span className="text-sm font-medium">Saldo Wallet</span>
          </div>
          <p className="text-3xl font-bold">
            R$ {(profile?.wallet_balance ?? 0).toFixed(2).replace(".", ",")}
          </p>
        </div>

        {/* Info Cards */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Mail size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">{user?.email || "—"}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <Phone size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Telefone</p>
              <p className="text-sm font-medium text-foreground">{profile?.phone || "Não informado"}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Endereço</p>
              <p className="text-sm font-medium text-foreground">{profile?.address || "Não informado"}</p>
            </div>
          </div>

          {profile?.referral_code && (
            <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
                <Copy size={18} className="text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Código Referral</p>
                <p className="text-sm font-mono font-bold text-foreground">{profile.referral_code}</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={copyReferral}>
                <Copy size={12} /> Copiar
              </Button>
            </div>
          )}
        </div>

        {/* Wallet History */}
        {transactions.length > 0 && (
          <div>
            <h3 className="font-display text-sm font-bold text-foreground mb-3">Histórico Wallet</h3>
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-white rounded-xl border border-border p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{tx.description ?? tx.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Badge className={tx.type === "order_debit" ? "bg-red-100 text-red-700 border-0" : "bg-green-100 text-green-700 border-0"}>
                    {tx.type === "order_debit" ? "-" : "+"}R$ {tx.amount.toFixed(2)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sign Out */}
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full rounded-full gap-2 text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut size={16} />
          Sair da conta
        </Button>
      </main>
    </div>
  );
}
