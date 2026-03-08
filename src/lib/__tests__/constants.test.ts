import { describe, it, expect } from "vitest";
import { ORDER_STATUS_CONFIG, PAYMENT_TYPE_CONFIG, WALLET_TYPE_CONFIG, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, DEFAULT_SETTINGS } from "@/lib/constants";

describe("ORDER_STATUS_CONFIG", () => {
  it("has all expected statuses", () => {
    const statuses = ["novo", "orcamento", "aprovado", "comprando", "comprado", "em_transito", "chegou_brasil", "entregue", "cancelado"];
    statuses.forEach((s) => {
      expect(ORDER_STATUS_CONFIG).toHaveProperty(s);
      expect(ORDER_STATUS_CONFIG[s as keyof typeof ORDER_STATUS_CONFIG].label).toBeTruthy();
      expect(ORDER_STATUS_CONFIG[s as keyof typeof ORDER_STATUS_CONFIG].color).toBeTruthy();
    });
  });
});

describe("PAYMENT_TYPE_CONFIG", () => {
  it("has deposit, balance, and refund", () => {
    expect(PAYMENT_TYPE_CONFIG.deposit.label).toBe("Depósito Sinal");
    expect(PAYMENT_TYPE_CONFIG.balance.label).toBe("Pagamento Saldo");
    expect(PAYMENT_TYPE_CONFIG.refund.label).toBe("Reembolso");
  });
});

describe("WALLET_TYPE_CONFIG", () => {
  it("has all wallet transaction types", () => {
    expect(WALLET_TYPE_CONFIG.referral_credit.label).toBe("Crédito Indicação");
    expect(WALLET_TYPE_CONFIG.loyalty_credit.label).toBe("Cashback Fidelidade");
  });
});

describe("ORDER_STATUS_LABELS", () => {
  it("maps status keys to Portuguese labels", () => {
    expect(ORDER_STATUS_LABELS.novo).toBe("Novo");
    expect(ORDER_STATUS_LABELS.entregue).toBe("Entregue");
    expect(ORDER_STATUS_LABELS.cancelado).toBe("Cancelado");
  });
});

describe("ORDER_STATUS_COLORS", () => {
  it("maps status keys to CSS classes", () => {
    expect(ORDER_STATUS_COLORS.novo).toContain("bg-gray");
    expect(ORDER_STATUS_COLORS.entregue).toContain("bg-emerald");
  });
});

describe("DEFAULT_SETTINGS", () => {
  it("has sensible defaults", () => {
    expect(DEFAULT_SETTINGS.exchange_rate).toBe("5.80");
    expect(DEFAULT_SETTINGS.spread_percent).toBe("45");
    expect(DEFAULT_SETTINGS.referral_credit).toBe("30");
  });
});
