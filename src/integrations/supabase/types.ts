// Re-export all types from canonical location
export type {
  Profile,
  CatalogProduct,
  Order,
  OrderItem,
  OrderEvent,
  Trip,
  TripWithAllocated,
  Payment,
  Promotion,
  Referral,
  WalletTransaction,
  WhatsAppTemplate,
  Settings,
  OrderStatus,
} from "@/lib/types";

export {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "@/lib/types";

// Keep backward-compat helpers
export type InsertTables<T extends string> = Record<string, unknown> & { id?: string };
export type UpdateTables<T extends string> = Record<string, unknown>;
