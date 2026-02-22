import { v4 as uuid } from "uuid";
import type { Order, OrderItem, OrderEvent, OrderStatus, Payment } from "./types";
import {
  mockOrders,
  mockOrderItems,
  mockOrderEvents,
  mockPayments,
  mockClients,
  mockTrips,
  calcBrl,
  EXCHANGE_RATE,
  SPREAD,
} from "./mock-data";

// Mutable copies for local state
let orders = [...mockOrders];
let orderItems = [...mockOrderItems];
let orderEvents = [...mockOrderEvents];
let payments = [...mockPayments];

let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribe(fn: () => void) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

// ---- Reads ----

export function getOrders() {
  return orders.map((o) => ({
    ...o,
    client: mockClients.find((c) => c.id === o.client_id)!,
    items: orderItems.filter((i) => i.order_id === o.id),
  }));
}

export function getOrder(id: string) {
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  return {
    ...order,
    client: mockClients.find((c) => c.id === order.client_id)!,
    items: orderItems.filter((i) => i.order_id === id),
    events: orderEvents
      .filter((e) => e.order_id === id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    payments: payments.filter((p) => p.order_id === id),
  };
}

export function getClients() {
  return mockClients;
}

export function getTrips() {
  return mockTrips;
}

// ---- Writes ----

export function createOrder(clientId: string, items: { name: string; store: string; price_usd: number }[]) {
  const orderNum = `PED-${String(orders.length + 1).padStart(3, "0")}`;
  const orderId = uuid();
  const now = new Date().toISOString();

  const newItems: OrderItem[] = items.map((item) => ({
    id: uuid(),
    order_id: orderId,
    name: item.name,
    store: item.store,
    price_usd: item.price_usd,
    price_brl: calcBrl(item.price_usd),
    image_url: null,
    created_at: now,
  }));

  const totalBrl = newItems.reduce((s, i) => s + i.price_brl, 0);

  const newOrder: Order = {
    id: orderId,
    order_number: orderNum,
    client_id: clientId,
    status: "Novo",
    trip_id: null,
    exchange_rate: EXCHANGE_RATE,
    spread: SPREAD,
    total_brl: totalBrl,
    deposit_paid: 0,
    created_at: now,
    updated_at: now,
  };

  const event: OrderEvent = {
    id: uuid(),
    order_id: orderId,
    event_type: "created",
    title: "Pedido criado",
    description: `Pedido ${orderNum} criado com ${items.length} item(ns)`,
    photo_url: null,
    created_at: now,
  };

  orders = [newOrder, ...orders];
  orderItems = [...orderItems, ...newItems];
  orderEvents = [...orderEvents, event];
  notify();

  return newOrder;
}

export function changeOrderStatus(orderId: string, newStatus: OrderStatus) {
  const now = new Date().toISOString();
  orders = orders.map((o) =>
    o.id === orderId ? { ...o, status: newStatus, updated_at: now } : o
  );

  const event: OrderEvent = {
    id: uuid(),
    order_id: orderId,
    event_type: "status_change",
    title: `Status alterado para ${newStatus}`,
    description: null,
    photo_url: null,
    created_at: now,
  };
  orderEvents = [...orderEvents, event];
  notify();
}

export function assignTrip(orderId: string, tripId: string) {
  const trip = mockTrips.find((t) => t.id === tripId);
  const now = new Date().toISOString();

  orders = orders.map((o) =>
    o.id === orderId ? { ...o, trip_id: tripId, updated_at: now } : o
  );

  const event: OrderEvent = {
    id: uuid(),
    order_id: orderId,
    event_type: "trip_assigned",
    title: "Viagem atribuída",
    description: trip ? `Pedido atribuído à viagem "${trip.name}"` : "Viagem atribuída",
    photo_url: null,
    created_at: now,
  };
  orderEvents = [...orderEvents, event];
  notify();
}

export function addOrderEvent(orderId: string, event: Omit<OrderEvent, "id" | "order_id" | "created_at">) {
  const now = new Date().toISOString();
  const newEvent: OrderEvent = {
    id: uuid(),
    order_id: orderId,
    ...event,
    created_at: now,
  };
  orderEvents = [...orderEvents, newEvent];
  notify();
  return newEvent;
}

function recalcTotal(orderId: string) {
  const total = orderItems
    .filter((i) => i.order_id === orderId)
    .reduce((s, i) => s + i.price_brl, 0);
  orders = orders.map((o) => (o.id === orderId ? { ...o, total_brl: total } : o));
}
