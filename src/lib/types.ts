export type OrderStatus =
  | "novo"
  | "orcamento"
  | "aprovado"
  | "comprando"
  | "comprado"
  | "em_transito"
  | "chegou_brasil"
  | "entregue"
  | "cancelado";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  novo: "Novo",
  orcamento: "Orçamento",
  aprovado: "Aprovado",
  comprando: "Comprando",
  comprado: "Comprado",
  em_transito: "Em Trânsito",
  chegou_brasil: "Chegou ao Brasil",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  novo: "bg-blue-100 text-blue-700 border-blue-200",
  orcamento: "bg-yellow-100 text-yellow-700 border-yellow-200",
  aprovado: "bg-emerald-100 text-emerald-700 border-emerald-200",
  comprando: "bg-orange-100 text-orange-700 border-orange-200",
  comprado: "bg-teal-100 text-teal-700 border-teal-200",
  em_transito: "bg-indigo-100 text-indigo-700 border-indigo-200",
  chegou_brasil: "bg-purple-100 text-purple-700 border-purple-200",
  entregue: "bg-green-100 text-green-700 border-green-200",
  cancelado: "bg-red-100 text-red-700 border-red-200",
};

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: "admin" | "cliente" | "client";
  referral_code: string | null;
  wallet_balance: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  client_id: string;
  customer_name: string;
  customer_phone: string | null;
  status: OrderStatus;
  items: string | null;
  total_usd: number | null;
  total_brl: number | null;
  total_amount: number;
  deposit_amount: number;
  deposit_paid: boolean;
  balance_paid: boolean;
  exchange_rate: number | null;
  spread_pct: number | null;
  product_url: string | null;
  product_image_url: string | null;
  price_usd: number | null;
  price_brl: number | null;
  trip_id: string | null;
  estimated_weight_kg: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  product_url: string | null;
  product_image_url: string | null;
  price_usd: number | null;
  price_brl: number | null;
  quantity: number;
  notes: string | null;
  created_at: string;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  status: string;
  title: string;
  description: string | null;
  created_at: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price_usd: number;
  image_url: string;
  description: string | null;
  active: boolean;
  created_at: string;
}

export interface Trip {
  id: string;
  code: string;
  traveler_name: string;
  flight_number: string | null;
  departure_date: string;
  arrival_date: string;
  max_weight_kg: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface TripWithAllocated extends Trip {
  allocated_weight_kg: number;
  allocated_items_count: number;
}

export interface Payment {
  id: string;
  order_id: string;
  type: "deposit" | "balance" | "refund";
  amount: number;
  receipt_url: string | null;
  notes: string | null;
  created_at: string;
}

export interface Promotion {
  id: string;
  name: string;
  coupon_code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_value: number | null;
  starts_at: string;
  expires_at: string;
  max_uses: number | null;
  current_uses: number;
  active: boolean;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: "pending" | "completed";
  credit_amount: number;
  created_at: string;
}

export interface WalletTransaction {
  id: string;
  client_id: string;
  type: "referral_credit" | "order_debit" | "admin_adjust" | "refund";
  amount: number;
  description: string | null;
  order_id: string | null;
  created_at: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  template: string;
  created_at: string;
}

// Joined types for admin views
export type OrderWithClient = Order & {
  client: Pick<Profile, "full_name" | "phone" | "email"> | null;
};

export type PaymentWithOrder = Payment & {
  order: (Pick<Order, "order_number"> & { client_name: string | null }) | null;
};
