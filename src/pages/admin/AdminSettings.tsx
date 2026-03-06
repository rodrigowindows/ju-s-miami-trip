import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Settings } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Settings as SettingsIcon } from "lucide-react";

const SETTING_LABELS: Record<string, { label: string; description: string; type: string }> = {
  exchange_rate_usd_brl: { label: "Câmbio USD → BRL", description: "Taxa de câmbio do dólar para o real", type: "number" },
  spread_percentage: { label: "Spread (%)", description: "Margem de lucro sobre o câmbio", type: "number" },
  whatsapp_phone: { label: "Telefone WhatsApp", description: "Número do operador para links wa.me (ex: 5561999999999)", type: "text" },
  pix_key: { label: "Chave PIX", description: "Chave PIX para receber pagamentos (CPF, e-mail, telefone ou aleatória)", type: "text" },
  pix_key_holder: { label: "Titular da Chave PIX", description: "Nome do titular da conta PIX", type: "text" },
  pix_qr_image: { label: "QR Code PIX (URL da imagem)", description: "URL da imagem do QR Code PIX para exibir no checkout (cole o link da imagem)", type: "text" },
  prohibited_items: { label: "Itens Proibidos", description: "Lista de itens que não podem ser trazidos (um por linha)", type: "textarea" },
};

const DEFAULT_SETTINGS: Record<string, string> = {
  exchange_rate_usd_brl: "5.80",
  spread_percentage: "45",
  whatsapp_phone: "5561999999999",
  pix_key: "",
  pix_key_holder: "",
  pix_qr_image: "",
  prohibited_items: "Armas\nDrogas\nMedicamentos controlados\nAlimentos perecíveis\nAnimais vivos",
};

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from("settings").select("*");
      const map: Record<string, string> = {};
      for (const row of (data ?? []) as Settings[]) {
        map[row.key] = row.value;
      }
      // Fill defaults for missing keys
      for (const [key, defaultVal] of Object.entries(DEFAULT_SETTINGS)) {
        if (!(key in map)) map[key] = defaultVal;
      }
      setSettings(map);
      setLoading(false);
    }
    fetch();
  }, []);

  async function handleSave() {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase
        .from("settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    }
    toast({ title: "Configurações salvas!" });
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Configurações</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ajuste câmbio, spread e preferências do sistema
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
          Salvar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <SettingsIcon size={20} />
            Parâmetros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(SETTING_LABELS).map(([key, cfg]) => (
            <div key={key} className="space-y-2">
              <Label>{cfg.label}</Label>
              <p className="text-xs text-muted-foreground">{cfg.description}</p>
              {cfg.type === "textarea" ? (
                <Textarea
                  value={settings[key] ?? ""}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  rows={5}
                />
              ) : (
                <Input
                  type={cfg.type}
                  step={cfg.type === "number" ? "0.01" : undefined}
                  value={settings[key] ?? ""}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
