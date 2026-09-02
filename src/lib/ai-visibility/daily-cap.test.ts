import { describe, it, expect } from "vitest";
import { AI_VISIBILITY_DAILY_CAP, hasReachedAiVisibilityCap, startOfTodayUtc } from "./daily-cap";

describe("hasReachedAiVisibilityCap", () => {
  it("allows generation under the cap", () => {
    expect(hasReachedAiVisibilityCap(0)).toBe(false);
    expect(hasReachedAiVisibilityCap(AI_VISIBILITY_DAILY_CAP - 1)).toBe(false);
  });

  it("blocks generation once the cap is reached", () => {
    expect(hasReachedAiVisibilityCap(AI_VISIBILITY_DAILY_CAP)).toBe(true);
    expect(hasReachedAiVisibilityCap(AI_VISIBILITY_DAILY_CAP + 1)).toBe(true);
  });
});

describe("startOfTodayUtc", () => {
  it("zeroes out the time portion in UTC", () => {
    const start = startOfTodayUtc(new Date("2026-09-02T14:37:22.000Z"));
    expect(start.toISOString()).toBe("2026-09-02T00:00:00.000Z");
  });
});
