import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { aggregateMonthlyReview, type WeeklyScanRow } from "@/lib/vault/aggregate-monthly-review";

/**
 * Vercel Cron — see vercel.json ("0 4 1 * *", monthly on the 1st).
 * For each distinct client_id + competitor_name pair with weekly_scan
 * entries created in the current month, aggregates them into one draft
 * monthly_review row. Deterministic string concatenation only — no LLM
 * call, so aggregateMonthlyReview() is a pure function unit tests can hit
 * directly (src/lib/vault/aggregate-monthly-review.ts).
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();

  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

  const { data: scans, error } = await db
    .from("competitor_vault_entries")
    .select("id, client_id, competitor_name, content, white_space_notes, created_at")
    .eq("entry_type", "weekly_scan")
    .gte("created_at", monthStart);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type ScanRow = { client_id: string | null; competitor_name: string } & WeeklyScanRow;
  const groups = new Map<string, ScanRow[]>();
  for (const row of (scans ?? []) as ScanRow[]) {
    if (!row.client_id) continue;
    const key = `${row.client_id}::${row.competitor_name}`;
    const list = groups.get(key) ?? [];
    list.push(row);
    groups.set(key, list);
  }

  let created = 0;
  const failures: string[] = [];

  for (const [key, rows] of groups) {
    const [clientId, competitorName] = key.split("::");
    const draft = aggregateMonthlyReview(rows);
    if (!draft.content && !draft.white_space_notes) continue;

    const { error: insertError } = await db.from("competitor_vault_entries").insert({
      client_id: clientId,
      competitor_name: competitorName,
      entry_type: "monthly_review",
      content: draft.content,
      white_space_notes: draft.white_space_notes,
    });

    if (insertError) {
      failures.push(`${key}: ${insertError.message}`);
    } else {
      created += 1;
    }
  }

  return NextResponse.json({ groups: groups.size, created, failures });
}
