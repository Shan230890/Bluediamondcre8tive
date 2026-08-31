import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Placeholder contact endpoint. Stripe/checkout is paused and Resend isn't
 * wired up yet (RESEND_API_KEY is blank until a later phase), so this just
 * validates the payload and logs it server-side. Swap in Resend once the
 * key is set.
 */
const ContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  company: z.string().max(200).optional(),
  message: z.string().min(1).max(4000),
  interest: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission.", issues: parsed.error.flatten() }, { status: 400 });
  }

  // TODO(phase 2): send via Resend once RESEND_API_KEY is set, and persist
  // the inquiry so it shows up somewhere the team actually looks.
  console.log("[contact] new inquiry", parsed.data);

  return NextResponse.json({ ok: true });
}
