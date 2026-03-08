// Application-level type definitions

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  role: 'admin' | 'cliente';
  referral_code: string | null;
  wallet_balance: number;
  created_at: string;
};

export type Order = {
  id: string;
  client_id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  items: string;
  product_url: string | null;
  product_image_url: string | null;
  price_usd: number | null;
  price_brl: number | null;
  total_amount: number;
  total_brl: number | null;
  total_usd: number | null;
  deposit_amount: number;
  exchange_rate: number | null;
  spread_pct: number | null;
  status: string;
  deposit_paid: boolean;
  balance_paid: boolean;
  trip_id: string | null;
  estimated_weight_kg: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  trip_code?: string;
};

export type Trip = {
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
};

export type TripWithAllocated = Trip & {
  allocated_weight_kg: number;
  allocated_items_count: number;
};

export type Payment = {
  id: string;
  order_id: string;
  type: string;
  amount: number;
  receipt_url: string | null;
  notes: string | null;
  created_at: string;
};

export type WhatsAppTemplate = {
  id: string;
  slug: string;
  title: string;
  icon: string;
  template_text: string;
  created_at: string;
};

export type Promotion = {
  id: string;
  name: string;
  coupon_code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_value: number | null;
  starts_at: string;
  expires_at: string;
  max_uses: number | null;
  current_uses: number;
  active: boolean;
  product_id: string | null;
  created_at: string;
};

export type PromotionWithProduct = Promotion & {
  product?: { id: string; name: string; image_url: string } | null;
};

export type ProductReview = {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  verified_purchase: boolean;
  created_at: string;
};

export type Referral = {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: 'pending' | 'completed';
  credit_amount: number;
  created_at: string;
};

export type WalletTransaction = {
  id: string;
  client_id: string;
  type: 'referral_credit' | 'order_debit' | 'admin_adjust' | 'refund' | 'loyalty_credit';
  amount: number;
  description: string;
  order_id: string | null;
  created_at: string;
};

export type Setting = {
  id: string;
  key: string;
  value: string;
  updated_at: string;
};

export type OrderReview = {
  id: string;
  order_id: string;
  client_id: string;
  rating: number;
  comment: string | null;
  admin_reply: string | null;
  admin_reply_at: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  client_id: string;
  title: string;
  message: string;
  type: 'order_update' | 'promo' | 'system';
  read: boolean;
  order_id: string | null;
  created_at: string;
};
