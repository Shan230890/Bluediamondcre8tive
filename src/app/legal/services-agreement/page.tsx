import type { Metadata } from "next";
import { LegalPageShell } from "@/components/LegalPageShell";

export const metadata: Metadata = { title: "Client Services Agreement — Blue Diamond Cre8tive" };

export default function ServicesAgreementPage() {
  return (
    <LegalPageShell title="Client Services Agreement" lastUpdated="August 2026">
      <p>
        This Client Services Agreement (&quot;Agreement&quot;) applies to every marketing services engagement
        between you (&quot;Client&quot;) and Blue Diamond Capital Ltd, trading as Blue Diamond Cre8tive
        (&quot;Cre8tive&quot;), a company incorporated in the Republic of Mauritius. It supplements, and does not
        replace, our general Terms of Service.
      </p>

      <h2>1. Scope of Engagement</h2>
      <p>
        The specific work covered by your engagement is defined by your selected tier (Starter, Growth, or
        Signature) as described on our services page, and any written scope confirmation we send you at the start of
        your engagement. Work outside that scope is treated as a change request under section 5.
      </p>

      <h2>2. Fulfilment Model</h2>
      <p>
        Cre8tive fulfils engagements through an AI-assisted production pipeline reviewed by our human team. A
        strategy lead scopes and directs each engagement; copy, design, and campaign production move through our
        pipeline; and every deliverable is reviewed by a member of our team before it reaches you. Nothing in this
        Agreement guarantees a specific marketing outcome, engagement level, or revenue result.
      </p>

      <h2>3. Client Responsibilities</h2>
      <p>You agree to:</p>
      <ul>
        <li>Provide brand assets, access, and information reasonably needed to deliver the engagement</li>
        <li>Respond to review requests and approvals within a reasonable time, since delayed feedback delays delivery</li>
        <li>Ensure any material you provide us does not infringe a third party&apos;s rights</li>
        <li>Review and approve deliverables before they are published, since final publishing decisions remain yours</li>
      </ul>

      <h2>4. Deliverable Ownership</h2>
      <p>
        Deliverables produced specifically for you under a paid engagement become your property upon full payment
        for the billing period in which they were produced. Cre8tive retains ownership of its internal processes,
        templates, and any pre-existing intellectual property used to produce your deliverables, and may reuse
        general techniques and non-confidential learnings across other client engagements.
      </p>

      <h2>5. Change Requests and Out-of-Scope Work</h2>
      <p>
        Work outside your tier&apos;s defined scope, including rush turnaround requests, is billed separately or
        deferred to the next billing period at our discretion, and we will confirm cost or timing with you before
        proceeding.
      </p>

      <h2>6. Confidentiality</h2>
      <p>
        We treat your brand strategy, brief materials, and any non-public business information you share with us as
        confidential, and will not disclose it to third parties except as needed to deliver your engagement (for
        example, to our AI provider, on the terms in our Privacy Policy) or as required by law.
      </p>

      <h2>7. Term and Termination</h2>
      <p>
        This Agreement runs for as long as your subscription is active. Either party may terminate in accordance
        with our Refund &amp; Cancellation Policy. Termination does not affect deliverables already paid for and
        delivered.
      </p>

      <h2>8. Liability</h2>
      <p>
        Our liability under this Agreement is governed by our Disclaimer &amp; Indemnity, including the aggregate
        liability cap described there.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        This Agreement is governed by the laws of the Republic of Mauritius. Any dispute arising from this Agreement
        is subject to the exclusive jurisdiction of the courts of Mauritius.
      </p>

      <h2>10. Contact</h2>
      <p>Questions about an active engagement: <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a></p>
    </LegalPageShell>
  );
}
