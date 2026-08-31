import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend";

/**
 * Vercel Cron — see vercel.json ("0 9 * * 1", every Monday). Sends a
 * reminder to the admin nudging them to log this week's competitor scan.
 * Does not create any vault entries itself — entries stay manual by
 * design (see README.md "Competitor Intelligence Vault — legal note").
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("[vault-weekly-reminder] ADMIN_EMAIL not set — skipping reminder");
    return NextResponse.json({ sent: false, reason: "ADMIN_EMAIL not configured" });
  }

  const result = await sendEmail({
    to: adminEmail,
    subject: "Weekly Competitor Vault scan is due",
    html: "<p>Time to log this week's Competitor Intelligence Vault scan for each tracked client. Add entries from the dashboard's Vault page.</p>",
  });

  return NextResponse.json(result);
}
