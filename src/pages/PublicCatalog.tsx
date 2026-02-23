import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { CatalogProduct } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, ArrowLeft, LogIn } from "lucide-react";
import Logo from "@/components/shared/Logo";

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

export default function PublicCatalog() {
  const { products, loading } = useCatalog();
  const { convert } = useExchangeRate();

  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);

  const filtered =
    activeCategory === "Todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft size={20} />
            </Link>
            <Logo size="sm" />
          </div>
          <Link
            to="/login"
            className="flex items-center gap-1.5 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
          >
            <LogIn size={14} />
            Entrar
          </Link>
        </div>

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
      <main className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
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
                    <p className="text-xs text-muted-foreground">Preco EUA</p>
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

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full py-2.5 px-4 font-medium text-sm mt-2 transition-colors"
                >
                  <LogIn size={16} />
                  Fazer login para comprar
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
