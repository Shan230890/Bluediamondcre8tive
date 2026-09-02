/**
 * Auto-run daily cap for the Platform task board. Adapted from Opsara's
 * company-wide toggle + daily credit cap, simplified for this project's
 * single-tenant-per-client model: any signed-in client can flip auto-run on
 * a task, gated by a simple per-client daily count so it can't be abused.
 */
export const AUTO_RUN_DAILY_CAP = 5;

/** Start of "today" in UTC, used to scope the daily count query. */
export function startOfTodayUtc(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** True once a client has hit (or exceeded) today's auto-run completion cap. */
export function hasReachedAutoRunCap(todaysAutoRunCount: number): boolean {
  return todaysAutoRunCount >= AUTO_RUN_DAILY_CAP;
}
