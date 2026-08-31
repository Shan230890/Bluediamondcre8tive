import { describe, expect, it } from "vitest";
import { WeeklyScanEntrySchema } from "./schema";

describe("WeeklyScanEntrySchema", () => {
  it("accepts a valid entry", () => {
    const result = WeeklyScanEntrySchema.safeParse({
      competitor_name: "Acme Marketing Co",
      content: "Launched a referral program.",
      white_space_notes: "No one else in the space runs one.",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an entry with white_space_notes omitted", () => {
    const result = WeeklyScanEntrySchema.safeParse({
      competitor_name: "Acme Marketing Co",
      content: "Launched a referral program.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty competitor_name", () => {
    const result = WeeklyScanEntrySchema.safeParse({
      competitor_name: "",
      content: "Something happened.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty content", () => {
    const result = WeeklyScanEntrySchema.safeParse({
      competitor_name: "Acme",
      content: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an overlong competitor_name", () => {
    const result = WeeklyScanEntrySchema.safeParse({
      competitor_name: "a".repeat(201),
      content: "Something happened.",
    });
    expect(result.success).toBe(false);
  });
});
