import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmptyState from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { useWhatsAppTemplates, useOrdersForMessages, fillTemplate, type WhatsAppTemplate } from "@/hooks/useMessages";
import { useSettings } from "@/hooks/useSettings";

export default function AdminMessages() {
  const { data: templates, isLoading } = useWhatsAppTemplates();
  const { data: orders } = useOrdersForMessages();
  const { data: settings } = useSettings();
  const whatsappNumber = settings?.whatsapp_number ?? "5561999999999";

  const [selected, setSelected] = useState<WhatsAppTemplate | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const selectedOrder = (orders ?? []).find((o) => o.id === selectedOrderId);

  const preview = selected && selectedOrder ? fillTemplate(selected.template, selectedOrder) : selected?.template ?? "";

  const handleSend = () => {
    if (!selectedOrder) return;
    const phone = selectedOrder.customer_phone?.replace(/\D/g, "") ?? whatsappNumber;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(preview)}`;
    window.open(url, "_blank");
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Mensagens WhatsApp</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
      ) : (templates ?? []).length === 0 ? (
        <EmptyState icon="orders" title="Nenhum template" description="Templates serão carregados via seed no banco de dados." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(templates ?? []).map((t) => (
            <Card key={t.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelected(t); setSelectedOrderId(""); }}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><MessageSquare className="h-5 w-5" /></div>
                  <CardTitle className="text-base">{t.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{t.template}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Selecionar Pedido</p>
              <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                <SelectTrigger><SelectValue placeholder="Escolha um pedido..." /></SelectTrigger>
                <SelectContent>
                  {(orders ?? []).map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.order_number} — {o.customer_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Preview</p>
              <div className="bg-emerald-50 rounded-lg p-4 text-sm whitespace-pre-wrap">{preview || "Selecione um pedido para ver o preview."}</div>
            </div>
            <Button onClick={handleSend} disabled={!selectedOrder} className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Send className="h-4 w-4 mr-2" /> Enviar no WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
