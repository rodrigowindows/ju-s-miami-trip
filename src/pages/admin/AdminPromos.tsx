import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Promotion } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Loader2, Tag, Pencil, Trash2, Flame, Zap, Timer, Percent,
  ToggleLeft, ToggleRight,
} from "lucide-react";

/* ─── Deals types & hooks ─── */

type Deal = {
  id: string;
  product_id: string;
  discount_percent: number;
  deal_type: string;
  starts_at: string;
  ends_at: string;
  claimed_count: number;
  max_claims: number | null;
  active: boolean;
  created_at: string;
  catalog_products: {
    id: string;
    name: string;
    brand: string;
    image_url: string;
    price_usd: number;
    category: string;
  } | null;
};

type Product = {
  id: string;
  name: string;
  brand: string;
  image_url: string;
  price_usd: number;
  category: string;
};

function useDeals() {
  return useQuery({
    queryKey: ["admin_deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_deals")
        .select("*, catalog_products(id, name, brand, image_url, price_usd, category)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Deal[];
    },
  });
}

function useProducts() {
  return useQuery({
    queryKey: ["admin_catalog_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalog_products")
        .select("id, name, brand, image_url, price_usd, category")
        .eq("active", true)
        .order("name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

const DEAL_TYPES = [
  { value: "deal_of_day", label: "Oferta do Dia", icon: Flame, color: "text-orange-600" },
  { value: "lightning", label: "Oferta Relampago", icon: Zap, color: "text-yellow-600" },
  { value: "clearance", label: "Liquidacao", icon: Tag, color: "text-red-600" },
];

function timeLeft(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Encerrado";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  return `${h}h ${m}m`;
}

/* ─── Main component ─── */

export default function AdminPromos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /* ── Cupons state ── */
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loadingPromos, setLoadingPromos] = useState(true);
  const [promoOpen, setPromoOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [promoForm, setPromoForm] = useState({
    name: "", coupon_code: "", discount_type: "percent" as "percent" | "fixed",
    discount_value: "", min_order_value: "", starts_at: "", expires_at: "",
    max_uses: "", active: true,
  });

  async function fetchPromos() {
    const { data } = await supabase.from("promotions").select("*").order("created_at", { ascending: false });
    setPromos((data as Promotion[]) ?? []);
    setLoadingPromos(false);
  }

  useEffect(() => { fetchPromos(); }, []);

  function openCreatePromo() {
    setEditing(null);
    setPromoForm({ name: "", coupon_code: "", discount_type: "percent", discount_value: "", min_order_value: "", starts_at: "", expires_at: "", max_uses: "", active: true });
    setPromoOpen(true);
  }

  function openEditPromo(promo: Promotion) {
    setEditing(promo);
    setPromoForm({
      name: promo.name, coupon_code: promo.coupon_code,
      discount_type: promo.discount_type as "percent" | "fixed",
      discount_value: String(promo.discount_value),
      min_order_value: promo.min_order_value ? String(promo.min_order_value) : "",
      starts_at: promo.starts_at?.split("T")[0] ?? "",
      expires_at: promo.expires_at?.split("T")[0] ?? "",
      max_uses: promo.max_uses ? String(promo.max_uses) : "",
      active: promo.active,
    });
    setPromoOpen(true);
  }

  async function handleSavePromo() {
    const payload = {
      name: promoForm.name, coupon_code: promoForm.coupon_code.toUpperCase(),
      discount_type: promoForm.discount_type, discount_value: Number(promoForm.discount_value),
      min_order_value: promoForm.min_order_value ? Number(promoForm.min_order_value) : null,
      starts_at: promoForm.starts_at || new Date().toISOString(),
      expires_at: promoForm.expires_at || new Date(Date.now() + 30 * 86400000).toISOString(),
      max_uses: promoForm.max_uses ? Number(promoForm.max_uses) : null, active: promoForm.active,
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
    setPromoOpen(false); fetchPromos();
  }

  async function handleDeletePromo(id: string) {
    const { error } = await supabase.from("promotions").delete().eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Promoção excluída!" }); fetchPromos();
  }

  async function toggleActivePromo(promo: Promotion) {
    await supabase.from("promotions").update({ active: !promo.active }).eq("id", promo.id);
    fetchPromos();
  }

  /* ── Ofertas state ── */
  const { data: deals, isLoading: loadingDeals } = useDeals();
  const { data: products } = useProducts();

  const [dealOpen, setDealOpen] = useState(false);
  const [dealForm, setDealForm] = useState({
    product_id: "",
    discount_percent: 20,
    deal_type: "deal_of_day",
    hours: 24,
    max_claims: 50,
  });

  const createDeal = useMutation({
    mutationFn: async () => {
      const endsAt = new Date();
      endsAt.setHours(endsAt.getHours() + dealForm.hours);
      const { error } = await supabase.from("product_deals").insert({
        product_id: dealForm.product_id,
        discount_percent: dealForm.discount_percent,
        deal_type: dealForm.deal_type,
        ends_at: endsAt.toISOString(),
        max_claims: dealForm.max_claims > 0 ? dealForm.max_claims : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_deals"] });
      toast({ title: "Oferta criada!" });
      setDealOpen(false);
      setDealForm({ product_id: "", discount_percent: 20, deal_type: "deal_of_day", hours: 24, max_claims: 50 });
    },
    onError: (e: Error) => {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    },
  });

  const toggleDeal = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("product_deals").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_deals"] });
    },
  });

  const deleteDeal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_deals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_deals"] });
      toast({ title: "Oferta removida" });
    },
  });

  /* ── Render ── */
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Promoções</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie cupons e ofertas do dia</p>
      </div>

      <Tabs defaultValue="cupons" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="cupons" className="gap-2">
            <Tag size={14} /> Cupons
          </TabsTrigger>
          <TabsTrigger value="ofertas" className="gap-2">
            <Flame size={14} /> Ofertas do Dia
          </TabsTrigger>
        </TabsList>

        {/* ════════════ TAB: CUPONS ════════════ */}
        <TabsContent value="cupons" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={openCreatePromo} className="gap-2">
              <Plus size={16} /> Novo Cupom
            </Button>
          </div>

          {loadingPromos ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : promos.length === 0 ? (
            <div className="text-center py-20">
              <Tag size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Nenhum cupom cadastrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promos.map((promo) => (
                <Card key={promo.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold">{promo.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditPromo(promo)}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeletePromo(promo.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono">{promo.coupon_code}</Badge>
                      <Badge variant={promo.active ? "default" : "destructive"}>
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
                      <Switch checked={promo.active} onCheckedChange={() => toggleActivePromo(promo)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ════════════ TAB: OFERTAS DO DIA ════════════ */}
        <TabsContent value="ofertas" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                <Flame size={20} />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">Ofertas do Dia</h2>
                <p className="text-sm text-muted-foreground">Crie ofertas com desconto % estilo Amazon</p>
              </div>
            </div>
            <Button onClick={() => setDealOpen(true)} className="gap-2">
              <Plus size={16} /> Nova Oferta
            </Button>
          </div>

          {loadingDeals ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (deals ?? []).length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <Flame size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Nenhuma oferta criada ainda.</p>
                <Button onClick={() => setDealOpen(true)} variant="outline" className="mt-3 gap-2">
                  <Plus size={14} /> Criar primeira oferta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(deals ?? []).map((deal) => {
                const p = deal.catalog_products;
                const isExpired = new Date(deal.ends_at) < new Date();
                const dealType = DEAL_TYPES.find((t) => t.value === deal.deal_type) ?? DEAL_TYPES[0];
                const DealIcon = dealType.icon;
                const claimedPct = deal.max_claims ? (deal.claimed_count / deal.max_claims) * 100 : 0;

                return (
                  <Card key={deal.id} className={`overflow-hidden ${!deal.active || isExpired ? "opacity-60" : ""}`}>
                    <div className={`px-3 py-2 flex items-center justify-between ${deal.active && !isExpired ? "bg-red-50" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-1.5">
                        <DealIcon size={14} className={dealType.color} />
                        <span className="text-xs font-semibold">{dealType.label}</span>
                      </div>
                      <Badge
                        className={
                          isExpired
                            ? "bg-gray-100 text-gray-600"
                            : deal.active
                            ? "bg-red-600 text-white hover:bg-red-600"
                            : "bg-gray-100 text-gray-600"
                        }
                      >
                        {isExpired ? "Encerrado" : deal.active ? `${deal.discount_percent}% OFF` : "Inativo"}
                      </Badge>
                    </div>

                    <CardContent className="pt-3 space-y-3">
                      {p && (
                        <div className="flex items-center gap-3">
                          <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-contain bg-gray-50" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-tight line-clamp-1">{p.name}</p>
                            <p className="text-[11px] text-muted-foreground">{p.brand} - US$ {p.price_usd.toFixed(2)}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Timer size={12} />
                          {isExpired ? "Encerrado" : timeLeft(deal.ends_at)}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Percent size={12} />
                          {deal.claimed_count}{deal.max_claims ? `/${deal.max_claims}` : ""} resgatados
                        </div>
                      </div>

                      {deal.max_claims && (
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${claimedPct}%` }} />
                        </div>
                      )}

                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="outline" size="sm" className="flex-1 gap-1.5 text-xs"
                          onClick={() => toggleDeal.mutate({ id: deal.id, active: !deal.active })}
                        >
                          {deal.active ? <ToggleRight size={14} className="text-emerald-600" /> : <ToggleLeft size={14} />}
                          {deal.active ? "Ativo" : "Inativo"}
                        </Button>
                        <Button
                          variant="outline" size="sm"
                          className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => deleteDeal.mutate(deal.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Dialog: Novo/Editar Cupom ── */}
      <Dialog open={promoOpen} onOpenChange={setPromoOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Cupom" : "Novo Cupom"}</DialogTitle>
            <DialogDescription>Preencha os dados do cupom</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Nome</Label><Input value={promoForm.name} onChange={(e) => setPromoForm({ ...promoForm, name: e.target.value })} /></div>
              <div><Label>Código do cupom</Label><Input value={promoForm.coupon_code} onChange={(e) => setPromoForm({ ...promoForm, coupon_code: e.target.value })} className="font-mono uppercase" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Tipo de desconto</Label>
                <Select value={promoForm.discount_type} onValueChange={(v) => setPromoForm({ ...promoForm, discount_type: v as "percent" | "fixed" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Porcentagem (%)</SelectItem>
                    <SelectItem value="fixed">Valor fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Valor do desconto</Label><Input type="number" value={promoForm.discount_value} onChange={(e) => setPromoForm({ ...promoForm, discount_value: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Data início</Label><Input type="date" value={promoForm.starts_at} onChange={(e) => setPromoForm({ ...promoForm, starts_at: e.target.value })} /></div>
              <div><Label>Data fim</Label><Input type="date" value={promoForm.expires_at} onChange={(e) => setPromoForm({ ...promoForm, expires_at: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Valor mínimo (R$)</Label><Input type="number" value={promoForm.min_order_value} onChange={(e) => setPromoForm({ ...promoForm, min_order_value: e.target.value })} /></div>
              <div><Label>Máximo de usos</Label><Input type="number" value={promoForm.max_uses} onChange={(e) => setPromoForm({ ...promoForm, max_uses: e.target.value })} placeholder="Ilimitado" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromoOpen(false)}>Cancelar</Button>
            <Button onClick={handleSavePromo} disabled={!promoForm.name || !promoForm.coupon_code || !promoForm.discount_value}>
              {editing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Nova Oferta ── */}
      <Dialog open={dealOpen} onOpenChange={setDealOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flame size={18} className="text-red-600" />
              Nova Oferta
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Produto</Label>
              <select
                value={dealForm.product_id}
                onChange={(e) => setDealForm({ ...dealForm, product_id: e.target.value })}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="">Selecione um produto...</option>
                {(products ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.brand} (US$ {p.price_usd.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Tipo de Oferta</Label>
              <div className="flex gap-2 mt-1">
                {DEAL_TYPES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setDealForm({ ...dealForm, deal_type: t.value })}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium transition-colors ${
                        dealForm.deal_type === t.value
                          ? "bg-red-50 border-red-300 text-red-700"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={14} />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Desconto (%)</Label>
                <Input
                  type="number" min={1} max={99}
                  value={dealForm.discount_percent}
                  onChange={(e) => setDealForm({ ...dealForm, discount_percent: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Duracao (horas)</Label>
                <Input
                  type="number" min={1} max={168}
                  value={dealForm.hours}
                  onChange={(e) => setDealForm({ ...dealForm, hours: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Limite de resgates (0 = sem limite)</Label>
              <Input
                type="number" min={0}
                value={dealForm.max_claims}
                onChange={(e) => setDealForm({ ...dealForm, max_claims: Number(e.target.value) })}
                className="mt-1"
              />
            </div>

            {dealForm.product_id && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-700 mb-1">Preview</p>
                <p className="text-sm font-bold text-red-700">{dealForm.discount_percent}% OFF</p>
                <p className="text-xs text-muted-foreground">
                  Duracao: {dealForm.hours}h | Limite: {dealForm.max_claims > 0 ? `${dealForm.max_claims} resgates` : "Sem limite"}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDealOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => createDeal.mutate()}
              disabled={!dealForm.product_id || createDeal.isPending}
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              {createDeal.isPending ? <Loader2 size={14} className="animate-spin" /> : <Flame size={14} />}
              Criar Oferta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
