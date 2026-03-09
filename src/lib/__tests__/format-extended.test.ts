import { describe, it, expect } from "vitest";
import { formatBRL, formatDate, formatDateTime, formatShortDate, formatRelativeTime } from "@/lib/format";

describe("formatBRL - extended", () => {
  it("formats zero", () => {
    expect(formatBRL(0)).toContain("0,00");
  });

  it("formats negative values", () => {
    const result = formatBRL(-50.5);
    expect(result).toContain("50,50");
  });

  it("formats large values with thousand separator", () => {
    const result = formatBRL(12345.67);
    expect(result).toContain("12.345,67");
  });

  it("formats cents correctly", () => {
    expect(formatBRL(0.01)).toContain("0,01");
  });
});

describe("formatDate - extended", () => {
  it("formats ISO string", () => {
    expect(formatDate("2024-01-15T10:30:00Z")).toBe("15/01/2024");
  });

  it("formats Date object", () => {
    expect(formatDate(new Date(2024, 5, 20))).toBe("20/06/2024");
  });
});

describe("formatDateTime", () => {
  it("includes time", () => {
    const result = formatDateTime("2024-06-15T14:30:00Z");
    expect(result).toContain("·");
  });
});

describe("formatShortDate", () => {
  it("returns dd/MM format", () => {
    expect(formatShortDate("2024-12-25T00:00:00Z")).toBe("25/12");
  });
});

describe("formatRelativeTime", () => {
  it("returns a relative string with suffix", () => {
    const recent = new Date(Date.now() - 60000).toISOString();
    const result = formatRelativeTime(recent);
    expect(result).toContain("há");
  });
});
