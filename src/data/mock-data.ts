import type { Client, Trip, Order, OrderItem, OrderEvent, Payment } from "./types";

export const EXCHANGE_RATE = 5.70;
export const SPREAD = 3;

export function calcBrl(usd: number, rate = EXCHANGE_RATE, spread = SPREAD): number {
  return Math.round(usd * rate * (1 + spread / 100) * 100) / 100;
}

// --- Clients ---
export const mockClients: Client[] = [
  { id: "c1", name: "Ana Carolina Silva", email: "ana@email.com", phone: "(11) 98765-4321" },
  { id: "c2", name: "Pedro Henrique Santos", email: "pedro@email.com", phone: "(21) 97654-3210" },
  { id: "c3", name: "Mariana Oliveira", email: "mariana@email.com", phone: "(31) 96543-2109" },
  { id: "c4", name: "Lucas Ferreira", email: "lucas@email.com", phone: "(41) 95432-1098" },
];

// --- Trips ---
export const mockTrips: Trip[] = [
  { id: "t1", name: "Miami Março 2026", destination: "Miami, FL", departure_date: "2026-03-10", return_date: "2026-03-18" },
  { id: "t2", name: "Orlando Abril 2026", destination: "Orlando, FL", departure_date: "2026-04-05", return_date: "2026-04-12" },
];

// --- Order Items ---
export const mockOrderItems: OrderItem[] = [
  // Order 1 items
  { id: "oi1", order_id: "o1", name: "iPhone 15 Pro Max 256GB", store: "Apple Store", price_usd: 1199, price_brl: calcBrl(1199), created_at: "2026-02-10T10:00:00Z" },
  { id: "oi2", order_id: "o1", name: "AirPods Pro 2", store: "Apple Store", price_usd: 249, price_brl: calcBrl(249), created_at: "2026-02-10T10:00:00Z" },
  { id: "oi3", order_id: "o1", name: "Case MagSafe Transparente", store: "Apple Store", price_usd: 49, price_brl: calcBrl(49), created_at: "2026-02-10T10:05:00Z" },
  // Order 2 items
  { id: "oi4", order_id: "o2", name: "PS5 Slim Digital", store: "Best Buy", price_usd: 449.99, price_brl: calcBrl(449.99), created_at: "2026-02-12T14:00:00Z" },
  { id: "oi5", order_id: "o2", name: "DualSense Controller (Cosmic Red)", store: "Best Buy", price_usd: 74.99, price_brl: calcBrl(74.99), created_at: "2026-02-12T14:00:00Z" },
  { id: "oi6", order_id: "o2", name: "God of War Ragnarök", store: "Best Buy", price_usd: 39.99, price_brl: calcBrl(39.99), created_at: "2026-02-12T14:05:00Z" },
  // Order 3 items
  { id: "oi7", order_id: "o3", name: "Nike Air Max 90 (42)", store: "Nike Outlet", price_usd: 89.99, price_brl: calcBrl(89.99), created_at: "2026-02-15T09:00:00Z" },
  { id: "oi8", order_id: "o3", name: "Nike Dunk Low (40)", store: "Nike Outlet", price_usd: 109.99, price_brl: calcBrl(109.99), created_at: "2026-02-15T09:00:00Z" },
  { id: "oi9", order_id: "o3", name: "Levi's 501 Original Fit", store: "Levi's Store", price_usd: 69.50, price_brl: calcBrl(69.50), created_at: "2026-02-15T09:10:00Z" },
  { id: "oi10", order_id: "o3", name: "Ralph Lauren Polo Shirt", store: "Ralph Lauren Outlet", price_usd: 59.99, price_brl: calcBrl(59.99), created_at: "2026-02-15T09:15:00Z" },
  // Order 4 items
  { id: "oi11", order_id: "o4", name: "MacBook Air M3 15\"", store: "Apple Store", price_usd: 1299, price_brl: calcBrl(1299), created_at: "2026-02-18T16:00:00Z" },
  { id: "oi12", order_id: "o4", name: "Magic Mouse", store: "Apple Store", price_usd: 99, price_brl: calcBrl(99), created_at: "2026-02-18T16:00:00Z" },
];

// --- Order Events ---
export const mockOrderEvents: OrderEvent[] = [
  // Order 1 events
  { id: "ev1", order_id: "o1", event_type: "created", title: "Pedido criado", description: "Pedido recebido via WhatsApp", created_at: "2026-02-10T10:00:00Z" },
  { id: "ev2", order_id: "o1", event_type: "quote", title: "Orçamento enviado", description: "Orçamento de R$ 8.798,31 enviado para a cliente", created_at: "2026-02-10T14:30:00Z" },
  { id: "ev3", order_id: "o1", event_type: "payment", title: "Sinal recebido", description: "Pagamento de R$ 4.000,00 via PIX confirmado", created_at: "2026-02-11T09:15:00Z" },
  { id: "ev4", order_id: "o1", event_type: "buying", title: "Comprando itens", description: "Compras iniciadas na Apple Store Aventura Mall", created_at: "2026-02-15T11:00:00Z" },
  { id: "ev5", order_id: "o1", event_type: "photo", title: "Foto dos produtos", description: "Produtos comprados com sucesso!", photo_url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400", created_at: "2026-02-15T11:30:00Z" },
  // Order 2 events
  { id: "ev6", order_id: "o2", event_type: "created", title: "Pedido criado", description: "Pedido recebido pelo site", created_at: "2026-02-12T14:00:00Z" },
  { id: "ev7", order_id: "o2", event_type: "quote", title: "Orçamento aprovado", description: "Cliente aprovou o orçamento", created_at: "2026-02-12T18:00:00Z" },
  { id: "ev8", order_id: "o2", event_type: "payment", title: "Pagamento integral", description: "Pagamento total de R$ 3.318,00 via transferência", created_at: "2026-02-13T10:00:00Z" },
  { id: "ev9", order_id: "o2", event_type: "transit", title: "Em trânsito", description: "Produtos despachados com o viajante", created_at: "2026-02-18T08:00:00Z" },
  // Order 3 events
  { id: "ev10", order_id: "o3", event_type: "created", title: "Pedido criado", description: "Pedido recebido via Instagram", created_at: "2026-02-15T09:00:00Z" },
  { id: "ev11", order_id: "o3", event_type: "quote", title: "Orçamento enviado", description: "Aguardando aprovação da cliente", created_at: "2026-02-15T15:00:00Z" },
  // Order 4 events
  { id: "ev12", order_id: "o4", event_type: "created", title: "Pedido criado", description: "Pedido recebido via WhatsApp", created_at: "2026-02-18T16:00:00Z" },
  { id: "ev13", order_id: "o4", event_type: "cancelled", title: "Pedido cancelado", description: "Cliente desistiu da compra", created_at: "2026-02-19T10:00:00Z" },
];

// --- Payments ---
export const mockPayments: Payment[] = [
  { id: "p1", order_id: "o1", amount: 4000, created_at: "2026-02-11T09:15:00Z" },
  { id: "p2", order_id: "o2", amount: 3318, created_at: "2026-02-13T10:00:00Z" },
];

// --- Orders ---
function orderTotal(orderId: string): number {
  return mockOrderItems
    .filter((i) => i.order_id === orderId)
    .reduce((sum, i) => sum + i.price_brl, 0);
}

function orderDeposit(orderId: string): number {
  return mockPayments
    .filter((p) => p.order_id === orderId)
    .reduce((sum, p) => sum + p.amount, 0);
}

export const mockOrders: Order[] = [
  {
    id: "o1",
    order_number: "PED-001",
    client_id: "c1",
    status: "Comprando",
    trip_id: "t1",
    exchange_rate: EXCHANGE_RATE,
    spread: SPREAD,
    total_brl: orderTotal("o1"),
    deposit_paid: orderDeposit("o1"),
    created_at: "2026-02-10T10:00:00Z",
    updated_at: "2026-02-15T11:30:00Z",
  },
  {
    id: "o2",
    order_number: "PED-002",
    client_id: "c2",
    status: "Em Trânsito",
    trip_id: "t1",
    exchange_rate: EXCHANGE_RATE,
    spread: SPREAD,
    total_brl: orderTotal("o2"),
    deposit_paid: orderDeposit("o2"),
    created_at: "2026-02-12T14:00:00Z",
    updated_at: "2026-02-18T08:00:00Z",
  },
  {
    id: "o3",
    order_number: "PED-003",
    client_id: "c3",
    status: "Orçamento",
    trip_id: null,
    exchange_rate: EXCHANGE_RATE,
    spread: SPREAD,
    total_brl: orderTotal("o3"),
    deposit_paid: orderDeposit("o3"),
    created_at: "2026-02-15T09:00:00Z",
    updated_at: "2026-02-15T15:00:00Z",
  },
  {
    id: "o4",
    order_number: "PED-004",
    client_id: "c4",
    status: "Cancelado",
    trip_id: null,
    exchange_rate: EXCHANGE_RATE,
    spread: SPREAD,
    total_brl: orderTotal("o4"),
    deposit_paid: orderDeposit("o4"),
    created_at: "2026-02-18T16:00:00Z",
    updated_at: "2026-02-19T10:00:00Z",
  },
];

// Helper to get enriched orders with client data
export function getOrdersWithClients(): (Order & { client: Client })[] {
  return mockOrders.map((order) => ({
    ...order,
    client: mockClients.find((c) => c.id === order.client_id)!,
  }));
}

// Helper to get full order detail
export function getOrderDetail(orderId: string) {
  const order = mockOrders.find((o) => o.id === orderId);
  if (!order) return null;
  return {
    ...order,
    client: mockClients.find((c) => c.id === order.client_id)!,
    items: mockOrderItems.filter((i) => i.order_id === orderId),
    events: mockOrderEvents
      .filter((e) => e.order_id === orderId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  };
}
