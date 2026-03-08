import { describe, it, expect } from "vitest";
import { calculatePriceBRL, calculateRemainingBalance, calculateTotalPaid, calculateTripWeight, getWeightStatus } from "@/lib/calculations";

describe("calculatePriceBRL", () => {
  it("calculates BRL price with rate and spread", () => {
    // $10 * 5.80 rate * 1.45 spread = 84.10
    const result = calculatePriceBRL(10, 5.80, 45);
    expect(result).toBe(84.1);
  });

  it("uses fallback rate when rate is 0", () => {
    const result = calculatePriceBRL(10, 0, 45);
    expect(result).toBe(84.1); // uses 5.80 fallback
  });

  it("handles zero spread", () => {
    const result = calculatePriceBRL(10, 5.80, 0);
    expect(result).toBe(58);
  });

  it("handles zero price", () => {
    expect(calculatePriceBRL(0, 5.80, 45)).toBe(0);
  });

  it("rounds to 2 decimal places", () => {
    const result = calculatePriceBRL(9.99, 5.73, 42);
    expect(result).toBe(Math.round(9.99 * 5.73 * 1.42 * 100) / 100);
  });
});

describe("calculateRemainingBalance", () => {
  it("returns total when no payments", () => {
    expect(calculateRemainingBalance(500, [])).toBe(500);
  });

  it("subtracts non-refund payments", () => {
    const payments = [
      { id: "1", order_id: "o1", type: "deposit", amount: 200, receipt_url: null, notes: null, created_at: "" },
    ];
    expect(calculateRemainingBalance(500, payments)).toBe(300);
  });

  it("adds back refunds", () => {
    const payments = [
      { id: "1", order_id: "o1", type: "deposit", amount: 200, receipt_url: null, notes: null, created_at: "" },
      { id: "2", order_id: "o1", type: "refund", amount: 50, receipt_url: null, notes: null, created_at: "" },
    ];
    expect(calculateRemainingBalance(500, payments)).toBe(350);
  });
});

describe("calculateTotalPaid", () => {
  it("returns 0 for empty payments", () => {
    expect(calculateTotalPaid([])).toBe(0);
  });

  it("sums payments and subtracts refunds", () => {
    const payments = [
      { id: "1", order_id: "o1", type: "deposit", amount: 200, receipt_url: null, notes: null, created_at: "" },
      { id: "2", order_id: "o1", type: "balance", amount: 300, receipt_url: null, notes: null, created_at: "" },
      { id: "3", order_id: "o1", type: "refund", amount: 50, receipt_url: null, notes: null, created_at: "" },
    ];
    expect(calculateTotalPaid(payments)).toBe(450);
  });
});

describe("calculateTripWeight", () => {
  it("returns 0 for empty orders", () => {
    expect(calculateTripWeight([])).toBe(0);
  });

  it("sums weight, treating null as 0", () => {
    const orders = [
      { estimated_weight_kg: 2.5 },
      { estimated_weight_kg: null },
      { estimated_weight_kg: 1.5 },
    ];
    expect(calculateTripWeight(orders)).toBe(4);
  });
});

describe("getWeightStatus", () => {
  it("returns green below 70%", () => {
    expect(getWeightStatus(10, 23)).toBe("green");
  });

  it("returns yellow between 70% and 90%", () => {
    expect(getWeightStatus(18, 23)).toBe("yellow");
  });

  it("returns red above 90%", () => {
    expect(getWeightStatus(22, 23)).toBe("red");
  });

  it("returns red when max is 0", () => {
    expect(getWeightStatus(5, 0)).toBe("red");
  });
});
