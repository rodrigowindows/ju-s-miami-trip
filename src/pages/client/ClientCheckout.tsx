import { useMemo, useState } from "react";
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
import { ChevronLeft, CheckCircle2, Loader2 } from "lucide-react";

const steps = ["Endereço", "Pagamento", "Revisão", "Confirmação"];

export default function ClientCheckout() {
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState<"pix" | "cartao" | "wallet">("pix");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [doneOrder, setDoneOrder] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({ cep: "", city: "", state: "", street: "", number: "", complement: "" });
  const [addressError, setAddressError] = useState("");
  const nav = useNavigate();

  const { items, clearCart } = useCart();
  const { data: settings } = useSettings();
  const { user, profile } = useAuth();
  const createOrder = useCreateOrder();
  const createOrderItem = useCreateOrderItem();
  const { data: promotions = [] } = useActivePromotions();

  const exchangeRate = Number(settings?.exchange_rate ?? "5.70");
  const spread = Number(settings?.spread_percent ?? "3");
  const totalBRL = useMemo(() => items.reduce((sum, i) => sum + calculatePriceBRL(i.product.price_usd, exchangeRate, spread) * i.quantity, 0), [items, exchangeRate, spread]);

  // Find matching promotion from database
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

  function validateAddress() {
    if (!address.cep.trim() || !address.city.trim() || !address.state.trim() || !address.street.trim() || !address.number.trim()) {
      setAddressError("Preencha todos os campos obrigatórios (CEP, cidade, estado, rua e número).");
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

  async function confirmOrder() {
    if (!user || !profile || submitting) return;
    setSubmitting(true);
    try {
      const itemNames = items.map((i) => `${i.product.name}${i.quantity > 1 ? ` (x${i.quantity})` : ""}`).join(", ");
      const order = await createOrder.mutateAsync({
        client_id: user.id,
        customer_name: profile.full_name ?? "",
        customer_phone: profile.phone ?? undefined,
        items: itemNames,
        total_usd: items.reduce((s, i) => s + i.product.price_usd * i.quantity, 0),
        total_brl: finalTotal,
        total_amount: finalTotal,
        deposit_amount: finalTotal * 0.5,
        notes: `Pagamento: ${payment}. Endereço: ${address.street}, ${address.number} - ${address.city}/${address.state}${matchedPromo ? `. Cupom: ${matchedPromo.coupon_code}` : ""}`,
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
      setStep(3);
    } catch {
      toast.error("Erro ao criar pedido. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0 && step < 3) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-gray-500">Seu carrinho está vazio.</p>
        <Button onClick={() => nav("/client/catalog")} variant="outline">Voltar ao catálogo</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      <h1 className="font-display text-xl font-bold">Checkout</h1>

      {/* Steps indicator */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {steps.map((s, i) => (
          <div key={s} className={`text-center py-2 rounded-md font-medium transition-colors ${
            i < step ? "bg-green-100 text-green-700" :
            i === step ? "bg-primary text-white" :
            "bg-gray-100 text-gray-500"
          }`}>
            {i < step ? <CheckCircle2 size={14} className="inline mr-1" /> : null}
            {s}
          </div>
        ))}
      </div>

      {/* Back button */}
      {step > 0 && step < 3 && (
        <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)} className="gap-1">
          <ChevronLeft size={16} /> Voltar
        </Button>
      )}

      {/* Step 0: Address */}
      {step === 0 && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <h2 className="font-semibold text-sm">Endereço de entrega</h2>
            <Input placeholder="CEP *" value={address.cep} onChange={(e) => setAddress({ ...address, cep: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Cidade *" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <Input placeholder="Estado *" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Rua *" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              <Input placeholder="Número *" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} />
            </div>
            <Input placeholder="Complemento (opcional)" value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} />
            {addressError && <p className="text-sm text-red-500">{addressError}</p>}
            <Button className="w-full" onClick={() => { if (validateAddress()) setStep(1); }}>Continuar</Button>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Payment */}
      {step === 1 && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <h2 className="font-semibold text-sm">Forma de pagamento</h2>
            <select className="w-full border rounded-md px-3 py-2 text-sm" value={payment} onChange={(e) => setPayment(e.target.value as "pix" | "cartao" | "wallet")}>
              <option value="pix">PIX</option>
              <option value="cartao">Cartão</option>
              <option value="wallet">Saldo wallet</option>
            </select>

            <h2 className="font-semibold text-sm pt-2">Cupom de desconto</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Digite o cupom"
                value={coupon}
                onChange={(e) => { setCoupon(e.target.value); setCouponApplied(false); }}
              />
              <Button variant="outline" onClick={applyCoupon} disabled={!coupon.trim()}>Aplicar</Button>
            </div>
            {couponApplied && matchedPromo && (
              <Badge className="bg-green-100 text-green-700">
                {matchedPromo.discount_type === "percent" ? `${matchedPromo.discount_value}% OFF` : `R$ ${matchedPromo.discount_value} OFF`} aplicado
              </Badge>
            )}
            {couponApplied && !matchedPromo && (
              <p className="text-xs text-red-500">Cupom inválido.</p>
            )}

            <Button className="w-full" onClick={() => setStep(2)}>Revisar pedido</Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <h2 className="font-semibold text-sm">Resumo do pedido</h2>

            <div className="space-y-2 border-b pb-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img src={item.product.image_url} alt={item.product.name} className="w-10 h-10 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{formatBRL(calculatePriceBRL(item.product.price_usd, exchangeRate, spread) * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatBRL(totalBRL)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Desconto ({matchedPromo?.coupon_code})</span><span>-{formatBRL(discount)}</span></div>}
              <div className="flex justify-between font-bold text-base pt-1 border-t"><span>Total</span><span>{formatBRL(finalTotal)}</span></div>
              <p className="text-xs text-gray-500">Depósito (50%): {formatBRL(finalTotal * 0.5)}</p>
            </div>

            <div className="bg-gray-50 rounded-md p-3 text-xs space-y-1">
              <p><span className="font-medium">Endereço:</span> {address.street}, {address.number}{address.complement ? ` - ${address.complement}` : ""} - {address.city}/{address.state} - CEP: {address.cep}</p>
              <p><span className="font-medium">Pagamento:</span> {payment === "pix" ? "PIX" : payment === "cartao" ? "Cartão" : "Saldo wallet"}</p>
            </div>

            <Button className="w-full" onClick={confirmOrder} disabled={submitting}>
              {submitting ? <><Loader2 size={16} className="animate-spin mr-2" /> Processando...</> : "Confirmar pedido"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <Card>
          <CardContent className="pt-6 space-y-4 text-center">
            <CheckCircle2 size={48} className="mx-auto text-green-500" />
            <h2 className="text-lg font-semibold">Pedido confirmado!</h2>
            <p className="text-sm text-gray-600">Número do pedido: <strong>{doneOrder}</strong></p>
            <p className="text-xs text-gray-500">Você receberá atualizações sobre seu pedido.</p>
            <Button onClick={() => nav("/client/orders")} className="w-full">Ir para Meus Pedidos</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
