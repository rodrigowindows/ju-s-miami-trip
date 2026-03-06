import { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/useSettings";
import { useCreateOrder, useCreateOrderItem } from "@/hooks/useOrders";
import { useActivePromotions } from "@/hooks/usePromotions";
import { calculatePriceBRL } from "@/lib/calculations";
import { formatBRL } from "@/lib/format";
import { toast } from "sonner";
import { ChevronLeft, CheckCircle2, Loader2, MapPin, ClipboardList, PartyPopper, Copy, QrCode, Shield, Phone, Mail, MessageCircle } from "lucide-react";
import { ProductImage } from "@/components/catalog/ProductImage";

const steps = [
  { label: "Endereço", icon: MapPin },
  { label: "Revisão", icon: ClipboardList },
  { label: "Confirmação", icon: PartyPopper },
];

export default function ClientCheckout() {
  const [step, setStep] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [doneOrder, setDoneOrder] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({ cep: "", city: "", state: "", street: "", number: "", complement: "", neighborhood: "", phone: "", email: "" });
  const [addressError, setAddressError] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const nav = useNavigate();

  const { items, clearCart } = useCart();
  const { data: settings } = useSettings();
  const { user, profile } = useAuth();
  const createOrder = useCreateOrder();
  const createOrderItem = useCreateOrderItem();
  const { data: promotions = [] } = useActivePromotions();

  // Pre-fill phone and email from profile
  useEffect(() => {
    if (profile) {
      setAddress((prev) => ({
        ...prev,
        phone: prev.phone || profile.phone || "",
        email: prev.email || profile.email || "",
      }));
    }
  }, [profile]);

  const exchangeRate = Number(settings?.exchange_rate ?? "5.80");
  const spread = Number(settings?.spread_percent ?? "45");
  const totalBRL = useMemo(() => items.reduce((sum, i) => sum + calculatePriceBRL(i.product.price_usd, exchangeRate, spread) * i.quantity, 0), [items, exchangeRate, spread]);

  const matchedPromo = useMemo(() => {
    if (!coupon.trim() || !couponApplied) return null;
    return promotions.find((p) => p.coupon_code.toUpperCase() === coupon.trim().toUpperCase());
  }, [coupon, couponApplied, promotions]);

  const discount = useMemo(() => {
    if (!matchedPromo) return 0;
    if (matchedPromo.min_order_value && totalBRL < matchedPromo.min_order_value) return 0;
    if (matchedPromo.discount_type === "percent") return totalBRL * (matchedPromo.discount_value / 100);
    return Math.min(matchedPromo.discount_value, totalBRL);
  }, [matchedPromo, totalBRL]);

  const finalTotal = totalBRL - discount;

  // CEP lookup via ViaCEP API
  const lookupCep = useCallback(async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddress((prev) => ({
          ...prev,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
        }));
        setAddressError("");
        toast.success("Endereço encontrado!");
      } else {
        toast.error("CEP não encontrado.");
      }
    } catch {
      // ViaCEP may be unavailable, allow manual entry
    } finally {
      setCepLoading(false);
    }
  }, []);

  function handleCepChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    setAddress({ ...address, cep: formatted });

    if (digits.length === 8) {
      lookupCep(digits);
    }
  }

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 6) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    else if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    setAddress({ ...address, phone: formatted });
  }

  function validateAddress() {
    if (!address.cep.trim() || !address.city.trim() || !address.state.trim() || !address.street.trim() || !address.number.trim()) {
      setAddressError("Preencha todos os campos obrigatórios.");
      return false;
    }
    if (address.cep.replace(/\D/g, "").length !== 8) {
      setAddressError("CEP deve ter 8 dígitos.");
      return false;
    }
    if (address.phone.replace(/\D/g, "").length < 10) {
      setAddressError("Informe um telefone válido com DDD.");
      return false;
    }
    if (!address.email.trim() || !address.email.includes("@")) {
      setAddressError("Informe um e-mail válido.");
      return false;
    }
    setAddressError("");
    return true;
  }

  function applyCoupon() {
    if (!coupon.trim()) return;
    const found = promotions.find((p) => p.coupon_code.toUpperCase() === coupon.trim().toUpperCase());
    if (found) {
      setCouponApplied(true);
      toast.success(`Cupom "${found.coupon_code}" aplicado!`);
    } else {
      setCouponApplied(false);
      toast.error("Cupom inválido ou expirado.");
    }
  }

  const pixKey = settings?.pix_key || "ajuvaiparamiami@pix.com";
  const pixKeyHolder = settings?.pix_key_holder || "AjuVaiParaMiami";
  const pixQrImage = settings?.pix_qr_image || "";
  const whatsappNumber = settings?.whatsapp_number || "5561999999999";

  function copyPixCode() {
    navigator.clipboard.writeText(pixKey).then(() => {
      setPixCopied(true);
      toast.success("Chave PIX copiada!");
      setTimeout(() => setPixCopied(false), 3000);
    });
  }

  function openWhatsApp() {
    const depositAmount = formatBRL(finalTotal * 0.5);
    const message = encodeURIComponent(
      `Olá! Segue o comprovante do PIX referente ao pedido *${doneOrder}*.\n\nValor do sinal: *${depositAmount}*\n\nAguardo confirmação!`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  }

  async function confirmOrder() {
    if (!user || !profile || submitting) return;
    setSubmitting(true);
    try {
      const itemNames = items.map((i) => `${i.product.name}${i.quantity > 1 ? ` (x${i.quantity})` : ""}`).join(", ");
      const depositAmount = finalTotal * 0.5;
      const order = await createOrder.mutateAsync({
        client_id: user.id,
        customer_name: profile.full_name ?? "",
        customer_phone: address.phone || profile.phone || undefined,
        items: itemNames,
        total_usd: items.reduce((s, i) => s + i.product.price_usd * i.quantity, 0),
        total_brl: finalTotal,
        total_amount: finalTotal,
        deposit_amount: depositAmount,
        notes: `Pagamento: PIX. Endereço: ${address.street}, ${address.number}${address.neighborhood ? ` - ${address.neighborhood}` : ""}${address.complement ? ` (${address.complement})` : ""} - ${address.city}/${address.state} - CEP: ${address.cep}. Tel: ${address.phone}. Email: ${address.email}${matchedPromo ? `. Cupom: ${matchedPromo.coupon_code}` : ""}`,
      });
      for (const item of items) {
        await createOrderItem.mutateAsync({
          order_id: order.id,
          product_name: item.product.name,
          product_image_url: item.product.image_url,
          quantity: item.quantity,
          price_usd: item.product.price_usd * item.quantity,
          price_brl: calculatePriceBRL(item.product.price_usd, exchangeRate, spread) * item.quantity,
        });
      }

      clearCart();
      setDoneOrder(order.order_number);
      setStep(2);
    } catch {
      toast.error("Erro ao criar pedido. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0 && step < 2) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-gray-500">Seu carrinho está vazio.</p>
        <Button onClick={() => nav("/client/catalog")} variant="outline">Voltar ao catálogo</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8 max-w-2xl mx-auto">
      <h1 className="font-display text-xl font-bold">Checkout</h1>

      {/* Steps indicator */}
      <div className="grid grid-cols-3 gap-1">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`text-center py-2.5 rounded-lg font-medium transition-all text-xs flex flex-col items-center gap-1 ${
                i < step ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                i === step ? "bg-rose-500 text-white shadow-sm" :
                "bg-gray-50 text-gray-400 border border-gray-100"
              }`}
            >
              {i < step ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Back button */}
      {step > 0 && step < 2 && (
        <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)} className="gap-1 text-gray-600">
          <ChevronLeft size={16} /> Voltar
        </Button>
      )}

      {/* Step 0: Address */}
      {step === 0 && (
        <Card className="shadow-sm">
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-rose-500" />
              <h2 className="font-semibold">Endereço de entrega</h2>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">CEP *</label>
              <div className="flex gap-2">
                <Input
                  placeholder="00000-000"
                  value={address.cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  maxLength={9}
                  className="flex-1"
                />
                {cepLoading && <Loader2 size={18} className="animate-spin text-gray-400 self-center" />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">WhatsApp / Telefone *</label>
                <Input placeholder="(11) 99999-9999" value={address.phone} onChange={(e) => handlePhoneChange(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">E-mail *</label>
                <Input type="email" placeholder="seu@email.com" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Cidade *</label>
                <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Estado *</label>
                <Input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} maxLength={2} placeholder="UF" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Rua *</label>
              <Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Número *</label>
                <Input value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Bairro</label>
                <Input value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Complemento</label>
              <Input placeholder="Apto, bloco, etc. (opcional)" value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} />
            </div>

            {addressError && <p className="text-sm text-red-500 bg-red-50 p-2 rounded-md">{addressError}</p>}
            <Button className="w-full h-11" onClick={() => { if (validateAddress()) setStep(1); }}>
              Revisar pedido
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Review + Coupon (merged) */}
      {step === 1 && (
        <Card className="shadow-sm">
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center gap-2">
              <ClipboardList size={18} className="text-rose-500" />
              <h2 className="font-semibold">Resumo do pedido</h2>
            </div>

            <div className="space-y-3 border-b pb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                  <ProductImage src={item.product.image_url} alt={item.product.name} brand={item.product.brand} category={item.product.category} className="w-14 h-14 rounded-lg object-cover border" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">{formatBRL(calculatePriceBRL(item.product.price_usd, exchangeRate, spread) * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Coupon section */}
            <div className="pt-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-sm">Cupom de desconto</h3>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o código"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); setCouponApplied(false); }}
                  className="flex-1"
                />
                <Button variant="outline" onClick={applyCoupon} disabled={!coupon.trim()}>Aplicar</Button>
              </div>
              {couponApplied && matchedPromo && (
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 mt-2">
                  {matchedPromo.discount_type === "percent" ? `${matchedPromo.discount_value}% OFF` : `R$ ${matchedPromo.discount_value} OFF`} aplicado
                </Badge>
              )}
              {couponApplied && !matchedPromo && (
                <p className="text-xs text-red-500 mt-2">Cupom inválido ou expirado.</p>
              )}
            </div>

            <div className="space-y-2 text-sm border-t pt-3">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatBRL(totalBRL)}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Desconto ({matchedPromo?.coupon_code})</span><span>-{formatBRL(discount)}</span></div>}
              <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span>{formatBRL(finalTotal)}</span></div>
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-lg p-2">
                <QrCode size={14} />
                <span className="text-xs font-medium">Pagamento via PIX — Sinal (50%): {formatBRL(finalTotal * 0.5)}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <p className="text-gray-700">
                  {address.street}, {address.number}{address.neighborhood ? ` - ${address.neighborhood}` : ""}{address.complement ? ` (${address.complement})` : ""} - {address.city}/{address.state} - CEP: {address.cep}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400 shrink-0" />
                <p className="text-gray-700">{address.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400 shrink-0" />
                <p className="text-gray-700">{address.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
              <Shield size={14} className="shrink-0" />
              <p>Sua compra é segura. Acompanhe o status pelo painel ou WhatsApp.</p>
            </div>

            <Button className="w-full h-12 text-base" onClick={confirmOrder} disabled={submitting}>
              {submitting ? <><Loader2 size={18} className="animate-spin mr-2" /> Processando...</> : "Confirmar pedido"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Confirmation */}
      {step === 2 && (
        <Card className="shadow-sm">
          <CardContent className="pt-8 pb-8 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Pedido confirmado!</h2>
              <p className="text-sm text-gray-500 mt-1">Obrigado pela sua compra</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 inline-block">
              <p className="text-xs text-gray-500">Número do pedido</p>
              <p className="text-lg font-bold text-gray-900">{doneOrder}</p>
            </div>

            {/* PIX Payment Section */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <QrCode size={18} className="text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-800">Pague via PIX</p>
              </div>

              <p className="text-xs text-gray-600">
                Depósito de <strong>{formatBRL(finalTotal * 0.5)}</strong>
              </p>

              {/* QR Code Image */}
              {pixQrImage && (
                <div className="flex justify-center">
                  <img
                    src={pixQrImage}
                    alt="QR Code PIX"
                    className="w-48 h-48 rounded-lg border border-emerald-200 bg-white p-2"
                  />
                </div>
              )}

              <div className="bg-white rounded-lg p-3 space-y-2">
                <p className="text-xs text-gray-500">Chave PIX:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-gray-800 font-medium break-all">{pixKey}</code>
                  <Button variant="ghost" size="sm" onClick={copyPixCode} className="shrink-0 gap-1 text-xs">
                    <Copy size={12} /> {pixCopied ? "Copiado!" : "Copiar"}
                  </Button>
                </div>
                {pixKeyHolder && (
                  <p className="text-xs text-gray-500">Titular: <strong>{pixKeyHolder}</strong></p>
                )}
              </div>

              {/* WhatsApp Button */}
              <Button
                onClick={openWhatsApp}
                className="w-full h-11 bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2"
              >
                <MessageCircle size={18} />
                Enviar comprovante via WhatsApp
              </Button>
            </div>

            <p className="text-sm text-gray-600">
              Você receberá atualizações sobre seu pedido via WhatsApp e notificações.
            </p>
            <div className="space-y-2 pt-2">
              <Button onClick={() => nav("/client/orders")} className="w-full h-11">
                Ir para Meus Pedidos
              </Button>
              <Button variant="outline" onClick={() => nav("/client/catalog")} className="w-full h-11">
                Continuar comprando
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
