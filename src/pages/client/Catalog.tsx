import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { CatalogProduct } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link2, Camera, ShoppingCart, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["Todos", "Tech", "Beauty", "Fashion"] as const;

function useCatalog() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("catalog_products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      setProducts((data as CatalogProduct[]) ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { products, loading };
}

function useExchangeRate() {
  const [effectiveRate, setEffectiveRate] = useState(6.05 * 1.08);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase.functions.invoke("get-exchange-rate");
      if (!error && data) {
        setEffectiveRate(data.effective_rate);
      }
    }
    fetch();
  }, []);

  function convert(usd: number) {
    return usd * effectiveRate;
  }

  return { convert };
}

export default function Catalog() {
  const { products, loading } = useCatalog();
  const { convert } = useExchangeRate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Link/screenshot modal state
  const [linkUrl, setLinkUrl] = useState("");
  const [linkNotes, setLinkNotes] = useState("");
  const [linkFile, setLinkFile] = useState<File | null>(null);

  const filtered =
    activeCategory === "Todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

  async function handleWantProduct(product: CatalogProduct) {
    if (!user) return;
    setSubmitting(true);

    const { data, error } = await supabase.functions.invoke("create-order", {
      body: { product_id: product.id },
    });

    if (error || !data) {
      toast({ title: "Erro", description: "Não foi possível criar o pedido.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    toast({
      title: "Pedido criado!",
      description: `Pedido ${data.order_number} criado com sucesso.`,
    });
    setSelectedProduct(null);
    setSubmitting(false);
  }

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const formData = new FormData();
    if (linkUrl) formData.append("url", linkUrl);
    if (linkNotes) formData.append("notes", linkNotes);
    if (linkFile) formData.append("file", linkFile);

    const { data, error } = await supabase.functions.invoke("create-order-link", {
      body: formData,
    });

    if (error || !data) {
      toast({ title: "Erro", description: "Não foi possível criar o pedido.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    toast({
      title: "Pedido enviado!",
      description: `Pedido ${data.order_number} criado. Entraremos em contato com o orçamento.`,
    });

    setShowLinkModal(false);
    setLinkUrl("");
    setLinkNotes("");
    setLinkFile(null);
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border px-4 pt-3 pb-2">
        <h1 className="font-display text-xl font-bold text-foreground">Vitrine</h1>
        <p className="text-xs text-muted-foreground mb-3">
          Produtos populares dos EUA
        </p>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-violet-600 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Product Grid */}
      <main className="px-4 pt-4 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-20">
            Nenhum produto encontrado.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-xl border border-border overflow-hidden text-left hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-muted/50 relative overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                    {product.brand}
                  </p>
                  <p className="text-sm font-semibold text-foreground leading-tight mt-0.5 line-clamp-2">
                    {product.name}
                  </p>
                  <div className="mt-2 space-y-0.5">
                    <p className="text-xs text-muted-foreground">
                      US$ {product.price_usd.toFixed(2)}
                    </p>
                    <p className="text-sm font-bold text-violet-600">
                      R$ {convert(product.price_usd).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Fixed bottom: Send link button */}
      <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-3 pt-2 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          onClick={() => setShowLinkModal(true)}
          variant="outline"
          className="w-full rounded-full border-violet-200 text-violet-700 hover:bg-violet-50 font-medium gap-2"
        >
          <Link2 size={16} />
          Enviar link ou screenshot
        </Button>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-sm mx-auto p-0 gap-0 rounded-2xl overflow-hidden">
          {selectedProduct && (
            <>
              <div className="aspect-square bg-muted/50 relative">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1.5"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <Badge variant="secondary" className="text-[10px] font-medium mb-2">
                    {selectedProduct.category}
                  </Badge>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {selectedProduct.brand}
                  </p>
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl mt-1">
                      {selectedProduct.name}
                    </DialogTitle>
                  </DialogHeader>
                </div>

                {selectedProduct.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedProduct.description}
                  </p>
                )}

                <div className="flex items-end gap-3 pt-1">
                  <div>
                    <p className="text-xs text-muted-foreground">Preço EUA</p>
                    <p className="text-lg font-semibold">
                      US$ {selectedProduct.price_usd.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estimativa Brasil</p>
                    <p className="text-lg font-bold text-violet-600">
                      R$ {convert(selectedProduct.price_usd).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleWantProduct(selectedProduct)}
                  disabled={submitting}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full gap-2 mt-2"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart size={16} />
                  )}
                  Quero este produto
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Link/Screenshot Modal */}
      <Dialog open={showLinkModal} onOpenChange={setShowLinkModal}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Enviar link ou screenshot
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Cole o link de qualquer loja americana ou envie uma foto do produto
            </p>
          </DialogHeader>
          <form onSubmit={handleSendLink} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="product-url" className="text-sm">
                Link do produto
              </Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <Input
                  id="product-url"
                  type="url"
                  placeholder="https://amazon.com/..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Screenshot / Foto do produto</Label>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-violet-300 hover:bg-violet-50/50 transition-colors">
                {linkFile ? (
                  <div className="flex items-center gap-2">
                    <Camera size={16} className="text-violet-600" />
                    <span className="text-sm text-foreground">{linkFile.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setLinkFile(null);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Camera size={24} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Toque para selecionar imagem
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setLinkFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm">
                Observações
              </Label>
              <Textarea
                id="notes"
                placeholder="Cor, tamanho, modelo..."
                value={linkNotes}
                onChange={(e) => setLinkNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || (!linkUrl && !linkFile)}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Enviar pedido
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
