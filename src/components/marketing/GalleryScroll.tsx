/**
 * Horizontal-scroll generated-content gallery, structural pattern from the
 * approved mockup (`.gallery-scroll` / `.gallery-card`). Each card is tied
 * to a real product surface (Vault, Cre8tive Score, Services) and framed as
 * a drafted-and-awaiting-review item, matching how the product actually
 * works (see the guardrails section below it, and the review-queue pattern
 * already in the dashboard).
 */
const ITEMS: { title: string; src: string; stats: string }[] = [
  { title: "“A marketing department, without the department.”", src: "FROM CLIENT BRIEF", stats: "Headline variant · homepage" },
  { title: "“They dropped price. Here’s why we won’t.”", src: "FROM VAULT ENTRY", stats: "Positioning note · sales enablement" },
  { title: "“Your white space is smaller than you think.”", src: "FROM CRE8TIVE SCORE", stats: "Landing page hook · /tools/score" },
  { title: "“Reviewed by a person, not just a model.”", src: "FROM SERVICES BRIEF", stats: "Trust line · /services" },
];

export function GalleryScroll() {
  return (
    <div className="bdc-gallery-scroll">
      {ITEMS.map((item) => (
        <div className="bdc-gallery-card" key={item.title}>
          <h4>{item.title}</h4>
          <span className="bdc-gallery-src">{item.src}</span>
          <div className="bdc-gallery-stats">{item.stats}</div>
          <div className="bdc-gallery-status">
            <i aria-hidden="true" />
            Awaiting approval (illustrative)
          </div>
        </div>
      ))}
    </div>
  );
}
