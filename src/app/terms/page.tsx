import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";

export const metadata: Metadata = { title: "Terms of Service — Blue Diamond Cre8tive" };

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated="August 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of Blue Diamond Cre8tive, operated
        by Blue Diamond Capital Ltd, a company incorporated in the Republic of Mauritius (&quot;Blue Diamond
        Cre8tive&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By creating an account, submitting an
        inquiry, or using our services, tools, or Academy products, you agree to be bound by these Terms.
      </p>

      <h2>1. Related Documents</h2>
      <p>These Terms incorporate by reference:</p>
      <ul>
        <li>Our <Link href="/disclaimer">Disclaimer &amp; Indemnity</Link>, which governs AI output limitations, professional advice exclusions, and liability.</li>
        <li>Our <Link href="/refund-cancellation">Refund &amp; Cancellation Policy</Link>, which governs billing, cancellation, and refund treatment for services, Academy products, and Vault subscriptions.</li>
        <li>Our <Link href="/privacy">Privacy Policy</Link>, which governs collection and use of your data.</li>
        <li>Where you have engaged a specific product, the applicable standalone document: our <Link href="/legal/services-agreement">Client Services Agreement</Link>, our <Link href="/legal/tool-tos">Tool ToS &amp; Data-Processing Addendum</Link>, or our <Link href="/legal/course-licence">Course &amp; Template Licence Terms</Link>.</li>
      </ul>
      <p>
        Where these Terms and a related document both address the same subject, the related document governs on that
        specific subject. Where two related documents conflict with each other, the more specific document (for
        example, the Client Services Agreement over the general Terms) governs.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old and have the legal capacity to enter a binding contract to use Blue Diamond
        Cre8tive. If you register on behalf of a company or other entity, you confirm you have the authority to bind
        that entity to these Terms.
      </p>

      <h2>3. Account Registration</h2>
      <p>
        You must provide accurate, current information when registering and keep it up to date. You are responsible
        for maintaining the confidentiality of your login credentials and for all activity under your account.
        Notify us immediately at <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a> of
        any unauthorised use.
      </p>

      <h2>4. What We Offer</h2>
      <p>Blue Diamond Cre8tive operates across three active product lines, each governed by these Terms and the applicable document listed in section 1:</p>
      <ul>
        <li><strong>Marketing services</strong> — done-for-you content, campaigns, and strategy on a subscription, described on our <Link href="/services">services page</Link>.</li>
        <li><strong>Competitor Intelligence Vault</strong> — a subscription tool tracking competitor moves, described on our <Link href="/tools">tools page</Link>.</li>
        <li><strong>Academy</strong> — courses, templates, and cohorts sold as one-time or bundled digital products, described on our <Link href="/academy">Academy page</Link>.</li>
      </ul>
      <p>
        Payment processing is not yet live on the site. Where a purchase is not yet available for immediate
        checkout, we will confirm pricing and terms with you directly before taking payment by another method.
      </p>

      <h2>5. Billing</h2>
      <p>
        Subscription tiers and one-time product prices are described on our <Link href="/pricing">pricing page</Link>.
        Billing, cancellation, and refund terms are governed by our Refund &amp; Cancellation Policy, which sets out
        distinct terms for services, Academy digital products, and Vault subscriptions.
      </p>

      <h2>6. Delivery of Service</h2>
      <p>
        Marketing services and the Vault tool are delivered electronically on the cadence described for your tier.
        Academy products are made available electronically upon purchase. There is no physical delivery, shipping
        cost, or physical delivery method associated with any product we offer.
      </p>
      <p>
        If you experience a delay or failure in accessing anything you have paid for, contact us immediately at{" "}
        <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a> and we will resolve access
        issues without delay.
      </p>

      <h2>7. Your Content</h2>
      <p>
        You retain ownership of any brand assets, brief materials, and data you provide to us in connection with a
        services engagement (&quot;Your Content&quot;). You grant us a licence to use Your Content to deliver the
        engagement, including producing AI-assisted drafts for our team&apos;s review. Deliverables we produce for
        you under a paid services engagement become yours upon full payment, as set out in the Client Services
        Agreement.
      </p>
      <p>
        You are responsible for ensuring you have the right to share anything you give us, and that doing so does
        not breach a confidentiality obligation you owe someone else. If you are not sure you are entitled to share
        something, do not send it, the engagement still works without it.
      </p>

      <h2>8. Competitor Intelligence Vault, Legal Guardrail</h2>
      <p>
        Vault entries are currently sourced from manual, internal research rather than automated scraping of
        competitor websites, while we complete a legal review of target sites&apos; terms of service. This is a
        deliberate, temporary limitation, not a defect, and it is disclosed here so it is not silently forgotten.
        Automated collection is a planned backend change once that review clears it. Full Vault-specific terms are
        in our <Link href="/legal/tool-tos">Tool ToS &amp; Data-Processing Addendum</Link>.
      </p>

      <h2>9. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use Blue Diamond Cre8tive for any unlawful purpose or in violation of any applicable law</li>
        <li>Attempt to gain unauthorised access to any part of our systems or other accounts</li>
        <li>Reverse-engineer, decompile, or attempt to extract our underlying models, templates, or source code</li>
        <li>Resell, sublicense, or redistribute any deliverable, Vault data, or Academy product beyond the licence granted to you</li>
        <li>Use automated means to scrape, extract, or bulk-download content from our site or the Vault beyond normal use</li>
      </ul>
      <p>We may suspend or terminate your access for breach of this section.</p>

      <h2>10. Intellectual Property</h2>
      <p>
        Blue Diamond Cre8tive, including its software, design, branding, and underlying technology, is owned by Blue
        Diamond Capital Ltd and protected by applicable intellectual property law. These Terms do not grant you any
        right to our intellectual property beyond the limited right to use the platform and products as intended.
      </p>
      <p>
        These rights are enforceable under the laws of the Republic of Mauritius, including the Industrial Property
        Act 2019 and applicable copyright legislation, and, where infringement occurs outside Mauritius, under the
        intellectual property laws of the relevant jurisdiction.
      </p>

      <h2>11. AI Output and Professional Advice</h2>
      <p>
        Blue Diamond Cre8tive uses artificial intelligence in its production process for content, campaigns, and
        competitor research. The limitations of that AI, the professional-advice exclusion, and your indemnity and
        liability obligations are set out in full in our Disclaimer &amp; Indemnity, which forms part of these
        Terms.
      </p>

      <h2>12. Suspension and Termination</h2>
      <p>
        We may suspend or terminate your access, with or without notice, for breach of these Terms, non-payment, or
        conduct that we reasonably believe harms us, other clients, or third parties. You may terminate your account
        at any time in accordance with our Refund &amp; Cancellation Policy.
      </p>

      <h2>13. Service Availability</h2>
      <p>
        We aim to keep our site and any client platform available at all times but do not guarantee uninterrupted or
        error-free service. We may modify, suspend, or discontinue any part of the platform at our discretion, with
        reasonable notice where practicable.
      </p>

      <h2>14. Limitation of Liability</h2>
      <p>
        Our liability to you is limited as set out in our Disclaimer &amp; Indemnity, including the aggregate
        liability cap described there. Nothing in these Terms excludes liability that cannot be excluded under
        applicable law.
      </p>

      <h2>15. Changes to These Terms</h2>
      <p>
        We reserve the right to update or amend these Terms at any time. Minor or non-material changes may be made
        without prior notice, and it is your responsibility to review these Terms regularly. Where a change is
        material, we will make reasonable efforts to notify you by email. Continued use of Blue Diamond Cre8tive
        after any change takes effect constitutes your acceptance of the updated Terms.
      </p>

      <h2>16. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the Republic of Mauritius. Any dispute arising from these Terms is
        subject to the exclusive jurisdiction of the courts of Mauritius, without prejudice to any mandatory
        consumer protection rights you may hold under the laws of your country of residence.
      </p>

      <h2>17. Contact</h2>
      <p>Questions about these Terms: <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a></p>
    </LegalPageShell>
  );
}
