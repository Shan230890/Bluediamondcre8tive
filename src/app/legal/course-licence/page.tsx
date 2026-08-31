import type { Metadata } from "next";
import { LegalPageShell } from "@/components/LegalPageShell";

export const metadata: Metadata = { title: "Course & Template Licence Terms — Blue Diamond Cre8tive" };

export default function CourseLicencePage() {
  return (
    <LegalPageShell title="Course & Template Licence Terms" lastUpdated="August 2026">
      <p>
        These Licence Terms govern your use of any course, template pack, or cohort content purchased through the
        Blue Diamond Cre8tive Academy (&quot;Academy Content&quot;), operated by Blue Diamond Capital Ltd, a company
        incorporated in the Republic of Mauritius. They supplement, and do not replace, our general Terms of
        Service.
      </p>

      <h2>1. Licence Grant</h2>
      <p>
        On payment, we grant you a personal, non-exclusive, non-transferable licence to access and use Academy
        Content for your own business or personal purposes. This licence does not transfer ownership of the Academy
        Content itself.
      </p>

      <h2>2. What You May Do</h2>
      <ul>
        <li>Use templates and worksheets to produce your own marketing materials</li>
        <li>Apply course methods and frameworks to your own brand or your clients&apos; brands, where the course is designed for practitioner use</li>
        <li>Access purchased Entry and Flagship tier content for the lifetime of the product, as described at purchase</li>
      </ul>

      <h2>3. What You May Not Do</h2>
      <ul>
        <li>Resell, redistribute, or republish Academy Content, in whole or in part, as your own product</li>
        <li>Share your account access or purchased content with anyone outside your own organisation</li>
        <li>Use Academy Content to build or train a competing course, template product, or AI model</li>
        <li>Claim authorship of Academy Content or represent it as produced by anyone other than Blue Diamond Cre8tive</li>
      </ul>

      <h2>4. Premium Cohort and 1:1 Content</h2>
      <p>
        Premium tier cohort sessions and 1:1 feedback are personal to the participant and are not transferable to
        another individual or recorded for redistribution without our written consent. Feedback given during a
        cohort or 1:1 session is informational and decision-support in nature, on the same terms as our general
        Disclaimer &amp; Indemnity.
      </p>

      <h2>5. Updates to Academy Content</h2>
      <p>
        Where a product includes lifetime updates, as stated at purchase, we will make reasonable efforts to keep
        content current, but do not guarantee a specific update schedule.
      </p>

      <h2>6. Refunds</h2>
      <p>Refund treatment for Academy Content is governed by Part B of our Refund &amp; Cancellation Policy.</p>

      <h2>7. Intellectual Property</h2>
      <p>
        All Academy Content, including course video, written materials, templates, and branding, remains the
        intellectual property of Blue Diamond Capital Ltd. Unauthorised reproduction or distribution is enforceable
        under the Industrial Property Act 2019 and applicable copyright legislation of the Republic of Mauritius,
        and, where infringement occurs outside Mauritius, under the intellectual property laws of the relevant
        jurisdiction.
      </p>

      <h2>8. Governing Law</h2>
      <p>These Licence Terms are governed by the laws of the Republic of Mauritius. Any dispute arising from them is subject to the exclusive jurisdiction of the courts of Mauritius.</p>

      <h2>9. Contact</h2>
      <p>Questions about a purchased course or template: <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a></p>
    </LegalPageShell>
  );
}
