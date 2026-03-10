import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CatalogProduct } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Store, Pencil, Trash2, Download, Sparkles } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { ProductImage } from "@/components/catalog/ProductImage";

import { slugify } from "@/lib/slugify";
function AIDescriptionButton({ name, brand, category, priceUsd, description, onGenerated }: {
  name: string; brand: string; category: string; priceUsd: string; description?: string;
  onGenerated: (desc: string, translatedName?: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"desc" | "trans">("desc");
  const { toast } = useToast();

  async function generateDesc() {
    if (!name || !brand) { toast({ title: "Preencha nome e marca primeiro", variant: "destructive" }); return; }
    setMode("desc"); setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-product-description", {
        body: { product_name: name, brand, category, price_usd: priceUsd },
      });
      if (error) throw error;
      if (data?.description) { onGenerated(data.description); toast({ title: "Descrição gerada com IA! ✨" }); }
    } catch (e: any) { toast({ title: "Erro", description: e.message, variant: "destructive" }); }
    finally { setLoading(false); }
  }

  async function translateProd() {
    if (!name || !brand) { toast({ title: "Preencha nome e marca", variant: "destructive" }); return; }
    setMode("trans"); setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-translate-product", {
        body: { product_name: name, brand, category, description },
      });
      if (error) throw error;
      if (data?.translated_name) { onGenerated(data.translated_description, data.translated_name); toast({ title: "Traduzido! ✨" }); }
    } catch (e: any) { toast({ title: "Erro", description: e.message, variant: "destructive" }); }
    finally { setLoading(false); }
  }

  return (
    <div className="flex gap-1">
      <Button type="button" variant="ghost" size="sm" onClick={generateDesc} disabled={loading} className="gap-1 text-xs h-7 text-primary">
        {loading && mode === "desc" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
        Gerar
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={translateProd} disabled={loading} className="gap-1 text-xs h-7">
        {loading && mode === "trans" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
        Traduzir
      </Button>
    </div>
  );
}

export default function AdminCatalog() {
  const { toast } = useToast();
  const { data: settings } = useSettings();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogProduct | null>(null);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "Tech",
    price_usd: "",
    image_url: "",
    image_url_2: "",
    description: "",
    availability_type: "sob_encomenda" as "pronta_entrega" | "sob_encomenda" | "esgotado",
    estimated_days: "",
    stock_quantity: "0",
    active: true,
  });

  async function fetchProducts() {
    const { data } = await supabase
      .from("catalog_products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts((data as CatalogProduct[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", brand: "", category: "Tech", price_usd: "", image_url: "", image_url_2: "", description: "", availability_type: "sob_encomenda", estimated_days: "", stock_quantity: "0", active: true });
    setOpen(true);
  }

  function openEdit(product: CatalogProduct) {
    setEditing(product);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price_usd: String(product.price_usd),
      image_url: product.image_url,
      image_url_2: product.image_url_2 ?? "",
      description: product.description ?? "",
      availability_type: (product.availability_type as "pronta_entrega" | "sob_encomenda" | "esgotado") ?? "sob_encomenda",
      estimated_days: product.estimated_days ? String(product.estimated_days) : "",
      stock_quantity: String(product.stock_quantity ?? 0),
      active: product.active,
    });
    setOpen(true);
  }

  async function handleSave() {
    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      price_usd: Number(form.price_usd),
      image_url: form.image_url,
      image_url_2: form.image_url_2 || "",
      description: form.description || null,
      availability_type: form.availability_type,
      estimated_days: form.availability_type === "sob_encomenda" && form.estimated_days ? Number(form.estimated_days) : null,
      stock_quantity: form.availability_type === "pronta_entrega" ? Number(form.stock_quantity || 0) : 0,
      active: form.active,
    };

    if (editing) {
      const { error } = await supabase
        .from("catalog_products")
        .update(payload)
        .eq("id", editing.id);
      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Produto atualizado!" });
    } else {
      const { error } = await supabase.from("catalog_products").insert(payload);
      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Produto criado!" });
    }
    setOpen(false);
    fetchProducts();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("catalog_products").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Produto excluído!" });
    fetchProducts();
  }

  function exportCSV() {
    if (products.length === 0) return;
    const whatsappNumber = settings?.whatsapp_number ?? "5561999999999";
    const siteUrl = "https://ajuvaiparamiami.com.br";

    const headers = [
      "ID", "Nome", "Marca", "Categoria", "Preço (USD)", "Descrição",
      "Disponibilidade", "Prazo Estimado (dias)", "Qtd Estoque",
      "Ativo", "Avaliação", "Qtd Reviews", "Qtd Vendas", "Trending",
      "URL Imagem", "Link Produto", "Link WhatsApp", "Criado em"
    ];

    const escapeCSV = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const availLabel = (t: string) =>
      t === "pronta_entrega" ? "Pronta Entrega" : t === "sob_encomenda" ? "Sob Encomenda" : "Esgotado";

    const rows = products.map((p) => {
      const productUrl = `${siteUrl}/produto/${slugify(p.name)}`;
      const whatsMsg = encodeURIComponent(`Olá! Tenho interesse no produto: ${p.name} (${availLabel(p.availability_type ?? "sob_encomenda")}) - US$ ${p.price_usd.toFixed(2)}`);
      const whatsLink = `https://wa.me/${whatsappNumber}?text=${whatsMsg}`;
      return [
        p.id,
        p.name,
        p.brand,
        p.category,
        p.price_usd.toFixed(2),
        p.description ?? "",
        availLabel(p.availability_type ?? "sob_encomenda"),
        p.estimated_days != null ? String(p.estimated_days) : "",
        String(p.stock_quantity ?? 0),
        p.active ? "Sim" : "Não",
        String(p.rating ?? 0),
        String(p.review_count ?? 0),
        String(p.sales_count ?? 0),
        p.trending ? "Sim" : "Não",
        p.image_url,
        productUrl,
        whatsLink,
        p.created_at,
      ].map((v) => escapeCSV(String(v)));
    });

    const bom = "\uFEFF";
    const csv = bom + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `catalogo_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exportado!", description: `${products.length} produtos exportados.` });
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Catálogo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os produtos da vitrine
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={exportCSV} disabled={loading || products.length === 0} className="gap-2 flex-1 sm:flex-initial">
            <Download size={16} />
            Exportar CSV
          </Button>
          <Button onClick={openCreate} className="gap-2 flex-1 sm:flex-initial">
            <Plus size={16} />
            Novo Produto
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Store size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Nenhum produto no catálogo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video bg-muted/50 relative">
                <ProductImage src={product.image_url} alt={product.name} brand={product.brand} category={product.category} className="w-full h-full object-cover" loading="eager" />
                {!product.active && (
                  <Badge className="absolute top-2 right-2 bg-red-100 text-red-700 border-0">
                    Inativo
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">{product.brand}</p>
                    <p className="font-semibold text-sm">{product.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px]">{product.category}</Badge>
                      <Badge className={`text-[10px] border-0 ${product.availability_type === "pronta_entrega" ? "bg-emerald-100 text-emerald-700" : product.availability_type === "sob_encomenda" ? "bg-amber-100 text-amber-700" : "bg-gray-200 text-gray-700"}`}>
                        {product.availability_type === "pronta_entrega" ? `Pronta Entrega (${product.stock_quantity})` : product.availability_type === "sob_encomenda" ? `Sob Encomenda ${product.estimated_days ? `(${product.estimated_days} dias)` : ""}` : "Esgotado"}
                      </Badge>
                      <span className="text-sm font-bold text-violet-600">US$ {product.price_usd.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(product)}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(product.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            <DialogDescription>Preencha os dados do produto</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Marca</Label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Categoria</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Preço (USD)</Label>
                <Input type="number" step="0.01" value={form.price_usd} onChange={(e) => setForm({ ...form, price_usd: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Imagem 1 (URL)</Label>
                <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="URL da imagem principal" />
              </div>
              <div>
                <Label>Imagem 2 (URL)</Label>
                <Input value={form.image_url_2} onChange={(e) => setForm({ ...form, image_url_2: e.target.value })} placeholder="URL da segunda imagem (opcional)" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Disponibilidade</Label>
                <Select value={form.availability_type} onValueChange={(v: "pronta_entrega" | "sob_encomenda" | "esgotado") => setForm({ ...form, availability_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pronta_entrega">Pronta Entrega</SelectItem>
                    <SelectItem value="sob_encomenda">Sob Encomenda</SelectItem>
                    <SelectItem value="esgotado">Esgotado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.availability_type === "pronta_entrega" ? (
                <div>
                  <Label>Quantidade em estoque</Label>
                  <Input type="number" min="0" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
                </div>
              ) : form.availability_type === "sob_encomenda" ? (
                <div>
                  <Label>Prazo estimado (dias)</Label>
                  <Input type="number" min="1" value={form.estimated_days} onChange={(e) => setForm({ ...form, estimated_days: e.target.value })} />
                </div>
              ) : <div />}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Descrição</Label>
                <AIDescriptionButton
                  name={form.name}
                  brand={form.brand}
                  category={form.category}
                  priceUsd={form.price_usd}
                  description={form.description}
                  onGenerated={(desc, translatedName) => setForm(prev => ({ 
                    ...prev, 
                    description: desc,
                    ...(translatedName ? { name: translatedName } : {}) 
                  }))}
                />
              </div>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.brand || !form.price_usd}>
              {editing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
