import { describe, expect, it } from "vitest";
import { aggregateMonthlyReview } from "./aggregate-monthly-review";

describe("aggregateMonthlyReview", () => {
  it("returns empty strings for 0 inputs", () => {
    const result = aggregateMonthlyReview([]);
    expect(result).toEqual({ content: "", white_space_notes: "" });
  });

  it("passes through a single scan's content and notes", () => {
    const result = aggregateMonthlyReview([
      { content: "Launched a new pricing page.", white_space_notes: "No one else bundles onboarding.", created_at: "2026-08-04T10:00:00Z" },
    ]);
    expect(result.content).toContain("Launched a new pricing page.");
    expect(result.white_space_notes).toContain("No one else bundles onboarding.");
  });

  it("concatenates multiple scans in chronological order", () => {
    const result = aggregateMonthlyReview([
      { content: "Second update.", white_space_notes: null, created_at: "2026-08-11T10:00:00Z" },
      { content: "First update.", white_space_notes: null, created_at: "2026-08-04T10:00:00Z" },
    ]);
    const firstIndex = result.content.indexOf("First update.");
    const secondIndex = result.content.indexOf("Second update.");
    expect(firstIndex).toBeGreaterThanOrEqual(0);
    expect(secondIndex).toBeGreaterThan(firstIndex);
  });

  it("skips rows with empty/whitespace-only content or notes", () => {
    const result = aggregateMonthlyReview([
      { content: "  ", white_space_notes: "", created_at: "2026-08-04T10:00:00Z" },
      { content: "Real update.", white_space_notes: null, created_at: "2026-08-05T10:00:00Z" },
    ]);
    expect(result.content).toBe("[Aug 5] Real update.");
    expect(result.white_space_notes).toBe("");
  });
});
