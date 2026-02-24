import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Flame,
  Zap,
  Plus,
  Trash2,
  Timer,
  Loader2,
  Tag,
  ToggleLeft,
  ToggleRight,
  Percent,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function AdminDeals() {
  const { data: deals, isLoading } = useDeals();
  const { data: products } = useProducts();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    product_id: "",
    discount_percent: 20,
    deal_type: "deal_of_day",
    hours: 24,
    max_claims: 50,
  });

  const createDeal = useMutation({
    mutationFn: async () => {
      const endsAt = new Date();
      endsAt.setHours(endsAt.getHours() + form.hours);
      const { error } = await supabase.from("product_deals").insert({
        product_id: form.product_id,
        discount_percent: form.discount_percent,
        deal_type: form.deal_type,
        ends_at: endsAt.toISOString(),
        max_claims: form.max_claims > 0 ? form.max_claims : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_deals"] });
      toast({ title: "Oferta criada!" });
      setOpen(false);
      setForm({ product_id: "", discount_percent: 20, deal_type: "deal_of_day", hours: 24, max_claims: 50 });
    },
    onError: (e: Error) => {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    },
  });

  const toggleDeal = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("product_deals")
        .update({ active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_deals"] });
    },
  });

  const deleteDeal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("product_deals")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_deals"] });
      toast({ title: "Oferta removida" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
            <Flame size={20} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Ofertas do Dia</h2>
            <p className="text-sm text-muted-foreground">Crie ofertas com desconto % estilo Amazon</p>
          </div>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus size={16} />
          Nova Oferta
        </Button>
      </div>

      {/* Deals grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (deals ?? []).length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Flame size={32} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma oferta criada ainda.</p>
            <Button onClick={() => setOpen(true)} variant="outline" className="mt-3 gap-2">
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
              <Card
                key={deal.id}
                className={`overflow-hidden ${!deal.active || isExpired ? "opacity-60" : ""}`}
              >
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

                  {/* Stats */}
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

                  {/* Progress bar */}
                  {deal.max_claims && (
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${claimedPct}%` }}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 text-xs"
                      onClick={() => toggleDeal.mutate({ id: deal.id, active: !deal.active })}
                    >
                      {deal.active ? <ToggleRight size={14} className="text-emerald-600" /> : <ToggleLeft size={14} />}
                      {deal.active ? "Ativo" : "Inativo"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
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

      {/* Create deal dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flame size={18} className="text-red-600" />
              Nova Oferta
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Product select */}
            <div>
              <Label htmlFor="deal-product-select">Produto</Label>
              <select
                id="deal-product-select"
                value={form.product_id}
                onChange={(e) => setForm({ ...form, product_id: e.target.value })}
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

            {/* Deal type */}
            <div>
              <Label>Tipo de Oferta</Label>
              <div className="flex gap-2 mt-1">
                {DEAL_TYPES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, deal_type: t.value })}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-medium transition-colors ${
                        form.deal_type === t.value
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

            {/* Discount */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Desconto (%)</Label>
                <Input
                  type="number"
                  min={1}
                  max={99}
                  value={form.discount_percent}
                  onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Duracao (horas)</Label>
                <Input
                  type="number"
                  min={1}
                  max={168}
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Max claims */}
            <div>
              <Label>Limite de resgates (0 = sem limite)</Label>
              <Input
                type="number"
                min={0}
                value={form.max_claims}
                onChange={(e) => setForm({ ...form, max_claims: Number(e.target.value) })}
                className="mt-1"
              />
            </div>

            {/* Preview */}
            {form.product_id && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-700 mb-1">Preview</p>
                <p className="text-sm font-bold text-red-700">{form.discount_percent}% OFF</p>
                <p className="text-xs text-muted-foreground">
                  Duracao: {form.hours}h | Limite: {form.max_claims > 0 ? `${form.max_claims} resgates` : "Sem limite"}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => createDeal.mutate()}
              disabled={!form.product_id || createDeal.isPending}
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
