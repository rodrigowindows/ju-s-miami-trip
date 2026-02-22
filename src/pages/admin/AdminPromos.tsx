import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Promotion } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Tag, Pencil, Trash2 } from "lucide-react";

export default function AdminPromos() {
  const { toast } = useToast();
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [form, setForm] = useState({
    name: "",
    coupon_code: "",
    discount_type: "percent" as "percent" | "fixed",
    discount_value: "",
    min_order_value: "",
    starts_at: "",
    expires_at: "",
    max_uses: "",
    active: true,
  });

  async function fetchPromos() {
    const { data } = await supabase
      .from("promotions")
      .select("*")
      .order("created_at", { ascending: false });
    setPromos((data as Promotion[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchPromos();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", coupon_code: "", discount_type: "percent", discount_value: "", min_order_value: "", starts_at: "", expires_at: "", max_uses: "", active: true });
    setOpen(true);
  }

  function openEdit(promo: Promotion) {
    setEditing(promo);
    setForm({
      name: promo.name,
      coupon_code: promo.coupon_code,
      discount_type: promo.discount_type as "percent" | "fixed",
      discount_value: String(promo.discount_value),
      min_order_value: promo.min_order_value ? String(promo.min_order_value) : "",
      starts_at: promo.starts_at?.split("T")[0] ?? "",
      expires_at: promo.expires_at?.split("T")[0] ?? "",
      max_uses: promo.max_uses ? String(promo.max_uses) : "",
      active: promo.active,
    });
    setOpen(true);
  }

  async function handleSave() {
    const payload = {
      name: form.name,
      coupon_code: form.coupon_code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_order_value: form.min_order_value ? Number(form.min_order_value) : null,
      starts_at: form.starts_at || new Date().toISOString(),
      expires_at: form.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      active: form.active,
    };

    if (editing) {
      const { error } = await supabase.from("promotions").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Promoção atualizada!" });
    } else {
      const { error } = await supabase.from("promotions").insert(payload);
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Promoção criada!" });
    }
    setOpen(false);
    fetchPromos();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("promotions").delete().eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Promoção excluída!" });
    fetchPromos();
  }

  async function toggleActive(promo: Promotion) {
    await supabase.from("promotions").update({ active: !promo.active }).eq("id", promo.id);
    fetchPromos();
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Promoções</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie cupons e promoções</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={16} />
          Nova Promoção
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : promos.length === 0 ? (
        <div className="text-center py-20">
          <Tag size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Nenhuma promoção cadastrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map((promo) => (
            <Card key={promo.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">{promo.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(promo)}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(promo.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono">{promo.coupon_code}</Badge>
                  <Badge className={promo.active ? "bg-green-100 text-green-700 border-0" : "bg-red-100 text-red-700 border-0"}>
                    {promo.active ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
                <p className="text-sm">
                  {promo.discount_type === "percent" ? `${promo.discount_value}% de desconto` : `R$ ${promo.discount_value.toFixed(2)} de desconto`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Usos: {promo.current_uses}{promo.max_uses ? ` / ${promo.max_uses}` : ""}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Ativa:</span>
                  <Switch checked={promo.active} onCheckedChange={() => toggleActive(promo)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Promoção" : "Nova Promoção"}</DialogTitle>
            <DialogDescription>Preencha os dados da promoção</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Código do cupom</Label>
                <Input value={form.coupon_code} onChange={(e) => setForm({ ...form, coupon_code: e.target.value })} className="font-mono uppercase" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de desconto</Label>
                <Select value={form.discount_type} onValueChange={(v) => setForm({ ...form, discount_type: v as "percent" | "fixed" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Porcentagem (%)</SelectItem>
                    <SelectItem value="fixed">Valor fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valor do desconto</Label>
                <Input type="number" step="0.01" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data início</Label>
                <Input type="date" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
              </div>
              <div>
                <Label>Data fim</Label>
                <Input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Valor mínimo do pedido (R$)</Label>
                <Input type="number" step="0.01" value={form.min_order_value} onChange={(e) => setForm({ ...form, min_order_value: e.target.value })} />
              </div>
              <div>
                <Label>Máximo de usos</Label>
                <Input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} placeholder="Ilimitado" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.coupon_code || !form.discount_value}>
              {editing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
