import { describe, it, expect } from "vitest";
import { calculatePriceBRL, calculateRemainingBalance, calculateTotalPaid, calculateTripWeight, getWeightStatus } from "@/lib/calculations";

describe("calculatePriceBRL - edge cases", () => {
  it("handles negative spread", () => {
    const result = calculatePriceBRL(10, 5.80, -10);
    expect(result).toBe(52.2);
  });

  it("handles very large prices", () => {
    const result = calculatePriceBRL(9999, 6.0, 50);
    expect(result).toBe(89991);
  });

  it("handles fractional cents correctly", () => {
    const result = calculatePriceBRL(1.99, 5.73, 42);
    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBe(Math.round(1.99 * 5.73 * 1.42 * 100) / 100);
  });
});

describe("calculateRemainingBalance - edge cases", () => {
  it("handles all refunds", () => {
    const payments = [
      { id: "1", order_id: "o1", type: "refund", amount: 100, receipt_url: null, notes: null, created_at: "" },
      { id: "2", order_id: "o1", type: "refund", amount: 50, receipt_url: null, notes: null, created_at: "" },
    ];
    expect(calculateRemainingBalance(500, payments)).toBe(650);
  });

  it("handles overpayment scenario", () => {
    const payments = [
      { id: "1", order_id: "o1", type: "deposit", amount: 600, receipt_url: null, notes: null, created_at: "" },
    ];
    expect(calculateRemainingBalance(500, payments)).toBe(-100);
  });
});

describe("calculateTotalPaid - edge cases", () => {
  it("handles all refunds (negative total)", () => {
    const payments = [
      { id: "1", order_id: "o1", type: "refund", amount: 200, receipt_url: null, notes: null, created_at: "" },
    ];
    expect(calculateTotalPaid(payments)).toBe(-200);
  });

  it("handles mixed types correctly", () => {
    const payments = [
      { id: "1", order_id: "o1", type: "deposit", amount: 100, receipt_url: null, notes: null, created_at: "" },
      { id: "2", order_id: "o1", type: "balance", amount: 200, receipt_url: null, notes: null, created_at: "" },
      { id: "3", order_id: "o1", type: "refund", amount: 50, receipt_url: null, notes: null, created_at: "" },
      { id: "4", order_id: "o1", type: "refund", amount: 25, receipt_url: null, notes: null, created_at: "" },
    ];
    expect(calculateTotalPaid(payments)).toBe(225);
  });
});

describe("calculateTripWeight - edge cases", () => {
  it("handles undefined weight", () => {
    const orders = [{ estimated_weight_kg: undefined as unknown as null }];
    expect(calculateTripWeight(orders)).toBe(0);
  });

  it("handles large number of orders", () => {
    const orders = Array.from({ length: 100 }, () => ({ estimated_weight_kg: 0.5 }));
    expect(calculateTripWeight(orders)).toBe(50);
  });
});

describe("getWeightStatus - edge cases", () => {
  it("returns green at exactly 0%", () => {
    expect(getWeightStatus(0, 23)).toBe("green");
  });

  it("returns yellow at exactly 70%", () => {
    expect(getWeightStatus(70, 100)).toBe("yellow");
  });

  it("returns red at exactly 90%", () => {
    expect(getWeightStatus(90, 100)).toBe("red");
  });

  it("returns red at 100%", () => {
    expect(getWeightStatus(23, 23)).toBe("red");
  });

  it("returns red when negative max", () => {
    expect(getWeightStatus(5, -1)).toBe("red");
  });
});
