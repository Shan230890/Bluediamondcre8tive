import { z } from "zod";

/**
 * Validation for the manual weekly_scan entry form (src/app/dashboard/vault/page.tsx).
 * See the legal note in README.md — entries are sourced by hand, not scraped.
 */
export const WeeklyScanEntrySchema = z.object({
  competitor_name: z.string().min(1, "Competitor name is required").max(200),
  content: z.string().min(1, "Content is required").max(4000),
  white_space_notes: z.string().max(4000).optional(),
});

export type WeeklyScanEntryInput = z.infer<typeof WeeklyScanEntrySchema>;
