import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

/** Shared footer for every Pattern E marketing page — carries the mandatory
 * attribution line and full legal-suite link set. */
export function LandingFooter() {
  return (
    <footer className="fs-footer">
      <div className="footer-inner">
        <div className="footer-cols">
          <div>
            <div className="footer-brand">
              <LogoMark size="sm" />
              <span>Blue Diamond Cre8tive</span>
            </div>
            <p className="footer-tagline">
              AI-native marketing services, tools, and courses for busy brands. Built and run by a human team,
              delivered at AI speed.
            </p>
          </div>
          <div>
            <h4>Silos</h4>
            <ul>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/tools">Tools</Link></li>
              <li><Link href="/academy">Academy</Link></li>
              <li><Link href="/work">Work</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/login">Log in</Link></li>
              <li><Link href="/signup">Sign up</Link></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/disclaimer">Disclaimer</Link></li>
              <li><Link href="/refund-cancellation">Refund &amp; Cancellation</Link></li>
              <li><Link href="/legal/services-agreement">Client Services Agreement</Link></li>
              <li><Link href="/legal/tool-tos">Tool ToS &amp; DPA</Link></li>
              <li><Link href="/legal/course-licence">Course Licence Terms</Link></li>
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
