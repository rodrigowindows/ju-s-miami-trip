import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
import { Plus, Loader2, Store, Pencil, Trash2 } from "lucide-react";

export default function AdminCatalog() {
  const { toast } = useToast();
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
    description: "",
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
    setForm({ name: "", brand: "", category: "Tech", price_usd: "", image_url: "", description: "", active: true });
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
      description: product.description ?? "",
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
      description: form.description || null,
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

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Catálogo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os produtos da vitrine
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={16} />
          Novo Produto
        </Button>
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
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
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
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px]">{product.category}</Badge>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Marca</Label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label>URL da imagem</Label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            </div>
            <div>
              <Label>Descrição</Label>
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
