import { Eyebrow } from "./Pill";

/**
 * PLACEHOLDER -- pending real content.
 * Shan will supply the principal's actual name, headshot, and bio/LinkedIn
 * later. Until then this renders a generic, honest "our Principal" role
 * block, deliberately with no fabricated name or biography. Swap the
 * silhouette + copy below for the real thing when it lands; nothing else on
 * the page needs to change.
 */
export function PrincipalBio() {
  return (
    <div className="bdc-principal-bio">
      <div className="bdc-principal-avatar" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <circle cx="32" cy="24" r="13" fill="rgba(var(--accent-rgb),0.25)" />
          <path d="M8 58c3-14 14-22 24-22s21 8 24 22" fill="rgba(var(--accent-rgb),0.15)" />
        </svg>
      </div>
      <div>
        <Eyebrow>Principal-led</Eyebrow>
        <h3 className="bdc-principal-title">Our Principal</h3>
        <p className="bdc-principal-copy">
          Every Services engagement is overseen by our principal, a single accountable
          person who signs off on strategy and quality before anything reaches you. Full
          bio and background coming soon.
        </p>
      </div>
    </div>
  );
}
