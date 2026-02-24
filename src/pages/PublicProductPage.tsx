import { useMemo, useState } from "react";
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

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PublicProductPage() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { toast } = useToast();
  const { data: products = [] } = useCatalogProducts();
  const { data: settings } = useSettings();
  const [selectedImage, setSelectedImage] = useState(0);

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

  if (!product) return <div className="p-8">Produto não encontrado.</div>;

  const exchangeRate = Number(settings?.exchange_rate ?? "5.70");
  const spread = Number(settings?.spread_percent ?? "3");
  const brl = calculatePriceBRL(product.price_usd, exchangeRate, spread);

  const images = [product.image_url];
  const brandSlug = slugify(product.brand || "marca");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500">
        <Link to="/" className="hover:underline">Home</Link> &gt; <Link to={`/catalog?cat=${product.category}`} className="hover:underline">{product.category}</Link> &gt; <span className="text-gray-800">{product.name}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square bg-white border rounded-xl p-4">
            <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-contain" />
          </div>
          <div className="flex gap-2 mt-2">
            {images.map((img, i) => (
              <button key={img + i} className={`w-14 h-14 border rounded ${i === selectedImage ? "border-black" : "border-gray-200"}`} onClick={() => setSelectedImage(i)}>
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-[#F43F5E]">{product.brand}</p>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <button className="text-sm underline" onClick={() => nav(`/marca/${brandSlug}`)}>Ver todos da marca</button>

          <StarRating rating={Number(product.rating || 4.7)} reviews={product.review_count || 0} />

          <div className="space-x-2">
            {product.availability_type === "pronta_entrega" && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Pronta Entrega</Badge>}
            {product.availability_type === "sob_encomenda" && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Sob Encomenda {product.estimated_days ? `(${product.estimated_days} dias)` : ""}</Badge>}
            {product.availability_type === "esgotado" && <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-200">Esgotado</Badge>}
          </div>

          <div>
            <p className="text-3xl font-bold">{brl.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            <p className="text-sm text-gray-500">US$ {product.price_usd.toFixed(2)} · 3x de {(brl / 3).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
          </div>

          <p className="text-gray-700">{product.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button onClick={() => nav('/login')}>Comprar</Button>
            <Button variant="outline" onClick={() => nav('/login')}>Adicionar ao Carrinho</Button>
            <Button variant="outline" onClick={() => nav('/login')}>Favoritar</Button>
            <Button variant="outline" onClick={() => {
              const text = `Olá! Tenho interesse no produto ${product.name} - ${brl.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }}>Compartilhar WhatsApp</Button>
          </div>

          {product.availability_type === "esgotado" && <NotifyMeButton productId={product.id} productName={product.name} />}

          <div className="pt-4 border-t">
            <h2 className="font-semibold">Perguntas e respostas</h2>
            <p className="text-sm text-gray-500">Faça login para enviar perguntas.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h3 className="text-lg font-semibold mb-3">Produtos relacionados</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.map((p) => <ProductCard key={p.id} product={p} brl={calculatePriceBRL(p.price_usd, exchangeRate, spread)} onClick={() => nav(`/produto/${slugify(p.name)}`)} />)}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <h3 className="text-lg font-semibold mb-3">Você também pode gostar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {more.map((p) => <ProductCard key={p.id} product={p} brl={calculatePriceBRL(p.price_usd, exchangeRate, spread)} onClick={() => nav(`/produto/${slugify(p.name)}`)} />)}
        </div>
      </div>
    </div>
  );
}
