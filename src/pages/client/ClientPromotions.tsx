import { Copy, Check, Gift, Users } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/shared/EmptyState';
import { CardSkeleton } from '@/components/shared/LoadingSkeleton';
import { useActivePromotions } from '@/hooks/usePromotions';
import { useAuth } from '@/contexts/AuthContext';
import { useMyReferrals } from '@/hooks/useReferrals';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Código copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
      {copied ? 'Copiado!' : 'Copiar'}
    </Button>
  );
}

export default function ClientPromotions() {
  const { data: promotions, isLoading } = useActivePromotions();
  const { user, profile } = useAuth();
  const { data: referrals } = useMyReferrals(user?.id ?? '');

  const completedReferrals = referrals?.filter((r) => r.status === 'completed') ?? [];
  const totalCredits = completedReferrals.reduce((sum, r) => sum + r.credit_amount, 0);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Ofertas Especiais
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : !promotions?.length ? (
          <EmptyState
            icon="promotions"
            title="Nenhuma oferta disponível"
            description="Fique de olho! Novas promoções podem aparecer a qualquer momento."
          />
        ) : (
          <div className="space-y-3">
            {promotions.map((p) => (
              <Card key={p.id} className="overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary to-miami-orange" />
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {p.discount_type === 'percent'
                          ? `${p.discount_value}% OFF`
                          : `R$ ${p.discount_value.toFixed(2)} OFF`}
                      </p>
                    </div>
                    <CopyButton text={p.coupon_code} />
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <code className="text-sm bg-primary/5 border border-primary/20 text-primary px-3 py-1 rounded font-mono font-bold">
                      {p.coupon_code}
                    </code>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    {p.min_order_value && <span>Pedido mín: R$ {p.min_order_value.toFixed(2)}</span>}
                    <span>
                      Válido até {format(new Date(p.expires_at), "dd 'de' MMM", { locale: ptBR })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-secondary" />
          Indique e Ganhe
        </h2>

        <Card className="bg-gradient-to-br from-secondary/5 to-miami-blue/10 border-secondary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Seu código de indicação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <code className="flex-1 text-center text-lg bg-white border-2 border-dashed border-secondary/30 text-secondary px-4 py-3 rounded-lg font-mono font-bold">
                {profile?.referral_code ?? 'Carregando...'}
              </code>
              {profile?.referral_code && <CopyButton text={profile.referral_code} />}
            </div>

            <p className="text-sm text-muted-foreground">
              Compartilhe seu código com amigos. Quando eles fizerem o primeiro pedido, vocês dois ganham créditos!
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white p-3 text-center">
                <p className="text-2xl font-bold text-secondary">{referrals?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Amigos indicados</p>
              </div>
              <div className="rounded-lg bg-white p-3 text-center">
                <p className="text-2xl font-bold text-emerald-600">R$ {totalCredits.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Créditos ganhos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
