import type { Payment } from '@/types';

export function calculatePriceBRL(
  priceUSD: number,
  exchangeRate: number,
  spreadPercent: number
): number {
  const rate = exchangeRate > 0 ? exchangeRate : 5.80;
  return Math.round(priceUSD * rate * (1 + spreadPercent / 100) * 100) / 100;
}

export function calculateRemainingBalance(
  totalBRL: number,
  payments: Payment[]
): number {
  const paid = payments
    .filter((p) => p.type !== 'refund')
    .reduce((sum, p) => sum + p.amount, 0);
  const refunded = payments
    .filter((p) => p.type === 'refund')
    .reduce((sum, p) => sum + p.amount, 0);
  return totalBRL - paid + refunded;
}

export function calculateTotalPaid(payments: Payment[]): number {
  return payments.reduce((sum, p) => {
    if (p.type === 'refund') return sum - p.amount;
    return sum + p.amount;
  }, 0);
}

export function calculateTripWeight(
  orders: Array<{ estimated_weight_kg?: number | null }>
): number {
  return orders.reduce((sum, o) => sum + (o.estimated_weight_kg ?? 0), 0);
}

export function getWeightStatus(
  allocated: number,
  max: number
): 'green' | 'yellow' | 'red' {
  if (max <= 0) return 'red';
  const ratio = allocated / max;
  if (ratio < 0.7) return 'green';
  if (ratio < 0.9) return 'yellow';
  return 'red';
}
