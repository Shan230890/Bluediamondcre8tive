/**
 * Shared hero background for every secondary marketing page (Services,
 * Tools, Work, Pricing). Reuses the homepage hero's visual language, a
 * vignette gradient plus a giant faint watermark word, without running
 * the interactive LiquidHero canvas, which stays homepage-only both for
 * performance and to keep it a genuine front-door moment.
 */
export function SectionBackground({ watermark }: { watermark: string }) {
  return (
    <div className="bdc-section-bg" aria-hidden="true">
      <div className="bdc-section-bg-vignette" />
      <span className="bdc-section-bg-watermark">{watermark}</span>
    </div>
  );
}
