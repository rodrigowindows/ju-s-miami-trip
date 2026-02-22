import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { Promotion } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Tag, Copy, Gift, Users } from "lucide-react";

export default function Promos() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [referralCount, setReferralCount] = useState(0);
  const [referralCredits, setReferralCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data: promosData } = await supabase
        .from("promotions")
        .select("*")
        .eq("active", true)
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      setPromos((promosData as Promotion[]) ?? []);

      if (user) {
        const { data: referrals } = await supabase
          .from("referrals")
          .select("*")
          .eq("referrer_id", user.id);

        if (referrals) {
          setReferralCount(referrals.length);
          setReferralCredits(
            referrals.reduce(
              (sum: number, r: { credit_amount: number; status: string }) =>
                r.status === "completed" ? sum + r.credit_amount : sum,
              0
            )
          );
        }
      }

      setLoading(false);
    }
    fetch();
  }, [user]);

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast({ title: "Código copiado!", description: code });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border px-4 pt-3 pb-3">
        <h1 className="font-display text-xl font-bold text-foreground">Promoções</h1>
        <p className="text-xs text-muted-foreground">Ofertas especiais e programa de indicação</p>
      </header>

      <main className="px-4 pt-4 pb-24 space-y-6">
        {/* Referral section */}
        {profile?.referral_code && (
          <section className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Gift size={20} />
              <h2 className="font-display text-lg font-bold">Indique e Ganhe</h2>
            </div>
            <p className="text-sm text-white/80 mb-4">
              Compartilhe seu código e ganhe créditos quando seus amigos fizerem o primeiro pedido!
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between mb-4">
              <span className="font-mono font-bold text-lg">{profile.referral_code}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 gap-1"
                onClick={() => copyCode(profile.referral_code!)}
              >
                <Copy size={14} />
                Copiar
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users size={14} />
                  <span className="text-xs">Amigos indicados</span>
                </div>
                <p className="text-2xl font-bold">{referralCount}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Tag size={14} />
                  <span className="text-xs">Créditos ganhos</span>
                </div>
                <p className="text-2xl font-bold">R$ {referralCredits.toFixed(0)}</p>
              </div>
            </div>
          </section>
        )}

        {/* Active promotions */}
        <section>
          <h2 className="font-display text-lg font-bold text-foreground mb-3">Cupons Disponíveis</h2>
          {promos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                <Tag size={28} className="text-violet-600" />
              </div>
              <p className="text-sm text-muted-foreground">Nenhuma promoção ativa no momento.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {promos.map((promo) => (
                <div key={promo.id} className="bg-white rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm">{promo.name}</h3>
                      <p className="text-sm text-violet-600 font-bold mt-1">
                        {promo.discount_type === "percent"
                          ? `${promo.discount_value}% OFF`
                          : `R$ ${promo.discount_value.toFixed(2)} OFF`}
                      </p>
                      {promo.min_order_value && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Pedido mínimo: R$ {promo.min_order_value.toFixed(2)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Válido até {new Date(promo.expires_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className="font-mono text-xs">{promo.coupon_code}</Badge>
                      <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => copyCode(promo.coupon_code)}>
                        <Copy size={12} /> Copiar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
