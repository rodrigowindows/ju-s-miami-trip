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

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: "admin" | "cliente";
  referral_code: string | null;
  wallet_balance: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  client_id: string;
  status: OrderStatus;
  items: string | null;
  total_brl: number | null;
  total_usd: number | null;
  deposit_paid: number;
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
  event_type: string;
  title: string;
  description: string | null;
  photo_url: string | null;
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
  flight_number: string;
  departure_date: string;
  arrival_date: string;
  max_weight_kg: number;
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
  discount_type: "percentage" | "fixed";
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
  type: "credit" | "debit" | "referral_bonus";
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
  slug: string;
  title: string;
  icon: string;
  template_text: string;
  created_at: string;
}

// Joined types for admin views
export type OrderWithClient = Order & {
  client: Pick<Profile, "full_name" | "phone" | "email"> | null;
};

export type PaymentWithOrder = Payment & {
  order: (Pick<Order, "order_number"> & { client_name: string | null }) | null;
};
