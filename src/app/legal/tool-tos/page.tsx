import type { Metadata } from "next";
import { LegalPageShell } from "@/components/LegalPageShell";

export const metadata: Metadata = { title: "Tool ToS & Data-Processing Addendum — Blue Diamond Cre8tive" };

export default function ToolTosPage() {
  return (
    <LegalPageShell title="Tool ToS & Data-Processing Addendum" lastUpdated="August 2026">
      <p>
        This document applies to your subscription to the Competitor Intelligence Vault (&quot;the Vault&quot;),
        operated by Blue Diamond Capital Ltd, trading as Blue Diamond Cre8tive (&quot;Cre8tive&quot;), a company
        incorporated in the Republic of Mauritius. It supplements, and does not replace, our general Terms of
        Service.
      </p>

      <h2>Part 1: Tool Terms of Service</h2>

      <h3>1.1 What the Vault Does</h3>
      <p>
        The Vault logs a weekly scan of competitor pricing, positioning, and content moves, and rolls each month
        into a white-space review. Entries and reviews are visible to you inside your account, gated by your tier&apos;s
        competitor-tracking limit (1 for Starter, 5 for Pro, unlimited for Agency).
      </p>

      <h3>1.2 Legal Guardrail on Data Sourcing</h3>
      <p>
        Automated scraping of competitor websites raises an unresolved legal question: target sites&apos; terms of
        service may prohibit it, and that review has not yet been completed. Vault entries are currently sourced
        from manual, internal research rather than live scraping, until our legal review clears automated
        collection. This is disclosed here so it is not silently forgotten. We will notify subscribers before
        switching any entries to an automated collection method.
      </p>

      <h3>1.3 Accuracy of Vault Data</h3>
      <p>
        Vault entries reflect research available to us at the time of entry, and are provided for informational and
        decision-support purposes only. They are not a guarantee of a competitor&apos;s actual pricing, strategy, or
        intent. See our Disclaimer &amp; Indemnity for the full AI-liability disclaimer, which applies equally to
        Vault output.
      </p>

      <h3>1.4 Acceptable Use of the Vault</h3>
      <p>You agree not to use Vault data to harass, defame, or make unverified public claims about a named competitor, and not to redistribute Vault data outside the white-label export feature included in your tier, where applicable.</p>

      <h3>1.5 Tier Changes</h3>
      <p>Downgrading your tier may require removing tracked competitors above your new tier&apos;s limit. Historical entries for removed competitors remain accessible for reference but are no longer updated.</p>

      <h2>Part 2: Data-Processing Addendum</h2>
      <p>This Part applies where you submit or we process personal data on your behalf in connection with your Vault subscription (for example, where a competitor entry references an identifiable individual).</p>

      <h3>2.1 Roles</h3>
      <p>For data you submit to the Vault, Cre8tive acts as a data processor on your behalf and you act as the data controller, except where Cre8tive independently determines the purpose of processing, in which case Cre8tive acts as controller for that processing (for example, entries we generate ourselves for internal research purposes).</p>

      <h3>2.2 Processing Instructions</h3>
      <p>Cre8tive processes data submitted to the Vault only to provide the Vault service to you, and in accordance with your instructions as reflected in your use of the platform.</p>

      <h3>2.3 Subprocessors</h3>
      <p>Cre8tive uses the cloud infrastructure and AI providers listed in our Privacy Policy to operate the Vault. These subprocessors are bound by confidentiality and data-protection obligations consistent with this Addendum.</p>

      <h3>2.4 Security</h3>
      <p>Cre8tive applies the technical and organisational measures described in our Privacy Policy, including access control scoped to your account, to protect data processed through the Vault.</p>

      <h3>2.5 Data Subject Requests</h3>
      <p>If you receive a data subject request relating to data held in your Vault account, contact us at <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a> and we will assist you in responding within a reasonable time.</p>

      <h3>2.6 International Transfers</h3>
      <p>Data processed through the Vault may be transferred and stored outside your country of residence, on the terms described in our Privacy Policy.</p>

      <h2>3. Governing Law</h2>
      <p>This document is governed by the laws of the Republic of Mauritius. Any dispute arising from it is subject to the exclusive jurisdiction of the courts of Mauritius.</p>

      <h2>4. Contact</h2>
      <p>Questions about the Vault or this Addendum: <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a></p>
    </LegalPageShell>
  );
}
