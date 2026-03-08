import { describe, it, expect } from "vitest";
import type { OrderStatus, PaymentType, DiscountType, WalletTransactionType, TripStatus, UserRole, ReferralStatus, AppSettings, KanbanColumn, CatalogProduct, ProductReview, ProductQuestion, OrderItem, OrderEvent } from "@/types";

describe("Type definitions", () => {
  it("OrderStatus has all expected values", () => {
    const statuses: OrderStatus[] = ["novo", "orcamento", "aprovado", "comprando", "comprado", "em_transito", "chegou_brasil", "entregue", "cancelado"];
    expect(statuses).toHaveLength(9);
  });

  it("PaymentType has expected values", () => {
    const types: PaymentType[] = ["deposit", "balance", "refund"];
    expect(types).toHaveLength(3);
  });

  it("DiscountType has expected values", () => {
    const types: DiscountType[] = ["percent", "fixed"];
    expect(types).toHaveLength(2);
  });

  it("WalletTransactionType has expected values", () => {
    const types: WalletTransactionType[] = ["referral_credit", "order_debit", "admin_adjust", "refund", "loyalty_credit"];
    expect(types).toHaveLength(5);
  });

  it("TripStatus has expected values", () => {
    const statuses: TripStatus[] = ["planejada", "em_andamento", "concluida"];
    expect(statuses).toHaveLength(3);
  });

  it("UserRole has expected values", () => {
    const roles: UserRole[] = ["admin", "cliente"];
    expect(roles).toHaveLength(2);
  });

  it("ReferralStatus has expected values", () => {
    const statuses: ReferralStatus[] = ["pending", "completed"];
    expect(statuses).toHaveLength(2);
  });

  it("KANBAN_COLUMNS has expected structure", async () => {
    const { KANBAN_COLUMNS } = await import("@/types");
    expect(KANBAN_COLUMNS).toHaveLength(5);
    expect(KANBAN_COLUMNS[0].id).toBe("novo_orcar");
    expect(KANBAN_COLUMNS[0].statuses).toContain("novo");
  });

  it("AppSettings interface can be instantiated", () => {
    const settings: AppSettings = {
      exchange_rate: "5.80",
      spread_percent: "45",
      whatsapp_number: "5511999999999",
      referral_credit: "30",
      pix_key: "",
      pix_key_holder: "",
      pix_qr_image: "",
    };
    expect(settings.exchange_rate).toBe("5.80");
  });
});
