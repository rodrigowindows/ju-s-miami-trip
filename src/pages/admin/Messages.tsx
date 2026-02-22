import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useWhatsAppTemplates,
  useOrdersForMessages,
  fillTemplate,
} from "@/hooks/useMessages";
import type { WhatsAppTemplate, Order } from "@/integrations/supabase/types";

const Messages = () => {
  const { data: templates, isLoading: templatesLoading } =
    useWhatsAppTemplates();
  const { data: orders, isLoading: ordersLoading } = useOrdersForMessages();

  const [selectedTemplate, setSelectedTemplate] =
    useState<WhatsAppTemplate | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [open, setOpen] = useState(false);

  const selectedOrder = orders?.find((o) => o.id === selectedOrderId);

  const filledMessage =
    selectedTemplate && selectedOrder
      ? fillTemplate(selectedTemplate.template_text, selectedOrder)
      : selectedTemplate?.template_text ?? "";

  const handleOpenTemplate = (template: WhatsAppTemplate) => {
    setSelectedTemplate(template);
    setSelectedOrderId("");
    setOpen(true);
  };

  const handleSendWhatsApp = () => {
    if (!selectedOrder) return;
    const phone = selectedOrder.customer_phone.replace(/\D/g, "");
    const encoded = encodeURIComponent(filledMessage);
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  const isLoading = templatesLoading || ordersLoading;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Mensagens</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Templates de mensagens WhatsApp para comunicacao com clientes
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-32 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates?.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleOpenTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{template.icon}</span>
                  <CardTitle className="font-body text-base">
                    {template.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-3 font-mono">
                  {template.template_text}
                </p>
              </CardContent>
            </Card>
          ))}

          {templates?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Nenhum template de mensagem encontrado.
            </div>
          )}
        </div>
      )}

      {/* Template detail + send modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTemplate && (
                <>
                  <span className="text-xl">{selectedTemplate.icon}</span>
                  {selectedTemplate.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Selecione um pedido para preencher a mensagem automaticamente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Order selector */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Pedido</label>
              <Select
                value={selectedOrderId}
                onValueChange={setSelectedOrderId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um pedido..." />
                </SelectTrigger>
                <SelectContent>
                  {orders?.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.order_number} - {order.customer_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message preview */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Preview da mensagem
              </label>
              <div className="bg-muted/50 border rounded-lg p-4 text-sm whitespace-pre-wrap min-h-[120px]">
                {filledMessage || (
                  <span className="text-muted-foreground italic">
                    Selecione um pedido para visualizar
                  </span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
            <Button
              onClick={handleSendWhatsApp}
              disabled={!selectedOrder}
              className="gap-2 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white"
            >
              <MessageSquare size={16} />
              Enviar no WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
