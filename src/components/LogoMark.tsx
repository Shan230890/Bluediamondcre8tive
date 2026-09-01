/**
 * Icon mark, redrawn from the approved brand concept (Blue Diamond Cre8tive
 * Logo/2.svg + 6.svg): a circle stacked over a rounded blob, in the same
 * proportions and colour logic as the source files -- the circle uses
 * whichever tone actually contrasts with its surface (dark on light
 * backgrounds, steel on dark ones, matching how the source pair does it),
 * the blob stays accent-orange either way. Redrawn as two plain shapes
 * (no background rect, no clipPath cruft) so it stays crisp and legible
 * at any size instead of squeezing a generator-output SVG into a tiny box.
 */
export function LogoMark({
  size = "sm",
  surface = "light",
}: {
  size?: "sm" | "md" | "lg";
  /** Which background this mark sits on, so the circle stays legible. */
  surface?: "light" | "dark";
}) {
  const px = size === "lg" ? 80 : size === "md" ? 48 : 32;
  const circleFill = surface === "dark" ? "var(--accent-2)" : "var(--dark)";
  return (
    <svg width={px} height={px} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="9.5" r="6" fill={circleFill} />
      <rect x="6.5" y="13" width="19" height="16.5" rx="8" fill="var(--accent)" />
    </svg>
  );
}
