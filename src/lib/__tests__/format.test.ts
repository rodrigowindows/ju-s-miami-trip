import { describe, it, expect } from "vitest";
import { formatBRL, formatDate, formatDateTime, formatShortDate, formatRelativeTime } from "@/lib/format";

describe("formatBRL", () => {
  it("formats number as BRL currency", () => {
    const result = formatBRL(84.1);
    expect(result).toContain("84,10");
    expect(result).toContain("R$");
  });

  it("formats zero", () => {
    const result = formatBRL(0);
    expect(result).toContain("0,00");
  });

  it("formats large numbers with thousands separator", () => {
    const result = formatBRL(1234.56);
    expect(result).toContain("1.234,56");
  });
});

describe("formatDate", () => {
  it("formats ISO date as dd/MM/yyyy", () => {
    expect(formatDate("2026-03-08T12:00:00Z")).toBe("08/03/2026");
  });
});

describe("formatDateTime", () => {
  it("formats date with time", () => {
    const result = formatDateTime("2026-03-08T14:30:00Z");
    expect(result).toContain("08");
    expect(result).toContain("mar");
  });
});

describe("formatShortDate", () => {
  it("formats date as dd/MM", () => {
    expect(formatShortDate("2026-03-08")).toBe("08/03");
  });
});

describe("formatRelativeTime", () => {
  it("returns relative string with suffix", () => {
    const recent = new Date(Date.now() - 60000).toISOString();
    const result = formatRelativeTime(recent);
    expect(result).toContain("há");
  });
});
