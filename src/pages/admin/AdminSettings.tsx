import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { PageSkeleton } from '@/components/shared/LoadingSkeleton';
import ProhibitedItemsList from '@/components/admin/ProhibitedItemsList';
import { useSettings, useSaveSettings } from '@/hooks/useSettings';

export default function AdminSettings() {
  const { data: settings, isLoading } = useSettings();
  const saveSettings = useSaveSettings();

  const [form, setForm] = useState({
    exchange_rate: '',
    spread_percent: '',
    whatsapp_number: '',
    referral_credit: '',
  });

  useEffect(() => {
    if (settings) {
      setForm({
        exchange_rate: settings.exchange_rate,
        spread_percent: settings.spread_percent,
        whatsapp_number: settings.whatsapp_number,
        referral_credit: settings.referral_credit,
      });
    }
  }, [settings]);

  const handleSave = () => {
    saveSettings.mutate(form);
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Configurações' }]} />

      <h1 className="font-display text-2xl font-bold mb-6">Configurações</h1>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Câmbio e Preços</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="exchange_rate">Câmbio USD/BRL atual</Label>
              <Input
                id="exchange_rate"
                type="number"
                step="0.01"
                value={form.exchange_rate}
                onChange={(e) => setForm({ ...form, exchange_rate: e.target.value })}
                placeholder="5.70"
              />
              <p className="text-xs text-muted-foreground mt-1">Usado nos cálculos de orçamento</p>
            </div>
            <div>
              <Label htmlFor="spread_percent">Spread padrão (%)</Label>
              <Input
                id="spread_percent"
                type="number"
                step="0.5"
                value={form.spread_percent}
                onChange={(e) => setForm({ ...form, spread_percent: e.target.value })}
                placeholder="3"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comunicação</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="whatsapp">Telefone WhatsApp do operador</Label>
              <Input
                id="whatsapp"
                value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                placeholder="5561999999999"
              />
              <p className="text-xs text-muted-foreground mt-1">Usado nos links wa.me para clientes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Programa de Indicação</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="referral_credit">Valor do crédito por indicação (R$)</Label>
              <Input
                id="referral_credit"
                type="number"
                step="1"
                value={form.referral_credit}
                onChange={(e) => setForm({ ...form, referral_credit: e.target.value })}
                placeholder="30"
              />
            </div>
          </CardContent>
        </Card>

        <ProhibitedItemsList />

        <Button onClick={handleSave} disabled={saveSettings.isPending} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {saveSettings.isPending ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
}
