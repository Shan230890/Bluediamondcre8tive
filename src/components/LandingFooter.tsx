import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { LineReveal } from "@/components/marketing/TextReveal";
import { DecorativeShapes } from "@/components/marketing/DecorativeShapes";

/** Shared footer for every Pattern E marketing page — carries the mandatory
 * attribution line, full legal-suite link set, a CTA row, and a giant faint
 * watermark word, matching the rest of the site's motion system. */
export function LandingFooter() {
  return (
    <footer className="fs-footer bdc-footer">
      <DecorativeShapes corner="bl" />
      <span className="bdc-footer-watermark" aria-hidden="true">CRE8TIVE</span>
      <div className="footer-inner">
        <div className="bdc-footer-cta">
          <LineReveal as="h2" lines={["Ready to hand off", "your marketing?"]} className="bdc-footer-cta-heading" />
          <Link href="/contact" className="bdc-pill bdc-pill-light">
            Get started
            <span className="bdc-pill-badge">
              <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>

        <div className="footer-cols">
          <div>
            <div className="footer-brand">
              <LogoMark size="lg" surface="dark" />
              <span>Blue Diamond Cre8tive</span>
            </div>
            <p className="footer-tagline">
              We exist because busy brands don&apos;t need another vendor. They need one
              accountable system that plans, builds, and ships the work, at AI speed.
            </p>
          </div>
          <div>
            <h4>Silos</h4>
            <ul>
              <li><Link href="/services" className="bdc-footer-link">Services</Link></li>
              <li><Link href="/tools" className="bdc-footer-link">Tools</Link></li>
              <li><Link href="/work" className="bdc-footer-link">Work</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/pricing" className="bdc-footer-link">Pricing</Link></li>
              <li><Link href="/contact" className="bdc-footer-link">Contact</Link></li>
              <li><Link href="/login" className="bdc-footer-link">Log in</Link></li>
              <li><Link href="/signup" className="bdc-footer-link">Sign up</Link></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/terms" className="bdc-footer-link">Terms of Service</Link></li>
              <li><Link href="/privacy" className="bdc-footer-link">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="bdc-footer-link">Disclaimer</Link></li>
              <li><Link href="/refund-cancellation" className="bdc-footer-link">Refund &amp; Cancellation</Link></li>
              <li><Link href="/legal/services-agreement" className="bdc-footer-link">Client Services Agreement</Link></li>
              <li><Link href="/legal/tool-tos" className="bdc-footer-link">Tool ToS &amp; DPA</Link></li>
              <li><Link href="/legal/course-licence" className="bdc-footer-link">Course Licence Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Blue Diamond Cre8tive, licensed by Blue Diamond Capital Ltd · Mauritius · Powered by One Hub Automation.</span>
          <span>© {new Date().getFullYear()} Blue Diamond Capital Ltd. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
