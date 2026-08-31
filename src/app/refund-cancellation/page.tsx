import type { Metadata } from "next";
import { LegalPageShell } from "@/components/LegalPageShell";

export const metadata: Metadata = { title: "Refund & Cancellation Policy — Blue Diamond Cre8tive" };

export default function RefundCancellationPage() {
  return (
    <LegalPageShell title="Refund & Cancellation Policy" lastUpdated="August 2026">
      <p>
        Blue Diamond Cre8tive operates three distinct product lines, and each carries its own refund and
        cancellation treatment, set out separately below. Read the section that applies to what you have purchased
        or engaged.
      </p>

      <h2>A. Marketing Services (Silo 1 subscriptions)</h2>
      <p>This section governs Starter, Growth, and Signature marketing services engagements.</p>

      <h3>A1. Cancel Anytime</h3>
      <p>
        You may cancel your services subscription at any time by emailing{" "}
        <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a>. Cancellation takes effect
        at the end of your current billing period. You retain access to your tier&apos;s deliverables until that
        date.
      </p>

      <h3>A2. No Refunds for Billed Periods</h3>
      <p>
        We do not offer refunds for a billing period already paid, once production has started for that period.
        Once a billing period has started, it is non-refundable, regardless of how much of that period&apos;s output
        has been used or delivered.
      </p>

      <h3>A3. Signature Tier Seats</h3>
      <p>
        Signature tier is offered on limited seats. Cancelling forfeits your seat, and resubscribing later is subject
        to seat availability and current pricing at the time of resubscription.
      </p>

      <h3>A4. Upgrades and Downgrades</h3>
      <p>You may change your tier at any time, effective the next billing period. Standard subscription terms apply to both upgrades and downgrades.</p>

      <h2>B. Academy Digital Products (Silo 3)</h2>
      <p>This section governs Entry, Flagship, and Premium Academy purchases: template packs, courses, and cohorts.</p>

      <h3>B1. Digital Products Are Sold As-Is Once Delivered</h3>
      <p>
        Because template packs and course content are delivered electronically and are immediately accessible upon
        purchase, we do not offer refunds once access has been granted, except where required by applicable
        consumer-protection law or as set out below.
      </p>

      <h3>B2. Cohort and 1:1 Premium Products</h3>
      <p>
        Premium tier cohorts with a fixed start date may be cancelled for a full refund up to seven days before the
        cohort start date. Cancellations within seven days of the start date, or after the cohort has begun, are not
        refundable, as your seat holds a place in a small group.
      </p>

      <h3>B3. Faulty or Undelivered Access</h3>
      <p>
        If you paid for an Academy product and did not receive working access, contact us at{" "}
        <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a> immediately and we will
        resolve access issues or refund you in full.
      </p>

      <h2>C. Tool Subscriptions (Silo 2, Competitor Intelligence Vault)</h2>
      <p>This section governs Starter, Pro, and Agency Vault subscriptions.</p>

      <h3>C1. Cancel Anytime</h3>
      <p>
        You may cancel your Vault subscription at any time by emailing{" "}
        <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a>. Cancellation takes effect
        at the end of your current billing period, and you retain access to your tracked competitors and existing
        Vault entries until that date.
      </p>

      <h3>C2. No Refunds for Billed Periods</h3>
      <p>We do not offer refunds for a Vault billing period already paid. Once a billing period has started, it is non-refundable, regardless of usage.</p>

      <h3>C3. Tier Limits</h3>
      <p>
        Each Vault tier carries a competitor-tracking limit (1 for Starter, 5 for Pro, unlimited for Agency).
        Downgrading to a lower tier may require you to remove tracked competitors above the new tier&apos;s limit.
        No refund is due for entries generated before a downgrade takes effect.
      </p>

      <h2>D. Terms Common to All Three</h2>

      <h3>D1. Termination for Breach</h3>
      <p>We reserve the right to suspend or terminate access for breach of our Terms of Service. No refund is due in such cases.</p>

      <h3>D2. Payment Processing</h3>
      <p>
        Payment processing is not yet live on our site. Once it is, payments will be processed by our third-party
        payment provider, and we will not store your card details. Any payment disputes should first be raised with
        us directly at <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a> before
        contacting your card issuer.
      </p>

      <h3>D3. Changes to This Policy</h3>
      <p>
        We reserve the right to update or amend this Policy at any time. Minor or non-material changes may be made
        without prior notice, and it is your responsibility to review this Policy regularly. Where a change is
        material, we will make reasonable efforts to notify you by email. Continued use of Blue Diamond Cre8tive
        after any change takes effect constitutes your acceptance of the updated Policy.
      </p>

      <h3>D4. Governing Law</h3>
      <p>
        This policy is governed by the laws of the Republic of Mauritius. Any dispute arising from this policy will
        be subject to the exclusive jurisdiction of the courts of Mauritius, without prejudice to any mandatory
        consumer protection rights you may hold under the laws of your country of residence.
      </p>

      <h3>D5. Contact</h3>
      <p>Questions about billing or cancellation: <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a></p>
    </LegalPageShell>
  );
}
