/**
 * Full brand lockup, built from Shan's reference image: "blue diamond" in
 * Quicksand (500/600) stacked above "CRE8TIVE" in Poppins 800, where the "8"
 * is the circle+blob person-icon standing in for a digit. `iconOnly` renders
 * just that icon (dashboard sidebar, the floating condensed header) --
 * everywhere else (marketing header, footer, login/signup) gets the full
 * two-line lockup, sized larger than the old bare-icon version per Shan's
 * "make the logo large and visible" note.
 *
 * `surface` keeps the icon's circle legible against its background (dark
 * navy circle on light backgrounds, steel-blue circle on dark ones, same
 * logic the old icon-only mark used) and now also drives the "CRE8TIVE"
 * wordmark colour: dark navy on light surfaces, white on dark ones. The
 * "blue diamond" line stays accent-orange on both surfaces.
 */
export function LogoMark({
  size = "sm",
  surface = "light",
  iconOnly = false,
}: {
  size?: "sm" | "md" | "lg";
  /** Which background this mark sits on, so the circle + wordmark stay legible. */
  surface?: "light" | "dark";
  /** Icon-only (no wordmark) for tight spaces: dashboard sidebar rail, condensed header pill. */
  iconOnly?: boolean;
}) {
  const iconPx = size === "lg" ? 44 : size === "md" ? 34 : 26;
  const circleFill = surface === "dark" ? "var(--accent-2)" : "var(--dark)";
  const wordmarkColor = surface === "dark" ? "#ffffff" : "var(--dark)";
  const l1Size = size === "lg" ? 14 : size === "md" ? 12 : 10;
  const l2Size = size === "lg" ? 28 : size === "md" ? 22 : 17;

  const icon = (
    <svg width={iconPx} height={iconPx} viewBox="0 0 32 32" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="16" cy="9.5" r="6" fill={circleFill} />
      <rect x="6.5" y="13" width="19" height="16.5" rx="8" fill="var(--accent)" />
    </svg>
  );

  if (iconOnly) return icon;

  return (
    <span
      className="bdc-logo-lockup"
      style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1, fontFamily: "var(--font-quicksand)" }}
    >
      <span
        style={{
          fontFamily: "var(--font-quicksand)",
          fontWeight: 600,
          color: "var(--accent)",
          fontSize: l1Size,
          letterSpacing: "0.02em",
        }}
      >
        blue diamond
      </span>
      <span
        style={{
          fontFamily: "var(--font-poppins)",
          fontWeight: 800,
          color: wordmarkColor,
          fontSize: l2Size,
          letterSpacing: "-0.01em",
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        CRE
        <span style={{ display: "inline-flex", alignItems: "flex-end", margin: "0 1px" }}>{icon}</span>
        TIVE
      </span>
    </span>
  );
}
