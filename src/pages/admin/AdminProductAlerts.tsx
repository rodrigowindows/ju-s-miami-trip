import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AlertRow = {
  id: string;
  user_email: string;
  whatsapp: string | null;
  product_id: string;
  product_name?: string;
  created_at: string;
  notified_at: string | null;
};

export default function AdminProductAlerts() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);

  async function load() {
    const { data } = await supabase.from("product_alerts")
      .select("*, catalog_products(name)")
      .order("created_at", { ascending: false });

    const mapped = (data ?? []).map((a: any) => ({
      ...a,
      product_name: a.catalog_products?.name ?? a.product_id,
    }));
    setAlerts(mapped);
  }

  async function markNotified(id: string) {
    await (supabase as any).from("product_alerts").update({ notified_at: new Date().toISOString() }).eq("id", id);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Alertas de produtos</h1>
      {alerts.length === 0 && <p className="text-gray-500 text-sm">Nenhum alerta cadastrado.</p>}
      {alerts.map((a) => (
        <Card key={a.id}>
          <CardContent className="pt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{a.user_email}</p>
              <p className="text-xs text-gray-700 font-medium">Produto: {a.product_name}</p>
              {a.whatsapp && <p className="text-xs text-gray-500">WhatsApp: {a.whatsapp}</p>}
              <p className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString("pt-BR")}</p>
            </div>
            <Button variant="outline" disabled={!!a.notified_at} onClick={() => markNotified(a.id)}>
              {a.notified_at ? "Notificado" : "Marcar como notificado"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
