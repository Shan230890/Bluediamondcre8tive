import { Resend } from "resend";

export function hasResendKey(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/** Guards gracefully when RESEND_API_KEY isn't configured yet — logs instead of throwing. */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean; reason?: string }> {
  if (!hasResendKey()) {
    console.warn(`[email] RESEND_API_KEY not set — skipping send to ${to}: "${subject}"`);
    return { sent: false, reason: "RESEND_API_KEY not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL ?? "Blue Diamond Cre8tive <notifications@bluediamondcre8tive.com>";

  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) return { sent: false, reason: error.message };
  return { sent: true };
}
