import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("lowercases text", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes accents", () => {
    expect(slugify("Café com Leite")).toBe("cafe-com-leite");
  });

  it("replaces non-alphanumeric chars with hyphens", () => {
    expect(slugify("iPhone 16 Pro (256GB)")).toBe("iphone-16-pro-256gb");
  });

  it("removes leading and trailing hyphens", () => {
    expect(slugify("--test--")).toBe("test");
  });

  it("handles special characters", () => {
    expect(slugify("Levi's 501 Original")).toBe("levi-s-501-original");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("a   b   c")).toBe("a-b-c");
  });
});
