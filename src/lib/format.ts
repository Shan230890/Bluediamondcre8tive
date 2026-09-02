/** Shared currency formatting util — USD, no decimals dropped, used across dashboard money displays. */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

/**
 * Coarse relative-time label ("just now", "5 minutes ago", "2 hours ago",
 * "3 days ago"), falling back to a plain date once it's more than a week
 * old. Used for ai_replied_at timestamps in the task-reply artifact card.
 * Accepts an ISO string or a Date; returns "" for invalid/missing input so
 * a call site can decide whether to render anything at all.
 */
export function formatRelativeTime(input: string | Date | null | undefined, now: Date = new Date()): string {
  if (!input) return "";
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 0) return "just now";
  if (diffSec < 45) return "just now";

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;

  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;

  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
