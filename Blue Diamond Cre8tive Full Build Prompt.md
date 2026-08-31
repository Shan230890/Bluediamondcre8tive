# Blue Diamond Cre8tive — Full Build Prompt (for Claude Code)

This reflects Master Plan v2 (locked). **Build everything below now, in one pass — no phase-gating.** The only thing explicitly out of scope is Silo 4, the faceless YouTube channel, which is paused indefinitely. Every other silo, the full dashboard, and the full legal suite ship together.

## Context

Blue Diamond Cre8tive is an AI-native digital marketing agency platform: a Next.js site that is simultaneously the public marketing site (services, tools, courses, pricing) and the authenticated client platform (dashboard with invoices, deliverables, and an in-app AI marketing team). It runs on the exact same stack and build protocol as an existing sibling project called Opsara — treat Opsara's shipped code as the structural template, not something to redesign from scratch, while every visual and copy element is Blue Diamond Cre8tive's own.

**Brand line, use verbatim wherever attribution appears (footer, legal pages, meta):**
> Blue Diamond Cre8tive, licensed by Blue Diamond Capital Ltd · Mauritius · Powered by One Hub Automation.

**Build all four active silos now:**
1. AI-native marketing services for busy clients (personal & business brands) — full site + full client dashboard
2. AI-built tools & apps for marketing/analytics — Competitor Intelligence Vault, built and sold, not just scaffolded
3. AI-built courses, e-books, templates — full three-tier academy, purchasable, not just a landing page
4. Self-marketing — Cre8tive's own site/case-studies, held to the same standard as a paying client's top-tier deliverable

**Explicitly excluded:** Silo "4" as originally numbered — the AI-powered faceless YouTube channel. Do not build a `/channel` route, do not model channel content in the data layer, do not reference it anywhere in copy or navigation. It's paused, not deferred-with-a-placeholder — leave no trace of it in this build.

## Tech Stack — Match Opsara Exactly

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Tailwind CSS 4**
- **Supabase** — `@supabase/supabase-js` + `@supabase/ssr` for auth (cookie-based SSR sessions), Postgres for data, migrations under `supabase/migrations/`
- **Vercel** for deploy, with `vercel.json` cron entries for scheduled jobs (Competitor Intelligence Vault weekly scan + monthly review, see below)
- **Resend** for transactional email (signup confirmation, invoice notifications, purchase receipts)
- **Zod** for all input validation
- **lucide-react** for icons
- ESLint + the project's existing `eslint.config.mjs` pattern; ship nothing that fails lint
- ONE Next.js app, ONE repo, ONE deploy — marketing site and authenticated dashboard live in the same `src/app/` tree, gated by `middleware.ts`, exactly like Opsara. Do not scaffold a separate site for the dashboard.
- Payment processing: Stripe (or Shan's preferred processor — confirm before building checkout) is required now, since Silo 2 and Silo 3 are meant to be actually purchasable in this build, not just priced on a page.

Confirm you're working against the already-created GitHub, Vercel, and Supabase projects for Blue Diamond Cre8tive (Shan has already created all three) — do not create new ones. Ask Shan for the repo URL, Supabase project ref/keys, and payment processor keys before writing `.env.local`.

## Design System — Pattern E "Cre8tive Signature" (Locked, Do Not Substitute)

Do not use any of Blue Diamond Cre8tive's sibling projects' other design patterns (dark-luxury gold, warm-cream/maroon, navy executive-doc, or the achromatic SaaS palette) — this project has its own locked palette and font, below, full stop.

**CSS variables** (scope under a single wrapper class the way Opsara scopes `landing-v8.css`, so nothing leaks into the dashboard theme or vice versa):

```css
--bg: #e9e9e9;          /* preferred background */
--accent: #f7652d;      /* main accent */
--accent-rgb: 247, 101, 45;  /* companion for every rgba() glow — never hardcode a separate rgba value */
--accent-2: #527799;    /* secondary accent, steel */
--accent-3: #333333;    /* secondary accent, charcoal */
--dark: #101820;        /* dark background / table-heading background */
--dark-2: #0f2437;      /* dark alt */
--text-dark: #000000;
--text-light: #ffffff;
```

**Typography:** Load **Inter** from Google Fonts (`font-display: swap`) as the production body/display font — it is the closest free match to Aptos (both are screen-first, neutral, high-x-height humanist sans-serifs; Aptos itself has no licensable webfont distribution). Font stack so a visitor with true Aptos installed locally still sees it:

```css
font-family: "Inter", "Aptos", -apple-system, "Segoe UI", system-ui, sans-serif;
```

Two weights minimum: 400 (body) and 600–700 (headings/buttons). No second display font — Inter does both jobs.

**Motion tier: Restrained.** Ambient single hero glow (`radial-gradient` + `blur(80px)`, ~7s breathing loop, colour sourced only from `--accent-rgb`), subtle logo micro-motion if a logo mark exists, entrance fades via `IntersectionObserver` (`opacity 0→1`, `translateY(22px)→0`, 0.7s), and a `prefers-reduced-motion` media query that kills all animation with one rule. No drifting orbs, no typewriter effects, no broadcast-rings — those belong to a different pattern, not this one.

**Nav:** sticky, frosted-glass (`background: rgba(255,255,255,0.8); backdrop-filter: saturate(1.8) blur(20px);`), mobile collapses to a hamburger below 640px that expands as a full-width dropdown (not a slide-in drawer).

**Sections alternate background colour** — never two same-colour sections in a row. Cards lift `translateY(-4px)` on hover on marketing pages; dashboard cards use glow-shadow only, no movement (same split Opsara's `TiltCard` component implements — reuse that pattern, restyled to Pattern E).

**Performance bar, non-negotiable:** sub-2.5s LCP, under 500KB excluding images, Lighthouse mobile > 90.

## Site Map to Build (Complete)

```
/                      — home: hero, 4-silo overview, social proof, single primary CTA
/services              — Silo 1: marketing services for clients, tier cards, inquiry/signup flow
/tools                 — Silo 2: Competitor Intelligence Vault product page, tiers, purchase flow
/tools/vault           — the actual Vault product experience (see below)
/academy               — Silo 3: courses/templates catalogue, three-tier ladder, purchase flow
/academy/[slug]        — individual course/template product + checkout
/work                  — Silo 4 (self-marketing): Cre8tive's own case studies / results
/pricing               — canonical pricing page, all tiers from every silo in one place
/login, /signup        — Supabase auth
/dashboard             — authenticated client platform (full scope below)
/terms, /privacy, /disclaimer, /refund-cancellation — legal suite (full scope below)
```

No `/channel` route. No YouTube references anywhere in nav, footer, or copy.

## Dashboard — Full Scope, Build All of It Now

Authenticated area behind `middleware.ts` Supabase session check. Must include:

1. **Login/session management** — Supabase `@supabase/ssr` auth, standard email/password (add magic-link if trivial).
2. **Invoices** — list of the client's invoices (status: paid/due/overdue), amounts, dates, tied to real purchases/subscriptions where Stripe (or chosen processor) is wired up.
3. **Deliverables** — list of what the client has received (content calendars, campaign assets, reports) with download/view links to files stored in Supabase Storage.
4. **Tool access** — clients who've purchased a Competitor Intelligence Vault tier see their Vault data (tracked competitors, weekly scans, monthly reviews) inside the dashboard, gated by their tier's limits (1 competitor / 5 / unlimited).
5. **Course/template access** — clients who've purchased Academy products see their purchased content library here.
6. **In-platform AI marketing team** — the client-facing product-team personas: **Henry 📣 (CMO/strategy), Harvey ⚖️ (Legal), Ray 📝 (Copywriter), Anna 🎨 (Graphic Designer), Scott 🎙️ (Video/Podcast), Barry 🖥️ (App/Web/Coder).** Build a "Your Cre8tive Team" section: persona picker (name, emoji, role, one-line description pulled from each agent's `IDENTITY.md`) routing to a chat or request-intake flow per persona. This is the mechanism the Silo 1 pricing tiers are sold on — build it as a real feature, not a placeholder. **Do not include a "Max/CFO" persona** — deliberately removed from the client-facing roster.

Full persona copy (identity, voice, non-negotiables) for all six product-team agents is in the project's `agents/<name>/IDENTITY.md` and `SOUL.md` files — read them and use them as the actual copy source, don't invent new descriptions.

## Legal Suite — Full Build

Structure mirrors the sibling Opsara project's legal-page-shell pattern exactly: centered `max-w-3xl` column, back-to-home link top and bottom, `<h1>` + attribution line + "Last updated" date, plain-prose body, footer disclaimer block.

**Attribution line, use verbatim on every legal page and in the site footer:**
> Blue Diamond Cre8tive, licensed by Blue Diamond Capital Ltd · Mauritius · Powered by One Hub Automation.

**AI-liability disclaimer, use verbatim:**
> Blue Diamond Cre8tive's outputs are provided for informational and decision-support purposes only. Artificial intelligence can make errors. Always verify with a qualified professional before taking action.

Four pages, all fully written (not placeholder Lorem ipsum): Terms of Service (cross-links Disclaimer/Refund/Privacy at the top, states which governs in conflict), Privacy Policy, Disclaimer & Indemnity, Refund & Cancellation (distinct terms for services vs. digital products vs. subscriptions — three different policies, not one generic page).

Jurisdiction: **Mauritius**, stated explicitly wherever jurisdiction matters.

Client services agreement, tool ToS + data-processing addendum, and course/template licence terms should exist as real documents (linked from checkout flows), not just referenced.

## Pricing (Confirmed, Build These Tiers as Real, Purchasable Products)

**Silo 1 — Services (`/services`, `/pricing`):**

| Tier | Price | Includes |
|---|---|---|
| Starter | $697–$997/mo | Social content calendar + copy + design, monthly report |
| Growth | $1,997–$2,997/mo | + campaigns, email, landing pages, quarterly strategy session |
| Signature | $5,000+/mo, limited seats | Fractional-CMO engagement, full team output, priority turnaround |

**Silo 2 — Tools (`/tools`, Competitor Intelligence Vault):**

| Tier | Price | Includes |
|---|---|---|
| Starter | $49/mo | 1 competitor tracked |
| Pro | $99/mo | 5 competitors, alerts |
| Agency | $249/mo | Unlimited competitors, white-label report export |

**Silo 3 — Academy (`/academy`):**

| Tier | Price | Includes |
|---|---|---|
| Entry | $97–$197 | Template packs / mini-course |
| Flagship | ~$497 | Full course |
| Premium | $1,497–$4,997 | Cohort or 1:1 feedback |

## Data Model (Supabase) — Full Schema

- `profiles` (extends `auth.users`) — name, company, created_at
- `subscriptions` — client_id, silo (`services` | `vault`), tier, status, current_period_end
- `invoices` — client_id, amount, status, due_date, created_at
- `deliverables` — client_id, title, type, file_url (Supabase Storage), created_at
- `academy_products` — slug, title, tier (`entry`|`flagship`|`premium`), price, description
- `academy_purchases` — client_id, product_id, purchased_at
- `competitor_vault_entries` — client_id (nullable for internal-only entries), competitor_name, entry_type (`weekly_scan` | `monthly_review`), content, white_space_notes, created_at
- RLS policies on every table so a client only ever sees their own rows; Vault entries scoped by the client's tier limits

## Competitor Intelligence Vault — Build the Cadence, With a Real Legal Guardrail

Two jobs, both required:
1. **Weekly scan** — Vercel Cron job that logs lightweight competitor moves (pricing/positioning/content changes) into `competitor_vault_entries` with `entry_type = 'weekly_scan'`.
2. **Monthly deep review** — a second cron (or admin-triggered action) that aggregates the month's weekly scans into a white-space analysis, `entry_type = 'monthly_review'`.

**Important, do not skip this:** automated scraping of competitor websites has an unresolved legal question — target sites' ToS may prohibit it, and that review has not happened yet. Build the Vault's data model, cron scaffolding, and UI fully now, but **source the weekly-scan content from manual/internal entry (an admin form) rather than live scraping** until Harvey/Rebecca's legal review clears automated collection. Ship the feature complete and sellable on that basis; swap in automated scraping later as a backend change once legal clears it. Say this explicitly in a README note or code comment so it isn't silently forgotten.

## Non-Negotiables

1. No production code without tests.
2. No deployment without CI/CD.
3. No manual process that could be automated (except the Vault scraping guardrail above, which is a deliberate, temporary, legally-motivated exception).
4. No shortcuts that create technical debt — simplest solution that actually works, not the cleverest one.
5. Mobile-first — design at 375px, then expand; nav never wraps at 375px.
6. Every accent glow/shadow derives from `--accent-rgb` — never a separately hardcoded `rgba()`.
7. `prefers-reduced-motion` always respected.
8. WCAG AA contrast (4.5:1 body text minimum).
9. Zero YouTube-channel references anywhere in the build.

## Before You Start — Confirm, Don't Guess

1. Confirm the actual GitHub repo URL, Supabase project ref, and payment-processor keys with Shan before running any setup commands.
2. Confirm whether Cre8tive already has a logo/wordmark ready to use (there's a `Blue Diamond Cre8tive Logo` folder in the project) or whether Anna's persona should be asked to produce one first.
3. Confirm the payment processor (Stripe assumed above) before wiring checkout.
4. If anything in this prompt conflicts with what you find in the actual repo state, stop and flag it rather than overwriting silently.

Build everything above in this pass. Nothing here is deferred to a later phase except the YouTube channel, which stays paused.
