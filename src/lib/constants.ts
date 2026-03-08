import type { OrderStatus, PaymentType, WalletTransactionType } from '@/types';

// ── Order Status Config ──────────────────────
export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  novo: { label: 'Novo', color: 'bg-gray-100 text-gray-800' },
  orcamento: { label: 'Orçamento', color: 'bg-yellow-100 text-yellow-800' },
  aprovado: { label: 'Aprovado', color: 'bg-blue-100 text-blue-800' },
  comprando: { label: 'Comprando', color: 'bg-orange-100 text-orange-800' },
  comprado: { label: 'Comprado', color: 'bg-teal-100 text-teal-800' },
  em_transito: { label: 'Em Trânsito', color: 'bg-purple-100 text-purple-800' },
  chegou_brasil: { label: 'Chegou no Brasil', color: 'bg-green-100 text-green-800' },
  entregue: { label: 'Entregue', color: 'bg-emerald-100 text-emerald-800' },
  cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
} as const;

// ── Payment Type Config ──────────────────────
export const PAYMENT_TYPE_CONFIG: Record<
  PaymentType,
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  deposit: { label: 'Depósito Sinal', variant: 'default' },
  balance: { label: 'Pagamento Saldo', variant: 'secondary' },
  refund: { label: 'Reembolso', variant: 'destructive' },
} as const;

// ── Wallet Transaction Type Config ───────────
export const WALLET_TYPE_CONFIG: Record<
  WalletTransactionType,
  { label: string; color: string }
> = {
  referral_credit: { label: 'Crédito Indicação', color: 'bg-emerald-100 text-emerald-800' },
  order_debit: { label: 'Débito Pedido', color: 'bg-red-100 text-red-800' },
  admin_adjust: { label: 'Ajuste Admin', color: 'bg-blue-100 text-blue-800' },
  refund: { label: 'Reembolso', color: 'bg-yellow-100 text-yellow-800' },
  loyalty_credit: { label: 'Cashback Fidelidade', color: 'bg-purple-100 text-purple-800' },
} as const;

// ── Derived label/color maps ─────────────────
export const ORDER_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(ORDER_STATUS_CONFIG).map(([k, v]) => [k, v.label]),
);

export const ORDER_STATUS_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(ORDER_STATUS_CONFIG).map(([k, v]) => [k, v.color]),
);

// ── Default settings ─────────────────────────
export const DEFAULT_SETTINGS = {
  exchange_rate: '5.80',
  spread_percent: '45',
  whatsapp_number: '',
  referral_credit: '30',
} as const;
