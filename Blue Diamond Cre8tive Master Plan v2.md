# Blue Diamond Cre8tive — Master Plan v2 (Corrected & Locked)

**Supersedes v1.** All 8 open decisions from v1 are now resolved, and one structural misunderstanding in v1 is corrected below. This version is the one to build from.

**Compass:** Automate income, scale output, reclaim time.
**Mission:** Make Blue Diamond Cre8tive a self-running empire of marketing intelligence — human-led, AI-native, and relentlessly useful.
**Brand:** Blue Diamond Cre8tive, licensed by **Blue Diamond Capital Ltd**, powered by **One Hub Automation**, Mauritius.

---

## 0. Correction — Two Teams, Not One

v1 ran the whole plan as if Max/Henry/Harvey/Ray/Anna/Scott/Barry were the agents doing the planning work. That conflated two separate things:

**The Builder Team — One Hub Automation.** Blue Diamond Cre8tive (the platform, the plan, the code) is being built *by* the existing OHA specialist roster — Barry 🖥️, Levana 🎨, Rebecca ⚖️, Max 💰, Raymond 📝, Scott 🎙️ — orchestrated through Claude, exactly as any other OHA project. Every "debate" and financial figure in this plan is properly OHA's team working *for* Shan, not Blue Diamond's own agents talking to themselves.

**The Product Team — Blue Diamond Cre8tive's own agents.** Henry 📣, Harvey ⚖️, Ray 📝, Anna 🎨, Scott 🎙️, and Barry 🖥️ are **a feature of the platform itself** — the in-app AI marketing team that Blue Diamond Cre8tive's *paying clients* get access to once they sign up. They are not Claude agents Shan invokes; they are product personas to design and build.

**Max is removed from the product roster.** A digital marketing agency's client-facing AI team doesn't need an in-app CFO — Max stays on the OHA builder side only, where he still advises on Cre8tive's own finances (Section 5).

Persona files for the product team live at `Blue Diamond Cre8tive/agents/<name>/IDENTITY.md` + `SOUL.md` in your project folder, updated to reflect this. Naming collision flagged and documented there: Blue Diamond's own Barry and Scott share names with two OHA builder specialists — coincidental, kept as-is, always disambiguated in writing.

---

## 1. Silo 4 (Faceless YouTube Channel) — Paused

Removed from active scope, not deleted from the roadmap. Every reference to it below reflects that: no `/channel` route, no channel line in the financial model, Scott's product-team brief no longer includes channel production. If reactivated later, the research and pricing logic from v1's Silo 4 section still holds and can be pulled back in — nothing about pausing it invalidates that work, it's just off the build list.

Active silos going forward:

1. AI-native marketing for busy clients (personal & business brands)
2. AI-built tools & apps for marketing/analytics
3. AI-built courses, e-books, templates (DIY skill hub)
4. Self-marketing via Cre8tive's own AI-native process

---

## 2. Platform & Tech Stack — Barry (OHA) 🖥️

Unchanged from v1, confirmed: **Next.js 16 (App Router) + React 19 + Tailwind 4, Supabase (Postgres + `@supabase/ssr` auth), deployed on Vercel**, Resend for email, Zod for validation, Vercel Cron for scheduled jobs. Landing page + platform = **one Next.js app, one repo, one deploy**, mirroring Opsara's `src/app/` structure exactly.

**Locked site map** (Silo 4 route removed, dashboard scope confirmed for Phase 1 per Section 8):

- `/` — home (hero, 4-silo overview, social proof, single primary CTA)
- `/services` — Silo 1: marketing services for clients
- `/tools` — Silo 2: AI-built tools & apps
- `/academy` — Silo 3: courses, e-books, templates
- `/work` — Silo 5's public face: Cre8tive's own case studies and results
- `/pricing` — canonical pricing page (tiers below)
- `/login`, `/signup`, `/dashboard` — the platform: full client portal (see Section 8) — login, invoices, deliverables, and access to the in-platform product-team agents (Henry, Harvey, Ray, Anna, Scott, Barry)
- `/terms`, `/privacy`, `/disclaimer`, `/refund-cancellation` — legal suite (Section 6)

Barry's non-negotiables unchanged: no production code without tests, no deployment without CI/CD, no manual process that could be automated.

---

## 3. Design System — Locked (Henry/Levana 🎨, Overriding OHA Defaults for This Project)

**Palette — Pattern E, "Cre8tive Signature," locked, no drift:**

| Role | Token | Hex |
|---|---|---|
| Background (preferred) | `--bg` | `#e9e9e9` |
| Main accent | `--accent` | `#f7652d` |
| Main accent (rgb companion) | `--accent-rgb` | `247, 101, 45` |
| Secondary accent (steel) | `--accent-2` | `#527799` |
| Secondary accent (charcoal) | `--accent-3` | `#333333` |
| Dark / table-heading background | `--dark` | `#101820` |
| Dark alt | `--dark-2` | `#0f2437` |
| Text on light | `--text-dark` | `#000000` |
| Text on dark | `--text-light` | `#ffffff` |

**Typography — resolved.** Aptos itself is not a licensable web font (it ships with Microsoft 365, not as a webfont product), so this project uses its closest free, professionally-matched Google Fonts equivalent instead of a generic fallback stack: **Inter.** Independent font-matching analysis puts Inter as the top free substitute for Aptos — both are screen-first, neutral, high-legibility sans-serifs with a large x-height and open apertures, which is exactly Aptos's design brief (Aptos was built as Calibri's successor for on-screen clarity). Load via Google Fonts with `font-display: swap`. Font stack: `"Inter", "Aptos", -apple-system, "Segoe UI", system-ui, sans-serif` — so a visitor with Aptos installed locally (Windows 11 / Microsoft 365 devices) still sees true Aptos; everyone else sees Inter, which reads as the same font family in spirit.

**Motion tier:** Restrained (per v1), built on the warm accent — ambient hero glow, logo micro-motion, entrance fades. No change.

**Non-negotiable, overriding OHA's default patterns for this project specifically:** Blue Diamond Cre8tive never uses Pattern A/B/C/D or their fonts (Playfair Display, Montserrat, SF Pro, gold/teal accents) — Pattern E and Inter/Aptos are the only approved combination here.

---

## 4. Silo-by-Silo Plan (Active Silos Only)

### Silo 1 — AI-native marketing for busy clients

Unchanged from v1's analysis and pricing (approved):

| Tier | Price | What's included |
|---|---|---|
| Starter | $697–$997/mo | Social content calendar + copy + design, monthly report |
| Growth | $1,997–$2,997/mo | Starter + campaigns, email, landing pages, quarterly strategy session |
| Signature | $5,000+/mo, limited seats | Fractional CMO-style engagement, full team output, priority turnaround |

Clients on any tier get logged-in access to the product-team agents (Henry, Ray, Anna, Scott, Barry, Harvey) inside `/dashboard` as part of the delivery model — this is *how* the tiers get fulfilled at scale, not a separate feature bolted on. This is the direct link between "AI-native marketing agency" as a positioning claim and the actual product: clients aren't just receiving deliverables, they have standing access to an AI marketing team with defined personas and non-negotiables of its own.

Harvey's (OHA/Rebecca-informed) contract requirements, Ray/Anna/Scott's production non-negotiables, and Max's (OHA) feasibility check before every signed engagement all carry over unchanged from v1.

### Silo 2 — AI-built tools & apps

Unchanged from v1: flagship product is a sellable version of the Competitor Intelligence Vault (Section 7 defines its now-locked cadence). Pricing approved: $49/mo Starter, $99/mo Pro, $249/mo Agency.

Harvey's (OHA/Rebecca) legal-review blocker on competitor-scraping ToS exposure still applies before this goes public — unresolved, still scheduled into Phase 0.

### Silo 3 — AI-built courses, e-books and templates

Unchanged from v1, pricing approved: $97–197 entry, ~$497 flagship, $1,497–4,997 premium cohort/1:1 tier. Sequencing unchanged: sold to the existing Silo 1 client list first, paid-acquisition scale comes later.

### Silo 5 — Self-marketing (renumbered from v1; Silo 4 removed, this stays "Silo 5" in name since it's the established internal label)

Unchanged: Henry's product-team persona and the OHA builder team both hold Cre8tive's own site/content/case-studies to the Signature-tier standard, because it's the sales proof for Silo 1 and Silo 3.

---

## 5. Consolidated Financial Model — Max (OHA) 💰

Three scenarios, Year 1, revised to remove the channel line entirely (no ad-revenue upside inflating the model):

| Scenario | Silo 1 (clients) | Silo 2 (tool) | Silo 3 (courses) | Total MRR-equivalent, Month 12 |
|---|---|---|---|---|
| **Downside** | 3 Starter clients ($2,700/mo) | 10 tool subs ($490/mo) | 1 launch cohort, ~$3,000 total (one-time) | ~$3,200/mo + $3,000 one-time |
| **Base** | 2 Growth + 3 Starter ($7,000/mo) | 40 tool subs ($2,500/mo avg) | Flagship course ~$15,000 launch, ~$1,500/mo evergreen | ~$8,500–9,000/mo |
| **Upside** | 1 Signature + 3 Growth + 4 Starter ($19,900/mo) | 120 tool subs ($8,500/mo avg) | Two cohorts + evergreen, ~$4,000/mo | ~$32,000–33,000/mo |

Removing the channel scenario line lowers the Base and Upside totals versus v1 — an honest trade for a cleaner, more defensible model. Max's non-negotiables (sourced assumptions, no fantasy projections, three scenarios always) carry over unchanged. Cost-side modelling (hosting, AI API usage, Resend volume, legal costs, domain) remains a Phase 0 deliverable, not yet built out in detail.

---

## 6. Legal & Compliance — Harvey / Rebecca (OHA) ⚖️ — Locked

- **Entity & jurisdiction, confirmed:** Mauritius. Rebecca's (OHA) jurisdiction non-negotiable applies directly.
- **Brand & licensing line, confirmed for every legal page and site footer:** *"Blue Diamond Cre8tive, licensed by Blue Diamond Capital Ltd · Mauritius · Powered by One Hub Automation."* This replaces the generic `"Billed & Licensed by [Entity] · [Jurisdiction]"` placeholder from the OHA legal-page-shell pattern with Cre8tive's actual entity line — apply it verbatim across Terms, Privacy, Disclaimer, and Refund/Cancellation pages, and in the site footer.
- **Legal page suite** (`terms/`, `privacy/`, `disclaimer/`, `refund-cancellation/`): unchanged in structure from v1, AI-liability disclaimer language unchanged: *"Blue Diamond Cre8tive's outputs are provided for informational and decision-support purposes. Artificial intelligence can make errors. Always verify before taking action."*
- **Client services agreement, tool ToS + data-processing addendum, course/template licence:** unchanged from v1.
- **Competitor-data legal review** for the Vault tool (Silo 2): still an open, unresolved Phase 0 blocker — scraping ToS exposure needs Harvey's (OHA/Rebecca's) sign-off before public launch, this was never one of the 8 items you approved and still needs a real review, not just a decision.
- **Faceless-channel-specific legal items** from v1 (content-rights checklist, synthetic-voice consent, AI-disclosure) — parked along with the silo itself, not needed now.

---

## 7. Competitor Intelligence Vault — Cadence Locked

**Both, as instructed:** a weekly scan (fast, lightweight — pricing/positioning/content moves logged) *and* a monthly deep review (white-space analysis, strategic implications, feeds directly into Henry's content and service-tier decisions). The weekly scan is the raw feed; the monthly review is where it turns into a decision. This is also the direct input for Silo 2's productised version — the internal cadence *is* the feature once packaged for sale.

---

## 8. Phase 1 Scope — Full Client Dashboard, Confirmed

Per your instruction, Phase 1 is no longer "services site first, dashboard later" — it now includes the full client dashboard from the start: **login, invoices, and deliverables**, plus access to the product-team agent personas (Section 0) that fulfill Silo 1 engagements. This is a heavier Phase 1 than v1 proposed, and it's the right call given the product-team agents are how the "AI marketing team" positioning actually gets delivered — the dashboard isn't a Phase 2 nice-to-have, it's the mechanism the whole Silo 1 pricing model depends on.

---

## 9. Revised Phasing

- **Phase 0 — Foundation:** Pattern E design system built (Inter/Aptos font pipeline, palette, motion), Next.js/Vercel/Supabase skeleton on the existing GitHub/Vercel/Supabase projects, legal suite drafted with the confirmed brand/licensing line, Competitor Intelligence Vault v1 (internal, both cadences running), Harvey's (OHA) competitor-scraping legal review started.
- **Phase 1 — Silo 1 + Silo 5 live, full dashboard included:** client-facing services site, full client dashboard (login/invoices/deliverables), product-team agent personas built and accessible in-dashboard; Cre8tive's own marketing built to Signature-tier standard as the sales proof.
- **Phase 2 — Silo 3 launch:** flagship course sold to the existing client list, template packs as low-ticket entry.
- **Phase 3 — Silo 2 flagship tool:** Competitor Intelligence Vault productised and sold, once Harvey's (OHA) legal review clears it.
- **Paused — Silo 4 (channel):** revisit later; v1's research stands if reactivated.

---

## 10. Decisions Locked (formerly "Open Decisions" in v1)

1. Named orchestrator agent for the *builder* side — not needed; Claude runs the room directly using the existing OHA roster.
2. Jurisdiction — **Mauritius, confirmed.**
3. Phasing order — **approved as revised in Section 9**, with Phase 1 now including the full dashboard.
4. Pricing tiers — **approved as researched.**
5. Font — **resolved: Inter as Aptos's closest free equivalent**, with a local-Aptos-first font stack (Section 3).
6. Competitor Intelligence Vault cadence — **both weekly and monthly, confirmed.**
7. Platform scope for v1 — **full client dashboard (login/invoices/deliverables) in Phase 1, confirmed.**
8. Domain/brand name — **confirmed:** Blue Diamond Cre8tive, licensed by Blue Diamond Capital Ltd, powered by One Hub Automation.

**Still genuinely open, flagged, not yet answered:** the competitor-scraping ToS legal review for the Silo 2 Vault tool (Section 6) — this is a real dependency, not a preference, and needs Harvey's (OHA/Rebecca's) actual review before Phase 3, not just a decision from you.

---

## 11. Next Step

With every decision resolved, the Claude Code build prompt for Phase 0 is attached separately (`Blue Diamond Cre8tive — Phase 0 Build Prompt.md`) — ready to hand to Claude Code as-is.
