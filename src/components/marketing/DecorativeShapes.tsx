/**
 * Low-opacity dot-grid texture, a recurring brand motif used sparingly
 * (2-3 places site-wide) rather than on every section. CSS-only, derived
 * only from --accent-rgb so it never introduces a new hue. Position the
 * parent with `position: relative` and pick a corner via `corner`.
 */
export function DecorativeShapes({ corner = "tr" }: { corner?: "tr" | "bl" }) {
  return <div className={`bdc-decorative-shapes bdc-decorative-shapes-${corner}`} aria-hidden="true" />;
}
