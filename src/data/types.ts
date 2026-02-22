export type OrderStatus =
  | "Novo"
  | "Orçamento"
  | "Comprando"
  | "Em Trânsito"
  | "Entregue"
  | "Cancelado";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  departure_date: string;
  return_date: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  name: string;
  store: string;
  price_usd: number;
  price_brl: number;
  image_url?: string | null;
  created_at: string;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  event_type: string;
  title: string;
  description?: string | null;
  photo_url?: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  client_id: string;
  client?: Client;
  status: OrderStatus;
  trip_id?: string | null;
  exchange_rate: number;
  spread: number;
  total_brl: number;
  deposit_paid: number;
  items?: OrderItem[];
  events?: OrderEvent[];
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  created_at: string;
}
