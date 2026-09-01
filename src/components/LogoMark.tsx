/**
 * Icon mark. `public/logo.svg` is the full brand wordmark lockup ("blue"
 * script over "CRE8TIVE"), not a square icon -- squeezed into a small square
 * it reads as illegible noise everywhere it was used. This is a proper icon
 * mark instead: an accent-orange diamond (nodding to "Blue Diamond") with no
 * background fill, drawn as plain vector shapes so it stays crisp at any
 * size and reads clearly on both light and dark surfaces (header, footer,
 * nav overlay, dashboard sidebar) instead of relying on a wordmark asset
 * that was never meant to be a small icon.
 */
export function LogoMark({ size = "sm" }: { size?: "sm" | "md" }) {
  const px = size === "md" ? 34 : 28;
  return (
    <svg width={px} height={px} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M16 2 L30 16 L16 30 L2 16 Z M16 10 L24 16 L16 22 L8 16 Z"
        fill="var(--accent)"
        fillRule="evenodd"
      />
    </svg>
  );
}
