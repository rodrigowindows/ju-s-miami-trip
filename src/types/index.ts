// ═══════════════════════════════════════════════
// Centralized TypeScript types for MalaBridge
// ═══════════════════════════════════════════════

// Re-export Supabase-generated types
export type {
  Database,
  Tables,
  InsertTables,
  UpdateTables,
  Order,
  Payment,
  Profile,
  Promotion,
  Referral,
  Trip,
  TripWithAllocated,
  WalletTransaction,
  WhatsAppTemplate,
  Setting,
} from '@/integrations/supabase/types';

// ── Order Status ─────────────────────────────
export type OrderStatus =
  | 'novo'
  | 'orcamento'
  | 'aprovado'
  | 'comprando'
  | 'em_transito'
  | 'chegou_brasil'
  | 'entregue'
  | 'cancelado';

// ── Payment Types ────────────────────────────
export type PaymentType = 'deposit' | 'balance' | 'refund';

// ── Discount Types ───────────────────────────
export type DiscountType = 'percent' | 'fixed';

// ── Wallet Transaction Types ─────────────────
export type WalletTransactionType =
  | 'referral_credit'
  | 'order_debit'
  | 'admin_adjust'
  | 'refund';

// ── Trip Status ──────────────────────────────
export type TripStatus = 'planejada' | 'em_andamento' | 'concluida';

// ── User Role ────────────────────────────────
export type UserRole = 'admin' | 'client';

// ── Referral Status ──────────────────────────
export type ReferralStatus = 'pending' | 'completed';

// ── App Settings ─────────────────────────────
export interface AppSettings {
  exchange_rate: string;
  spread_percent: string;
  whatsapp_number: string;
  referral_credit: string;
}

// ── Kanban Board Config ──────────────────────
export interface KanbanColumn {
  id: string;
  title: string;
  statuses: OrderStatus[];
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'novo_orcar', title: 'Novo / Orçar', statuses: ['novo', 'orcamento'] },
  { id: 'comprando', title: 'Comprando', statuses: ['aprovado', 'comprando'] },
  { id: 'em_transito', title: 'Em Trânsito', statuses: ['em_transito'] },
  { id: 'chegou_brasil', title: 'Chegou no Brasil', statuses: ['chegou_brasil'] },
  { id: 'entregue', title: 'Entregue', statuses: ['entregue'] },
];
