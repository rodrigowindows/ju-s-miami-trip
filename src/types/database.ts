export type UserRole = "admin" | "cliente";

export type OrderStatus =
  | "novo"
  | "orcamento"
  | "aprovado"
  | "comprando"
  | "em_viagem"
  | "entregar"
  | "entregue";

export type TripStatus = "planejada" | "em_andamento" | "concluida";

export interface Profile {
  id: string;
  role: UserRole;
  name: string;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  client_id: string;
  status: OrderStatus;
  product_name: string;
  product_url: string | null;
  product_image_url: string | null;
  price_usd: number | null;
  price_brl: number | null;
  exchange_rate: number | null;
  spread_pct: number | null;
  deposit_paid: boolean;
  balance_paid: boolean;
  trip_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  client?: Profile;
}

export interface Trip {
  id: string;
  traveler_name: string;
  departure_date: string;
  arrival_date: string;
  status: TripStatus;
  notes: string | null;
  created_at: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  novo: "Novo",
  orcamento: "Orçamento",
  aprovado: "Aprovado",
  comprando: "Comprando",
  em_viagem: "Em Viagem",
  entregar: "Entregar",
  entregue: "Entregue",
};

export interface KanbanColumn {
  id: string;
  title: string;
  statuses: OrderStatus[];
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "novo_orcar", title: "Novo / Orçar", statuses: ["novo", "orcamento"] },
  { id: "comprando", title: "Comprando", statuses: ["aprovado", "comprando"] },
  { id: "em_viagem", title: "Em Viagem", statuses: ["em_viagem"] },
  { id: "entregar", title: "Entregar", statuses: ["entregar"] },
  { id: "entregue", title: "Entregue", statuses: ["entregue"] },
];
