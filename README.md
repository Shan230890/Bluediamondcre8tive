# Blue Diamond Cre8tive

Next.js + Supabase platform for Blue Diamond Cre8tive — marketing site, legal suite, client dashboard, and AI team chat.

## Competitor Intelligence Vault — legal note

The Competitor Intelligence Vault (Silo 2, `competitor_vault_entries` table) is populated by
**manual entry only** — through the admin-entry form on `src/app/dashboard/vault/page.tsx` — and
by the `vault-monthly-review` cron job, which aggregates existing manual weekly-scan rows (no
scraping of its own). Nothing in this codebase scrapes competitor websites automatically.

This is by design, not an oversight: automated scraping of competitor sites has an unresolved
legal question — a target site's Terms of Service may prohibit it — pending review from Harvey
(legal). Do not wire the Vault up to a live scraper, browser automation, or any automated
collection method before that review clears. See the guardrail comment in
`supabase/migrations/0001_init.sql` and the on-page note in the Vault dashboard for the same rule.

## Development

```bash
npm install
npm run dev
npm run lint
npm run build
npm run test
```

## Cron jobs

Defined in `vercel.json`, guarded by the `CRON_SECRET` env var (checked via the `Authorization:
Bearer <CRON_SECRET>` header):

- `/api/jobs/vault-monthly-review` — monthly, aggregates the month's weekly-scan entries into a
  draft monthly review per client/competitor.
- `/api/jobs/vault-weekly-reminder` — weekly, emails the admin (`ADMIN_EMAIL`) a nudge to log
  that week's scan. Sends nothing if `ADMIN_EMAIL` or `RESEND_API_KEY` isn't set.

## Deployment

Deploys are a manual `vercel --prod` run — not triggered by CI or by pushing to GitHub.
