import { useState } from "react";
import { MessageSquare, Plus, Pencil, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  fillTemplate,
  TEMPLATE_STATUS_MAP,
  TEMPLATE_VARIABLES,
} from "@/hooks/useMessages";
import { useToast } from "@/hooks/use-toast";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import type { WhatsAppTemplate } from "@/types";

const EMPTY_FORM = { slug: "", title: "", icon: "📝", template_text: "" };

const Messages = () => {
  const { data: templates, isLoading: templatesLoading } = useWhatsAppTemplates();
  const { toast } = useToast();

  // Send tab state
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [sendOpen, setSendOpen] = useState(false);

  // Order filter derived from selected template slug
  const statusFilter = selectedTemplate
    ? TEMPLATE_STATUS_MAP[selectedTemplate.slug] ?? undefined
    : undefined;
  const { data: orders, isLoading: ordersLoading } = useOrdersForMessages(statusFilter);

  // CRUD state
  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  // ── Send handlers ────────────────────────────

  const selectedOrder = orders?.find((o) => o.id === selectedOrderId);

  const filledMessage =
    selectedTemplate && selectedOrder
      ? fillTemplate(selectedTemplate.template_text, selectedOrder)
      : selectedTemplate?.template_text ?? "";

  const handleOpenSend = (template: WhatsAppTemplate) => {
    setSelectedTemplate(template);
    setSelectedOrderId("");
    setSendOpen(true);
  };

  const handleSendWhatsApp = () => {
    if (!selectedOrder) return;
    const phone = (selectedOrder.client?.phone ?? "").replace(/\D/g, "");
    if (!phone) {
      toast({ title: "Cliente sem telefone cadastrado", variant: "destructive" });
      return;
    }
    const encoded = encodeURIComponent(filledMessage);
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(filledMessage);
    toast({ title: "Mensagem copiada!" });
  };

  // ── CRUD handlers ───────────────────────────

  const openCreateForm = () => {
    setEditingTemplate(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEditForm = (t: WhatsAppTemplate) => {
    setEditingTemplate(t);
    setForm({ slug: t.slug, title: t.title, icon: t.icon, template_text: t.template_text });
    setFormOpen(true);
  };

  const handleSaveTemplate = async () => {
    if (!form.slug || !form.title || !form.template_text) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }
    try {
      if (editingTemplate) {
        await updateTemplate.mutateAsync({ id: editingTemplate.id, ...form });
        toast({ title: "Template atualizado!" });
      } else {
        await createTemplate.mutateAsync(form);
        toast({ title: "Template criado!" });
      }
      setFormOpen(false);
    } catch {
      toast({ title: "Erro ao salvar template", variant: "destructive" });
    }
  };

  const handleDeleteTemplate = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteTemplate.mutateAsync(deleteConfirmId);
      toast({ title: "Template excluído!" });
      setDeleteConfirmId(null);
    } catch {
      toast({ title: "Erro ao excluir template", variant: "destructive" });
    }
  };

  const isSaving = createTemplate.isPending || updateTemplate.isPending;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Mensagens</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Templates de mensagens WhatsApp para comunicação com clientes
        </p>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList>
          <TabsTrigger value="send">Enviar Mensagem</TabsTrigger>
          <TabsTrigger value="manage">Gerenciar Templates</TabsTrigger>
        </TabsList>

        {/* ── Send tab ──────────────────────────── */}
        <TabsContent value="send">
          {templatesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader><div className="h-5 w-32 bg-muted rounded" /></CardHeader>
                  <CardContent><div className="h-16 bg-muted rounded" /></CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates?.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleOpenSend(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{template.icon}</span>
                      <CardTitle className="text-base">{template.title}</CardTitle>
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
                <div className="col-span-full text-center py-12">
                  <MessageSquare size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Nenhum template de mensagem encontrado.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* ── Manage tab ────────────────────────── */}
        <TabsContent value="manage">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {templates?.length ?? 0} template(s) cadastrado(s)
            </p>
            <Button size="sm" className="gap-2" onClick={openCreateForm}>
              <Plus size={14} /> Novo Template
            </Button>
          </div>

          <div className="space-y-3">
            {templates?.map((t) => (
              <Card key={t.id}>
                <CardContent className="p-4 flex items-start gap-4">
                  <span className="text-2xl mt-0.5">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{t.title}</span>
                      <Badge variant="outline" className="text-[10px]">{t.slug}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono line-clamp-2">
                      {t.template_text}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditForm(t)}>
                      <Pencil size={14} />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeleteConfirmId(t.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {templates?.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Nenhum template cadastrado.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Send dialog ─────────────────────────── */}
      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTemplate && (
                <>
                  <span>{selectedTemplate.icon}</span>
                  {selectedTemplate.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Selecione um pedido para preencher a mensagem automaticamente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Pedido</Label>
              <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um pedido..." />
                </SelectTrigger>
                <SelectContent>
                  {ordersLoading ? (
                    <SelectItem value="_loading" disabled>Carregando...</SelectItem>
                  ) : (
                    orders?.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.order_number} - {order.client?.full_name ?? "Cliente"}
                        {order.status && (
                          <span className="ml-1 text-muted-foreground">
                            ({ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG]?.label ?? order.status})
                          </span>
                        )}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {statusFilter && (
                <p className="text-[11px] text-muted-foreground mt-1">
                  Mostrando pedidos com status relevante para este template
                </p>
              )}
            </div>

            <div>
              <Label className="mb-1.5 block">Preview da mensagem</Label>
              <div className="bg-muted/50 border rounded-lg p-4 text-sm whitespace-pre-wrap min-h-[120px]">
                {filledMessage || (
                  <span className="text-muted-foreground italic">Selecione um pedido para visualizar</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSendOpen(false)}>Fechar</Button>
            {selectedOrder && (
              <Button variant="outline" className="gap-2" onClick={handleCopyMessage}>
                <Copy size={14} /> Copiar
              </Button>
            )}
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

      {/* ── Create / Edit dialog ────────────────── */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Editar Template" : "Novo Template"}</DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Atualize os dados do template"
                : "Preencha os dados para criar um novo template"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-[3rem_1fr] gap-3">
              <div>
                <Label className="mb-1.5 block">Ícone</Label>
                <Input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="text-center text-lg"
                  maxLength={4}
                />
              </div>
              <div>
                <Label className="mb-1.5 block">Título *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Confirmação de Compra"
                />
              </div>
            </div>

            <div>
              <Label className="mb-1.5 block">Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_") })}
                placeholder="Ex: confirmacao"
                disabled={!!editingTemplate}
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Identificador único do template (sem espaços ou acentos)
              </p>
            </div>

            <div>
              <Label className="mb-1.5 block">Texto do Template *</Label>
              <Textarea
                value={form.template_text}
                onChange={(e) => setForm({ ...form, template_text: e.target.value })}
                placeholder="Olá {nome_cliente}, seu pedido {numero_pedido}..."
                rows={6}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {TEMPLATE_VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    className="text-[10px] px-2 py-0.5 rounded-full bg-muted border hover:bg-muted/80 font-mono transition-colors"
                    onClick={() => setForm({ ...form, template_text: form.template_text + v.key })}
                  >
                    {v.key}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveTemplate} disabled={isSaving}>
              {isSaving ? "Salvando..." : editingTemplate ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation dialog ──────────── */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Template</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteTemplate} disabled={deleteTemplate.isPending}>
              {deleteTemplate.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
