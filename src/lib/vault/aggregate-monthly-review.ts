/**
 * Aggregation logic for the vault-monthly-review cron job. Pure and
 * deterministic — no LLM call, so it's cheap to run and simple to unit
 * test. Given a client+competitor's weekly_scan rows for the month, produce
 * the content/white_space_notes for one draft monthly_review row.
 */
export interface WeeklyScanRow {
  content: string | null;
  white_space_notes: string | null;
  created_at: string;
}

export interface MonthlyReviewDraft {
  content: string;
  white_space_notes: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Concatenates weekly_scan content/notes into one draft monthly_review, in chronological order. */
export function aggregateMonthlyReview(weeklyScans: WeeklyScanRow[]): MonthlyReviewDraft {
  if (weeklyScans.length === 0) {
    return { content: "", white_space_notes: "" };
  }

  const sorted = [...weeklyScans].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  const content = sorted
    .filter((row) => row.content && row.content.trim().length > 0)
    .map((row) => `[${formatDate(row.created_at)}] ${row.content!.trim()}`)
    .join("\n\n");

  const white_space_notes = sorted
    .filter((row) => row.white_space_notes && row.white_space_notes.trim().length > 0)
    .map((row) => `[${formatDate(row.created_at)}] ${row.white_space_notes!.trim()}`)
    .join("\n\n");

  return { content, white_space_notes };
}
