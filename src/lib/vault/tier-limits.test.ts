import { describe, expect, it } from "vitest";
import { getCompetitorLimit } from "./tier-limits";

describe("getCompetitorLimit", () => {
  it("returns 1 for starter", () => {
    expect(getCompetitorLimit("starter")).toBe(1);
  });

  it("returns 5 for pro", () => {
    expect(getCompetitorLimit("pro")).toBe(5);
  });

  it("returns null (unlimited) for agency", () => {
    expect(getCompetitorLimit("agency")).toBeNull();
  });

  it("is case-insensitive", () => {
    expect(getCompetitorLimit("Pro")).toBe(5);
    expect(getCompetitorLimit("AGENCY")).toBeNull();
  });

  it("fails closed (0) for an unknown tier", () => {
    expect(getCompetitorLimit("nonexistent")).toBe(0);
    expect(getCompetitorLimit("")).toBe(0);
  });
});
