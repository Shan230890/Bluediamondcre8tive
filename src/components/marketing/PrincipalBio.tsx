import { Eyebrow } from "./Pill";

const LINKEDIN_URL = "https://www.linkedin.com/in/levana-naidoo-00175a95/";

// lucide-react's installed version doesn't ship a LinkedIn glyph; inlined
// directly rather than pulling in a second icon dependency for one icon.
function LinkedInIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

/**
 * Real principal bio. Every claim here is sourced directly from Levana's
 * own LinkedIn export, nothing is invented. No headshot exists yet, so the
 * avatar is a plain monogram rather than a placeholder silhouette pretending
 * toward a photo that isn't there.
 *
 * Rewritten per Shan's instruction to lead with the marketing/growth track
 * record rather than the property credentials. The only sourced growth
 * story available is Blue Diamond Capital (built by Levana personally) plus
 * Blue Diamond Cre8tive itself (the same system now run for client brands),
 * so those two are made explicit and the causal chain between them is
 * spelled out, rather than implying additional named case studies that do
 * not exist in the source material.
 */
export function PrincipalBio() {
  return (
    <div className="bdc-principal-bio">
      <div className="bdc-principal-avatar" aria-hidden="true">
        LN
      </div>
      <div>
        <Eyebrow>Principal-led</Eyebrow>
        <h3 className="bdc-principal-title">Levana Naidoo</h3>
        <p className="bdc-principal-role">
          Principal, Blue Diamond Cre8tive &middot; Director &amp; Co-founder, Blue Diamond Capital
        </p>
        <p className="bdc-principal-copy">
          Levana built Blue Diamond Capital&apos;s entire marketing function from nothing, under one
          rule: every hour spent on it had to earn its place against revenue and efficiency. She ran
          that marketing herself, personally, on Claude, ChatGPT, DeepSeek, and a working stack of
          marketing-specific AI tools. That discipline is what turned marketing into a core skill for
          the business, not a function she delegated and hoped worked.
        </p>
        <p className="bdc-principal-copy">
          It worked on her own business first. That is what led her to start running the same system
          for other brands, the same AI-native approach and the same revenue discipline, now applied
          to client marketing instead of just her own. Blue Diamond Cre8tive is that system, extended.
        </p>
        <p className="bdc-principal-copy">
          Before co-founding Blue Diamond Capital in 2023, a boutique property advisory serving
          high-net-worth clients and luxury projects across Mauritius and South Africa, she spent years
          managing commercial property portfolios and running property advisory work. She holds a BSc
          Honours in Property Studies from the University of Cape Town, awarded cum laude.
        </p>
        <p className="bdc-principal-copy">
          Every Services engagement is overseen by Levana personally. Nothing ships until she has
          reviewed the strategy and the work behind it.
        </p>
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="bdc-principal-linkedin">
          <LinkedInIcon />
          Connect on LinkedIn
        </a>
      </div>
    </div>
  );
}
