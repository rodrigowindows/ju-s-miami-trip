// Centralized TypeScript types for AjuVaiParaMiami

// Re-export Supabase-generated types
export type { Database, Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Re-export app-level types
export type {
  Profile,
  Order,
  OrderReview,
  Notification,
  Payment,
  Promotion,
  PromotionWithProduct,
  ProductReview as ProductReviewApp,
  Referral,
  Trip,
  TripWithAllocated,
  WalletTransaction,
  WhatsAppTemplate,
  Setting,
} from '@/types/app-types';

// ── Order Status ─────────────────────────────
export type OrderStatus =
  | 'novo'
  | 'orcamento'
  | 'aprovado'
  | 'comprando'
  | 'comprado'
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
export type UserRole = 'admin' | 'cliente';

// ── Referral Status ──────────────────────────
export type ReferralStatus = 'pending' | 'completed';

// ── App Settings ─────────────────────────────
export interface AppSettings {
  exchange_rate: string;
  spread_percent: string;
  whatsapp_number: string;
  referral_credit: string;
  store_name: string;
  store_tagline: string;
  instagram_url: string;
  categories: string;
  prohibited_items: string;
  default_weight_kg: string;
  promo_ticker_text: string;
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

// ── Catalog Product ────────────────────────
export type CatalogProduct = import('@/integrations/supabase/types').Tables<'catalog_products'> & {
  availability_type?: string;
  estimated_days?: number | null;
  stock_quantity?: number;
};

// ── Product Review ─────────────────────────
export type ProductReview = import('@/integrations/supabase/types').Tables<'product_reviews'>;

// ── Product Question (Q&A) ─────────────────
export type ProductQuestion = import('@/integrations/supabase/types').Tables<'product_questions'>;

// ── Order with Client (joined) ─────────────
export type OrderWithClient = Order & {
  client: { full_name: string | null; phone: string | null; email: string } | null;
};

// ── Settings alias (plural) ────────────────
export type Settings = Setting;

// Import types for aliases
import type { Order, Setting } from '@/types/app-types';
