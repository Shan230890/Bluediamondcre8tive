/** Server-side slugify for custom agent names — mirrors the `slug` column's use as a URL/route key. */
export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "agent";
}

/** Short random suffix appended when a client reuses a name (and thus a slug) under a different intent. */
export function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}
