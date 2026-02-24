import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/useSettings";
import { useCreateOrder, useCreateOrderItem } from "@/hooks/useOrders";
import { calculatePriceBRL } from "@/lib/calculations";
import { formatBRL } from "@/lib/format";

const steps = ["Endereço", "Pagamento", "Revisão", "Confirmação"];

export default function ClientCheckout() {
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState<"pix" | "cartao" | "wallet">("pix");
  const [coupon, setCoupon] = useState("");
  const [doneOrder, setDoneOrder] = useState<string | null>(null);
  const [address, setAddress] = useState({ cep: "", city: "", state: "", street: "", number: "", complement: "" });
  const nav = useNavigate();

  const { items, clearCart } = useCart();
  const { data: settings } = useSettings();
  const { user, profile } = useAuth();
  const createOrder = useCreateOrder();
  const createOrderItem = useCreateOrderItem();

  const exchangeRate = Number(settings?.exchange_rate ?? "5.70");
  const spread = Number(settings?.spread_percent ?? "3");
  const totalBRL = useMemo(() => items.reduce((sum, i) => sum + calculatePriceBRL(i.product.price_usd, exchangeRate, spread) * i.quantity, 0), [items, exchangeRate, spread]);
  const discount = coupon.trim().toUpperCase() === "MALA10" ? totalBRL * 0.1 : 0;
  const finalTotal = totalBRL - discount;

  async function confirmOrder() {
    if (!user || !profile) return;
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
      notes: `Pagamento: ${payment}. Endereço: ${address.street}, ${address.number} - ${address.city}/${address.state}`,
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
  }

  return (
    <div className="space-y-4 pb-6">
      <h1 className="font-display text-xl font-bold">Checkout</h1>
      <div className="grid grid-cols-4 gap-2 text-xs">
        {steps.map((s, i) => <div key={s} className={`text-center py-2 rounded ${i <= step ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>{s}</div>)}
      </div>

      {step === 0 && (
        <Card><CardContent className="pt-4 space-y-3">
          <Input placeholder="CEP" value={address.cep} onChange={(e) => setAddress({ ...address, cep: e.target.value })} />
          <div className="grid grid-cols-2 gap-2"><Input placeholder="Cidade" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} /><Input placeholder="Estado" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-2"><Input placeholder="Rua" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} /><Input placeholder="Número" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} /></div>
          <Input placeholder="Complemento" value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} />
          <Button className="w-full" onClick={() => setStep(1)}>Continuar</Button>
        </CardContent></Card>
      )}

      {step === 1 && (
        <Card><CardContent className="pt-4 space-y-3">
          <select className="w-full border rounded px-3 py-2" value={payment} onChange={(e) => setPayment(e.target.value as "pix" | "cartao" | "wallet")}>
            <option value="pix">PIX</option><option value="cartao">Cartão</option><option value="wallet">Saldo wallet</option>
          </select>
          <Input placeholder="Cupom (ex: MALA10)" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
          <Button className="w-full" onClick={() => setStep(2)}>Revisar pedido</Button>
        </CardContent></Card>
      )}

      {step === 2 && (
        <Card><CardContent className="pt-4 space-y-2">
          <p className="text-sm">Subtotal: {formatBRL(totalBRL)}</p>
          <p className="text-sm">Desconto: -{formatBRL(discount)}</p>
          <p className="font-semibold">Total: {formatBRL(finalTotal)}</p>
          <p className="text-xs text-gray-500">Pagamento: {payment.toUpperCase()}</p>
          <Button className="w-full" onClick={confirmOrder}>Confirmar pedido</Button>
        </CardContent></Card>
      )}

      {step === 3 && (
        <Card><CardContent className="pt-4 space-y-3 text-center">
          <h2 className="text-lg font-semibold">Pedido confirmado!</h2>
          <p>Número do pedido: <strong>{doneOrder}</strong></p>
          <Button onClick={() => nav('/client/orders')} className="w-full">Ir para Meus Pedidos</Button>
        </CardContent></Card>
      )}
    </div>
  );
}
