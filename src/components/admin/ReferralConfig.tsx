import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { useReferrals } from '@/hooks/useReferrals';
import { useSettings, useSaveSettings } from '@/hooks/useSettings';
import { CardSkeleton } from '@/components/shared/LoadingSkeleton';
import { Gift, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function ReferralConfig() {
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: referrals, isLoading: referralsLoading } = useReferrals();
  const saveSettings = useSaveSettings();
  const [creditValue, setCreditValue] = useState('30');

  useEffect(() => {
    if (settings?.referral_credit) setCreditValue(settings.referral_credit);
  }, [settings]);

  const handleSave = () => {
    saveSettings.mutate({ referral_credit: creditValue });
  };

  if (settingsLoading) return <CardSkeleton />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gift className="h-5 w-5 text-primary" />
            Programa de Indicação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label htmlFor="referral-credit">Valor do crédito por indicação (R$)</Label>
              <Input
                id="referral-credit"
                type="number"
                value={creditValue}
                onChange={(e) => setCreditValue(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleSave} disabled={saveSettings.isPending}>
              <Save className="h-4 w-4 mr-1" />
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {referralsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : !referrals?.length ? (
            <EmptyState
              icon="clients"
              title="Nenhuma indicação ainda"
              description="Quando clientes indicarem amigos, as indicações aparecerão aqui."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quem indicou</TableHead>
                    <TableHead>Indicado</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Crédito</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-sm">{r.referrer_id.slice(0, 8)}...</TableCell>
                      <TableCell className="text-sm">{r.referred_id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{r.referral_code}</code>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="font-medium">R$ {r.credit_amount.toFixed(2)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(r.created_at), 'dd/MM/yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
