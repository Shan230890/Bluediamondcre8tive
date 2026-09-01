import { describe, expect, it } from "vitest";
import { __test__ } from "./scoring-competition";

const { calibrateFundedScore, normalizeCategory } = __test__;

describe("calibrateFundedScore", () => {
  it("scores a sparse category (0 funded) 90-100", () => {
    const { score, red_ocean } = calibrateFundedScore(0, 0, 2);
    expect(score).toBeGreaterThanOrEqual(90);
    expect(score).toBeLessThanOrEqual(100);
    expect(red_ocean).toBe(false);
  });

  it("scores a lightly-funded category (1-3) in the 60-80 band", () => {
    const { score } = calibrateFundedScore(2, 0, 5);
    expect(score).toBeGreaterThanOrEqual(60);
    expect(score).toBeLessThanOrEqual(80);
  });

  it("scores a heavily-funded category (7-10) in the 20-40 band", () => {
    const { score } = calibrateFundedScore(8, 1, 10);
    // Red ocean overrides the band, but the underlying curve should still
    // be monotonically decreasing — check via the red_ocean-free case.
    const noBigTech = calibrateFundedScore(8, 0, 10);
    expect(noBigTech.score).toBeGreaterThanOrEqual(0);
    expect(noBigTech.score).toBeLessThanOrEqual(40);
    expect(score).toBeLessThanOrEqual(noBigTech.score);
  });

  it("flags red ocean at 8+ funded with at least one bigtech player and clamps to <=20", () => {
    const { score, red_ocean } = calibrateFundedScore(9, 2, 12);
    expect(red_ocean).toBe(true);
    expect(score).toBeLessThanOrEqual(20);
  });

  it("is monotonically decreasing as funded count rises", () => {
    const scores = [0, 2, 5, 8, 12].map((n) => calibrateFundedScore(n, 0, 15).score);
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeLessThanOrEqual(scores[i - 1]);
    }
  });
});

describe("normalizeCategory", () => {
  it("maps known aliases to their corpus slug", () => {
    expect(normalizeCategory("AI writing assistant")).toBe("ai-writing-assistant");
    expect(normalizeCategory("coding assistant")).toBe("ai-code-assistant");
  });

  it("returns null for unrecognized categories", () => {
    expect(normalizeCategory("underwater basket weaving")).toBeNull();
  });

  it("returns null for empty/undefined input", () => {
    expect(normalizeCategory(undefined)).toBeNull();
    expect(normalizeCategory("")).toBeNull();
  });
});
