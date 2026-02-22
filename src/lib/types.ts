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

export interface Order {
  id: string;
  order_number: string;
  client_id: string;
  status: OrderStatus;
  total_brl: number | null;
  total_usd: number | null;
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
  status: OrderStatus;
  title: string;
  description: string | null;
  created_at: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: "admin" | "cliente";
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      catalog_products: {
        Row: CatalogProduct;
        Insert: Omit<CatalogProduct, "id" | "created_at">;
        Update: Partial<Omit<CatalogProduct, "id" | "created_at">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at" | "order_number">;
        Update: Partial<Omit<Order, "id" | "created_at" | "order_number">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id" | "created_at">;
        Update: Partial<Omit<OrderItem, "id" | "created_at">>;
      };
      order_events: {
        Row: OrderEvent;
        Insert: Omit<OrderEvent, "id" | "created_at">;
        Update: Partial<Omit<OrderEvent, "id" | "created_at">>;
      };
      settings: {
        Row: Settings;
        Insert: Omit<Settings, "id">;
        Update: Partial<Omit<Settings, "id">>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "created_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
    };
  };
}
