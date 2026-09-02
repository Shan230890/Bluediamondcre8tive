/* eslint-disable @next/next/no-img-element */

/**
 * Brand mark, rendered straight from Shan's actual artwork files -- no part
 * of the lockup is recreated with CSS text. Two source files, both copied
 * verbatim from `Blue Diamond Cre8tive Logo/` and cropped only to trim the
 * artwork's own whitespace margin (viewBox change only, no path edits):
 *   - `public/brand/logo-full-light.svg` / `logo-full-dark.svg` (from
 *     `Logo.svg` / `5.svg`) -- the complete two-line "blue diamond /
 *     CRE8TIVE" lockup, used whenever there's room for the full mark.
 *   - `public/brand/icon-light.svg` / `icon-dark.svg` (from `2.svg` / `6.svg`)
 *     -- just the person-glyph, used via `iconOnly` for tight spaces
 *     (dashboard sidebar rail, condensed header pill).
 * Both pairs carry a background tuned to match `--bg` (light) / `--dark-2`
 * (dark) respectively, so `surface` just picks the matching file.
 */
export function LogoMark({
  size = "sm",
  surface = "light",
  iconOnly = false,
}: {
  size?: "sm" | "md" | "lg";
  /** Which background this mark sits on, so the file stays legible. */
  surface?: "light" | "dark";
  /** Icon-only (no wordmark) for tight spaces: dashboard sidebar rail, condensed header pill. */
  iconOnly?: boolean;
}) {
  if (iconOnly) {
    const iconPx = size === "lg" ? 44 : size === "md" ? 34 : 26;
    return (
      <img
        src={surface === "dark" ? "/brand/icon-dark.svg" : "/brand/icon-light.svg"}
        alt=""
        width={iconPx}
        height={iconPx}
        style={{ flexShrink: 0, display: "block" }}
      />
    );
  }

  const logoHeight = size === "lg" ? 46 : size === "md" ? 36 : 28;
  return (
    <img
      src={surface === "dark" ? "/brand/logo-full-dark.svg" : "/brand/logo-full-light.svg"}
      alt="Blue Diamond Cre8tive"
      height={logoHeight}
      style={{ flexShrink: 0, display: "block", height: logoHeight, width: "auto" }}
    />
  );
}
