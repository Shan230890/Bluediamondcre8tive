import { describe, expect, it } from "vitest";
import { formatCurrency } from "./format";

describe("formatCurrency", () => {
  it("formats a whole dollar amount", () => {
    expect(formatCurrency(500)).toBe("$500.00");
  });

  it("formats a decimal amount", () => {
    expect(formatCurrency(1499.5)).toBe("$1,499.50");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });
});
