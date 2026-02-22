import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProhibitedItemsList from "@/components/admin/ProhibitedItemsList";
import { useSettings, useSaveSettings } from "@/hooks/useSettings";
import { PageSkeleton } from "@/components/shared/LoadingSkeleton";

export default function AdminSettings() {
  const { data: settings, isLoading } = useSettings();
  const saveSettings = useSaveSettings();

  const [form, setForm] = useState({ exchange_rate: "", spread_percent: "", whatsapp_number: "", referral_credit: "" });

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSave = () => saveSettings.mutate(form);

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Configurações</h1>

      <Card>
        <CardHeader><CardTitle>Câmbio e Spread</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Taxa de Câmbio (USD/BRL)</Label><Input type="number" step="0.01" value={form.exchange_rate} onChange={(e) => setForm({ ...form, exchange_rate: e.target.value })} /></div>
            <div><Label>Spread (%)</Label><Input type="number" step="0.5" value={form.spread_percent} onChange={(e) => setForm({ ...form, spread_percent: e.target.value })} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>WhatsApp</CardTitle></CardHeader>
        <CardContent>
          <div><Label>Número do Operador</Label><Input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} placeholder="5561999999999" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Programa de Indicação</CardTitle></CardHeader>
        <CardContent>
          <div><Label>Crédito por Indicação (R$)</Label><Input type="number" value={form.referral_credit} onChange={(e) => setForm({ ...form, referral_credit: e.target.value })} /></div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saveSettings.isPending} className="w-full">
        <Save className="h-4 w-4 mr-2" />{saveSettings.isPending ? "Salvando..." : "Salvar Configurações"}
      </Button>

      <Separator />

      <ProhibitedItemsList />
    </div>
  );
}
