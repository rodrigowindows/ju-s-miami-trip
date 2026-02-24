import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AlertRow = {
  id: string;
  user_email: string;
  whatsapp: string | null;
  product_id: string;
  created_at: string;
  notified_at: string | null;
};

export default function AdminProductAlerts() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);

  async function load() {
    const { data } = await supabase.from("product_alerts").select("*").order("created_at", { ascending: false });
    setAlerts((data as AlertRow[]) ?? []);
  }

  async function markNotified(id: string) {
    await supabase.from("product_alerts").update({ notified_at: new Date().toISOString() }).eq("id", id);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Alertas de produtos</h1>
      {alerts.map((a) => (
        <Card key={a.id}>
          <CardContent className="pt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{a.user_email}</p>
              <p className="text-xs text-gray-500">Produto: {a.product_id}</p>
              {a.whatsapp && <p className="text-xs text-gray-500">WhatsApp: {a.whatsapp}</p>}
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
