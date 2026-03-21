import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { useSettings } from "@/hooks/useSettings";
import { calculatePriceBRL } from "@/lib/calculations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/catalog/StarRating";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useToast } from "@/hooks/use-toast";
import NotifyMeButton from "@/components/catalog/NotifyMeButton";
import AIPriceEstimate from "@/components/catalog/AIPriceEstimate";
import { ChevronRight, Shield, Truck, RotateCcw, MessageCircle, Share2, Heart, ShoppingBag, Minus, Plus, ZoomIn, TrendingDown } from "lucide-react";
import { getMLComparison } from "@/lib/ml-prices";
import StickyBuyBar from "@/components/catalog/StickyBuyBar";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ProductImage } from "@/components/catalog/ProductImage";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWhatsAppCheckout } from "@/hooks/useWhatsAppCheckout";
import AIRecommendations from "@/components/catalog/AIRecommendations";
import { slugify } from "@/lib/slugify";
import { Input } from "@/components/ui/input";


export default function PublicProductPage() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const { track } = useAnalytics();
  const { user } = useAuth();
  const { addItem, openCart } = useCart();
  const { buyNowViaWhatsApp } = useWhatsAppCheckout();
  const isLoggedIn = !!user;
  const { data: products = [] } = useCatalogProducts();
  const { data: settings } = useSettings();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"desc" | "details" | "shipping">("desc");
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [sizeInfo, setSizeInfo] = useState("");
  const trackedRef = useRef<string | null>(null);

  const product = useMemo(
    () => products.find((p) => slugify(p.name) === slug),
    [products, slug]
  );

  const related = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  }, [products, product]);

  const more = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.id !== product.id && p.category !== product.category).slice(0, 4);
  }, [products, product]);

  // Track product view (once per product) — must be before early return
  useEffect(() => {
    if (product && trackedRef.current !== product.id) {
      trackedRef.current = product.id;
      track("product_view", {
        product_id: product.id,
        product_name: product.name,
        product_brand: product.brand,
        product_category: product.category,
      });
    }
  }, [product, track]);

  const exchangeRate = Number(settings?.exchange_rate ?? "5.80");
  const spread = Number(settings?.spread_percent ?? "45");

  if (!product) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">Produto não encontrado</p>
        <Link to="/" className="text-sm text-rose-600 hover:underline mt-2 inline-block">Voltar ao catálogo</Link>
      </div>
    </div>
  );

  const brl = calculatePriceBRL(product.price_usd, exchangeRate, spread);

  const images = [product.image_url, ...(product.image_url_2 ? [product.image_url_2] : [])];
  const brandSlug = slugify(product.brand || "marca");
  const isSoldOut = product.availability_type === "esgotado";
  const mlComparison = getMLComparison(brl, product.brand, product.category);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:underline hover:text-gray-700">Home</Link>
          <ChevronRight size={14} />
          <Link to={`/catalog?cat=${product.category}`} className="hover:underline hover:text-gray-700">{product.category}</Link>
          <ChevronRight size={14} />
          <Link to={`/marca/${brandSlug}`} className="hover:underline hover:text-gray-700">{product.brand}</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      {/* Product main section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image gallery */}
          <div>
            <div
              className="aspect-square bg-white border rounded-xl p-6 relative cursor-zoom-in overflow-hidden group"
              onClick={() => setZoomed(!zoomed)}
            >
              <ProductImage
                src={images[selectedImage]}
                alt={product.name}
                brand={product.brand}
                category={product.category}
                className={`w-full h-full object-contain transition-transform duration-300 ${zoomed ? "scale-150" : "group-hover:scale-105"}`}
                loading="eager"
              />
              <div className="absolute bottom-3 right-3 bg-white/80 rounded-full p-2 shadow-sm">
                <ZoomIn size={16} className="text-gray-500" />
              </div>
              {isSoldOut && (
                <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center">
                  <Badge className="bg-gray-900 text-white text-sm px-4 py-2">Esgotado</Badge>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`w-16 h-16 border-2 rounded-lg overflow-hidden transition-colors ${
                    i === selectedImage ? "border-rose-500 shadow-sm" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(i)}
                >
                  <ProductImage src={img} alt={`${product.name} ${i + 1}`} brand={product.brand} category={product.category} className="w-full h-full object-cover" loading="eager" />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-4">
            <div>
              <Link to={`/marca/${brandSlug}`} className="text-sm text-rose-500 font-medium hover:underline uppercase tracking-wide">
                {product.brand}
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
            </div>

            <StarRating rating={Number(product.rating || 4.7)} reviews={product.review_count || 0} />

            {/* Availability */}
            <div className="flex flex-wrap gap-2">
              {product.availability_type === "pronta_entrega" && (
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50">
                  Pronta Entrega
                </Badge>
              )}
              {product.availability_type === "sob_encomenda" && (
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50">
                  Sob Encomenda {product.estimated_days ? `(${product.estimated_days} dias)` : ""}
                </Badge>
              )}
              {isSoldOut && (
                <Badge className="bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-100">
                  Esgotado
                </Badge>
              )}
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <p className="text-3xl font-bold text-gray-900">
                {brl.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">Preço estimado com taxas</p>
              <p className="text-sm text-emerald-600 font-medium mt-1">
                à vista no PIX
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Preço nos EUA: US$ {product.price_usd.toFixed(2)}
              </p>
              <div className="mt-2">
                <AIPriceEstimate
                  productName={product.name}
                  priceUsd={product.price_usd}
                  category={product.category}
                />
              </div>
            </div>

            {/* ML Price Comparison */}
            {mlComparison && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                <TrendingDown size={16} className="text-emerald-600 shrink-0" />
                <div className="text-sm">
                  <span className="text-emerald-700 font-semibold">
                    {mlComparison.savingsPercent}% mais barato
                  </span>
                  <span className="text-emerald-600">
                    {" "}que no Mercado Livre (
                    {mlComparison.mlPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    )
                  </span>
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            {!isSoldOut && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Quantidade:</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 rounded-l-lg"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="p-2 hover:bg-gray-50 rounded-r-lg"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Size / variant selector */}
                {(product.category === "Calçados" || product.category === "Roupas" || product.category === "Moda" || product.category === "Tênis") && (
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Tamanho desejado:</label>
                    <Input
                      placeholder="Ex: 38, M, 9 US..."
                      value={sizeInfo}
                      onChange={(e) => setSizeInfo(e.target.value)}
                      className="h-10"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    className="bg-rose-500 hover:bg-rose-600 text-white gap-2 h-12"
                    onClick={() => {
                      if (!isLoggedIn) { nav("/login"); return; }
                      track("buy_click", { product_id: product.id, product_name: product.name, product_brand: product.brand, product_category: product.category, product_price_brl: brl });
                      buyNowViaWhatsApp(product, quantity, sizeInfo ? `Tamanho: ${sizeInfo}` : undefined);
                    }}
                  >
                    <MessageCircle size={16} /> {isLoggedIn ? "Comprar via WhatsApp" : "Login para comprar"}
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 h-12"
                    onClick={() => {
                      addItem(product, quantity);
                      toast({ title: "✓ Produto adicionado ao carrinho!" });
                      openCart();
                    }}
                  >
                    <ShoppingBag size={16} /> Adicionar ao carrinho
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1 gap-1 text-gray-600" onClick={() => isLoggedIn ? nav("/favoritos") : nav("/login")}>
                    <Heart size={14} /> Favoritar
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 gap-1 text-gray-600" onClick={() => {
                    track("share_click", { product_id: product.id, product_name: product.name, product_brand: product.brand });
                    const text = `Olha esse produto: ${product.name} - ${brl.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}>
                    <Share2 size={14} /> Compartilhar
                  </Button>
                </div>
              </div>
            )}

            {isSoldOut && <NotifyMeButton productId={product.id} productName={product.name} />}

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col items-center text-center gap-1 p-3 bg-gray-50 rounded-lg">
                <Shield size={18} className="text-emerald-600" />
                <span className="text-[11px] text-gray-600 leading-tight">Produto original</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 p-3 bg-gray-50 rounded-lg">
                <Truck size={18} className="text-blue-600" />
                <span className="text-[11px] text-gray-600 leading-tight">Entrega segura</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 p-3 bg-gray-50 rounded-lg">
                <RotateCcw size={18} className="text-amber-600" />
                <span className="text-[11px] text-gray-600 leading-tight">Troca garantida</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Details / Shipping */}
      <div className="bg-white border-t mt-2">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-0 border-b">
            {[
              { key: "desc" as const, label: "Descrição" },
              { key: "details" as const, label: "Detalhes" },
              { key: "shipping" as const, label: "Envio" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-rose-500 text-rose-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-5">
            {activeTab === "desc" && (
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>{product.description || "Produto importado diretamente dos Estados Unidos com garantia de originalidade."}</p>
              </div>
            )}
            {activeTab === "details" && (
              <div className="space-y-2 text-sm">
                <div className="flex border-b py-2">
                  <span className="w-32 text-gray-500 font-medium">Marca</span>
                  <span className="text-gray-900">{product.brand}</span>
                </div>
                <div className="flex border-b py-2">
                  <span className="w-32 text-gray-500 font-medium">Categoria</span>
                  <span className="text-gray-900">{product.category}</span>
                </div>
                <div className="flex border-b py-2">
                  <span className="w-32 text-gray-500 font-medium">Origem</span>
                  <span className="text-gray-900">Estados Unidos (Miami, FL)</span>
                </div>
                <div className="flex border-b py-2">
                  <span className="w-32 text-gray-500 font-medium">Condição</span>
                  <span className="text-gray-900">Novo, lacrado</span>
                </div>
                <div className="flex py-2">
                  <span className="w-32 text-gray-500 font-medium">Garantia</span>
                  <span className="text-gray-900">Originalidade garantida</span>
                </div>
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-4">
                  <Truck size={20} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900">Entrega via viagem Miami</p>
                    <p className="text-blue-700 text-xs mt-1">
                      Seus produtos são comprados pessoalmente nas lojas de Miami e trazidos em nossas viagens regulares.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                  <MessageCircle size={20} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Acompanhamento via WhatsApp</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Você recebe fotos da compra e rastreio até a entrega na sua porta.
                    </p>
                  </div>
                </div>
                {product.availability_type === "pronta_entrega" && (
                  <p className="text-emerald-600 font-medium">Este produto está em estoque e pode ser enviado imediatamente.</p>
                )}
                {product.availability_type === "sob_encomenda" && (
                  <p className="text-amber-600 font-medium">
                    Este produto será comprado na próxima viagem.
                    {product.estimated_days ? ` Prazo estimado: ${product.estimated_days} dias.` : ""}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Q&A */}
      <div className="bg-white border-t mt-2">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h2 className="font-bold text-lg text-gray-900">Perguntas e respostas</h2>
          <p className="text-sm text-gray-500 mt-1">Faça login para enviar perguntas sobre este produto.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => nav('/login')}>
            Fazer uma pergunta
          </Button>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="bg-white border-t mt-2">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Produtos relacionados</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  brl={calculatePriceBRL(p.price_usd, exchangeRate, spread)}
                  onClick={() => nav(`/produto/${slugify(p.name)}`)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      <div className="bg-gray-50 border-t pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <AIRecommendations currentProductId={product.id} category={product.category} />
        </div>
      </div>

      {/* Mobile Sticky Buy Bar */}
      <StickyBuyBar productName={product.name} priceBrl={brl} isSoldOut={isSoldOut} />
    </div>
  );
}
