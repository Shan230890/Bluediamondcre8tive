import type { Metadata } from "next";
import { LegalPageShell } from "@/components/LegalPageShell";

export const metadata: Metadata = { title: "Privacy Policy — Blue Diamond Cre8tive" };

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated="August 2026">
      <p>
        Blue Diamond Cre8tive is operated by Blue Diamond Capital Ltd, a company incorporated in the Republic of
        Mauritius (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). This policy explains what personal information
        we collect, why, and how we protect it, in accordance with the Mauritius Data Protection Act 2017 and, where
        you are located elsewhere, any data protection law that applies to you (such as the EU/UK GDPR or South
        Africa&apos;s POPIA).
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Account information: name, email address, company name</li>
        <li>Inquiry and brief information you submit through our contact form, including your marketing goals and business details</li>
        <li>Brand assets, content, and data you provide us for a services engagement</li>
        <li>Competitor names and related research you or we enter into the Competitor Intelligence Vault</li>
        <li>Purchase history for Academy products and Vault subscriptions</li>
        <li>Usage data: page views, feature usage, login activity</li>
        <li>Billing information: name and billing address. We do not collect or store your card details; card payments, once live, will be processed directly by our payment provider via their secure, PCI-compliant systems</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide and operate Blue Diamond Cre8tive&apos;s services, Vault, and Academy</li>
        <li>To generate AI-assisted drafts for our team&apos;s review during a services engagement</li>
        <li>To process billing and manage your subscription, once payment processing is live</li>
        <li>To communicate with you about your account, service updates, and support requests</li>
        <li>To improve the accuracy of our AI-assisted process and the platform generally, on the terms set out below</li>
      </ul>

      <h3>2.1 Your data, and how we improve our process</h3>
      <p>
        Everything you provide us is confidential to your account. We use anonymous, structural patterns across
        clients (for example, that a certain content format tends to perform better for a given industry) to
        improve our process. Your specific documents, brand names, competitor research, and personal data are never
        exposed to another client, and we do not give your data to any third-party AI provider to train their
        models.
      </p>
      <p>
        This is part of how the service works and is not separately optional. If you have a specific concern about a
        particular document or dataset, contact us at{" "}
        <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a> before sending it.
      </p>
      <p>Our lawful basis for this processing is your consent, given by accepting our Terms of Service, together with our legitimate interest in improving the service.</p>

      <h2>3. Third-Party Service Providers</h2>
      <p>We use the following third-party providers. Each processes data solely to deliver their respective service:</p>
      <ul>
        <li>Cloud infrastructure providers, for database hosting, application hosting, authentication, and secure storage</li>
        <li>Email service providers, for transactional email delivery and inquiry notifications</li>
        <li>A payment provider, for payment processing once checkout is live. We will never have access to your full card number</li>
        <li>Our AI provider, which processes data solely to generate the AI-assisted drafts our team reviews</li>
      </ul>
      <p>
        We do not name individual infrastructure vendors in this policy as a matter of operational security. Details
        of any specific subprocessor are available on reasonable request to{" "}
        <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a>.
      </p>

      <h2>4. International Data Transfers</h2>
      <p>
        As a Mauritius-incorporated company serving clients globally, your data may be processed and stored on
        servers located outside your country of residence. We take appropriate steps to ensure any such transfer is
        subject to safeguards consistent with the Mauritius Data Protection Act 2017 and, where applicable, the data
        protection law of your own jurisdiction.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain your account and engagement data for as long as your account is active or you have a live
        subscription. Following cancellation, data is retained for a limited period to allow reactivation, after
        which it is deleted, unless we are required to retain it longer by law.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        Subject to applicable law, you have the right to access, correct, or request deletion of your personal
        information, and to object to certain processing. Depending on where you are located, you may also have the
        right to lodge a complaint with your local data protection authority if you believe your personal
        information has been processed unlawfully. To exercise any of these rights, contact us at{" "}
        <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a>.
      </p>

      <h2>7. Security</h2>
      <p>
        We apply appropriate technical and organisational measures, including encryption in transit and at rest, and
        access control scoped to your account, to protect your information against unauthorised access, loss, or
        misuse.
      </p>

      <h2>8. Governing Law</h2>
      <p>This policy is governed by the laws of the Republic of Mauritius, without prejudice to any mandatory data protection rights you hold under the law of your own jurisdiction.</p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We reserve the right to update or amend this Policy at any time. Minor or non-material changes may be made
        without prior notice, and it is your responsibility to review this Policy regularly. Where a change is
        material, we will make reasonable efforts to notify you by email. Continued use of Blue Diamond Cre8tive
        after any change takes effect constitutes your acceptance of the updated Policy.
      </p>

      <h2>10. Contact</h2>
      <p>For any privacy-related questions or requests: <a href="mailto:hello@bluediamondcre8tive.com">hello@bluediamondcre8tive.com</a></p>
    </LegalPageShell>
  );
}
