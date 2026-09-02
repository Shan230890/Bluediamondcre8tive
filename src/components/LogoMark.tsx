/* eslint-disable @next/next/no-img-element */

/**
 * Full brand lockup: "blue diamond" in Quicksand (500/600) stacked above
 * "CRE8TIVE" in Poppins 800, where the "8" is Shan's actual icon file
 * (`public/brand/icon-light.svg` / `icon-dark.svg`, copied verbatim from
 * `Blue Diamond Cre8tive Logo/2.svg` and `6.svg`) rather than a hand-drawn
 * approximation -- those two files already carry a background tuned to
 * match `--bg` and `--dark-2` respectively, so they drop in cleanly on
 * their matching surface. `iconOnly` renders just that icon file (dashboard
 * sidebar, the floating condensed header) -- everywhere else (marketing
 * header, footer, login/signup) gets the full two-line lockup.
 *
 * `surface` picks the light/dark icon file so it stays legible against its
 * background, and drives the "CRE8TIVE" wordmark colour: dark navy on light
 * surfaces, white on dark ones. The "blue diamond" line stays accent-orange
 * on both surfaces.
 */
export function LogoMark({
  size = "sm",
  surface = "light",
  iconOnly = false,
}: {
  size?: "sm" | "md" | "lg";
  /** Which background this mark sits on, so the icon file + wordmark stay legible. */
  surface?: "light" | "dark";
  /** Icon-only (no wordmark) for tight spaces: dashboard sidebar rail, condensed header pill. */
  iconOnly?: boolean;
}) {
  const iconPx = size === "lg" ? 44 : size === "md" ? 34 : 26;
  const iconSrc = surface === "dark" ? "/brand/icon-dark.svg" : "/brand/icon-light.svg";
  const wordmarkColor = surface === "dark" ? "#ffffff" : "var(--dark)";
  const l1Size = size === "lg" ? 14 : size === "md" ? 12 : 10;
  const l2Size = size === "lg" ? 28 : size === "md" ? 22 : 17;

  const icon = (
    <img
      src={iconSrc}
      alt=""
      width={iconPx}
      height={iconPx}
      style={{ flexShrink: 0, display: "block" }}
    />
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
        }}
      >
        CRE
        <span style={{ display: "inline-flex", alignItems: "center", margin: "0 0.04em" }}>{icon}</span>
        TIVE
      </span>
    </span>
  );
}
