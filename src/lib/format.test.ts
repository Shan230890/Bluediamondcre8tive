import { describe, expect, it } from "vitest";
import { formatCurrency, formatRelativeTime } from "./format";

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

describe("formatRelativeTime", () => {
  const now = new Date("2026-09-02T12:00:00.000Z");

  it("returns an empty string for missing input", () => {
    expect(formatRelativeTime(null, now)).toBe("");
    expect(formatRelativeTime(undefined, now)).toBe("");
  });

  it("returns an empty string for an invalid date", () => {
    expect(formatRelativeTime("not-a-date", now)).toBe("");
  });

  it("returns 'just now' for a moment within the last 45 seconds", () => {
    expect(formatRelativeTime(new Date(now.getTime() - 10_000).toISOString(), now)).toBe("just now");
  });

  it("formats minutes ago", () => {
    expect(formatRelativeTime(new Date(now.getTime() - 5 * 60_000).toISOString(), now)).toBe("5 minutes ago");
  });

  it("formats hours ago", () => {
    expect(formatRelativeTime(new Date(now.getTime() - 2 * 60 * 60_000).toISOString(), now)).toBe("2 hours ago");
  });

  it("formats days ago", () => {
    expect(formatRelativeTime(new Date(now.getTime() - 3 * 24 * 60 * 60_000).toISOString(), now)).toBe("3 days ago");
  });

  it("falls back to a plain date beyond a week", () => {
    expect(formatRelativeTime(new Date(now.getTime() - 10 * 24 * 60 * 60_000).toISOString(), now)).toBe(
      "Aug 23, 2026",
    );
  });
});
