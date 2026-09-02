import { describe, it, expect } from "vitest";
import { AUTO_RUN_DAILY_CAP, hasReachedAutoRunCap, startOfTodayUtc } from "./auto-run";

describe("hasReachedAutoRunCap", () => {
  it("allows auto-run under the cap", () => {
    expect(hasReachedAutoRunCap(0)).toBe(false);
    expect(hasReachedAutoRunCap(AUTO_RUN_DAILY_CAP - 1)).toBe(false);
  });

  it("blocks auto-run once the cap is reached", () => {
    expect(hasReachedAutoRunCap(AUTO_RUN_DAILY_CAP)).toBe(true);
    expect(hasReachedAutoRunCap(AUTO_RUN_DAILY_CAP + 1)).toBe(true);
  });
});

describe("startOfTodayUtc", () => {
  it("zeroes out the time portion in UTC", () => {
    const start = startOfTodayUtc(new Date("2026-09-02T14:37:22.000Z"));
    expect(start.toISOString()).toBe("2026-09-02T00:00:00.000Z");
  });
});
