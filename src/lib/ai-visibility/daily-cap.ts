/**
 * Daily cap for AI Visibility Report generation. Mirrors
 * src/lib/tasks/auto-run.ts: each report runs scoreGeoAeo() up to 4 times
 * (own brand + up to 3 competitors), so this is gated the same way auto-run
 * is, a simple per-client daily count, checked before doing any LLM work.
 */
export const AI_VISIBILITY_DAILY_CAP = 3;

/** Start of "today" in UTC, used to scope the daily count query. */
export function startOfTodayUtc(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** True once a client has hit (or exceeded) today's report generation cap. */
export function hasReachedAiVisibilityCap(todaysReportCount: number): boolean {
  return todaysReportCount >= AI_VISIBILITY_DAILY_CAP;
}
