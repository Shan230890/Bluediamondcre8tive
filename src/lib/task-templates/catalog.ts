/**
 * Curated task template catalog — hardcoded, no database table for these.
 * Every title/description here is written fresh, grounded in what each
 * persona's system prompt (src/lib/personas/blue-diamond.ts) actually says
 * they do. Categories are a fixed, small set that map honestly to real
 * persona coverage — no category exists here without a persona backing it.
 *
 * Clicking a template on /dashboard/templates prefills the existing
 * new-task form on /dashboard/tasks via a `?template=<slug>` query param —
 * this module is imported directly by that page, no API round trip needed
 * for the curated set.
 */

import type { PersonaSlug } from "@/lib/personas/blue-diamond";

export type TemplateCategory =
  | "SEO & AEO strategy"
  | "Paid media planning"
  | "Signal-based outbound"
  | "Content & copywriting"
  | "Brand & design"
  | "Video & podcast"
  | "Web & app"
  | "Email & lifecycle"
  | "Reporting & analytics";

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "SEO & AEO strategy",
  "Paid media planning",
  "Signal-based outbound",
  "Content & copywriting",
  "Brand & design",
  "Video & podcast",
  "Web & app",
  "Email & lifecycle",
  "Reporting & analytics",
];

export interface TaskTemplate {
  slug: string;
  title: string;
  description: string;
  suggestedPersonaKey: PersonaSlug;
  category: TemplateCategory;
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  // --- SEO & AEO strategy (henry) ---
  {
    slug: "seo-content-gap-audit",
    title: "Content gap audit against 3 competitors",
    description: "Henry maps where your published content is thin compared to three named competitors and flags the highest-opportunity gaps to fill first.",
    suggestedPersonaKey: "henry",
    category: "SEO & AEO strategy",
  },
  {
    slug: "aeo-answer-readiness-check",
    title: "AI-answer readiness check for your top pages",
    description: "Henry reviews your highest-traffic pages for how clearly they answer the question an AI assistant would need to cite them for, and lists the fixes.",
    suggestedPersonaKey: "henry",
    category: "SEO & AEO strategy",
  },
  {
    slug: "seo-quarterly-priority-brief",
    title: "Quarterly SEO priority brief",
    description: "Henry turns your current rankings and goals into a ranked list of the SEO moves worth doing this quarter, in order.",
    suggestedPersonaKey: "henry",
    category: "SEO & AEO strategy",
  },
  {
    slug: "keyword-cluster-to-calendar",
    title: "Keyword cluster to content calendar",
    description: "Henry groups a keyword list into topic clusters and sequences them into a content calendar your team can execute against.",
    suggestedPersonaKey: "henry",
    category: "SEO & AEO strategy",
  },

  // --- Paid media planning (henry) ---
  {
    slug: "paid-media-channel-split",
    title: "Recommended budget split across channels",
    description: "Henry proposes how to divide a stated ad budget across channels for a given goal, with the creative angle for each. Creative and budget planning only, execution stays with you or your media buyer.",
    suggestedPersonaKey: "henry",
    category: "Paid media planning",
  },
  {
    slug: "paid-media-creative-brief",
    title: "Creative brief for a new paid campaign",
    description: "Henry writes the creative direction, hook angles, and audience notes a designer or media buyer needs to build a paid campaign.",
    suggestedPersonaKey: "henry",
    category: "Paid media planning",
  },
  {
    slug: "paid-media-landing-page-brief",
    title: "Landing page brief for a paid campaign",
    description: "Henry outlines the structure and message match a landing page needs to convert traffic from a specific paid campaign.",
    suggestedPersonaKey: "henry",
    category: "Paid media planning",
  },
  {
    slug: "paid-media-retarget-plan",
    title: "Retargeting audience and message plan",
    description: "Henry maps out retargeting audience segments and the message each one should see, based on where they dropped off.",
    suggestedPersonaKey: "henry",
    category: "Paid media planning",
  },

  // --- Signal-based outbound (ray) ---
  {
    slug: "outbound-cold-email-sequence",
    title: "Cold email sequence for a described ICP",
    description: "Ray drafts a 3-email cold outreach sequence with placeholder tokens, written against a target title, industry, and pain point you describe. Drafts only, no real contact data or sending.",
    suggestedPersonaKey: "ray",
    category: "Signal-based outbound",
  },
  {
    slug: "outbound-linkedin-openers",
    title: "LinkedIn connection and opener drafts",
    description: "Ray writes a set of LinkedIn connection notes and opening messages for a described ICP, ready for you to personalize and send.",
    suggestedPersonaKey: "ray",
    category: "Signal-based outbound",
  },
  {
    slug: "outbound-signal-trigger-messages",
    title: "Signal-triggered outreach angles",
    description: "Ray drafts outreach angles keyed to a trigger event you describe, such as a funding round or a new hire, ready to send when it happens.",
    suggestedPersonaKey: "ray",
    category: "Signal-based outbound",
  },
  {
    slug: "outbound-follow-up-cadence",
    title: "Follow-up cadence for stalled replies",
    description: "Ray writes a short follow-up sequence for prospects who haven't responded, with a different angle on each touch.",
    suggestedPersonaKey: "ray",
    category: "Signal-based outbound",
  },

  // --- Content & copywriting (ray) ---
  {
    slug: "copy-landing-page-full",
    title: "Full landing page copy draft",
    description: "Ray writes hero, benefits, proof, and CTA copy for a landing page from a one-paragraph brief.",
    suggestedPersonaKey: "ray",
    category: "Content & copywriting",
  },
  {
    slug: "copy-blog-post-draft",
    title: "Blog post first draft",
    description: "Ray writes a complete first-draft blog post from a topic and target keyword, ready for your review.",
    suggestedPersonaKey: "ray",
    category: "Content & copywriting",
  },
  {
    slug: "copy-social-caption-batch",
    title: "Batch of social captions from one asset",
    description: "Ray writes a week's worth of social captions repurposed from a single piece of content or announcement.",
    suggestedPersonaKey: "ray",
    category: "Content & copywriting",
  },
  {
    slug: "copy-case-study-draft",
    title: "Case study first draft",
    description: "Ray turns a results summary and a client quote into a structured case study draft.",
    suggestedPersonaKey: "ray",
    category: "Content & copywriting",
  },

  // --- Brand & design (anna) ---
  {
    slug: "design-social-graphic-set",
    title: "Social graphic set for an announcement",
    description: "Anna designs a set of on-brand social graphics for a single announcement, sized for the platforms you specify.",
    suggestedPersonaKey: "anna",
    category: "Brand & design",
  },
  {
    slug: "design-brand-collateral-refresh",
    title: "Brand collateral refresh direction",
    description: "Anna reviews an existing piece of collateral and gives concrete direction on what to change to bring it in line with current brand standards.",
    suggestedPersonaKey: "anna",
    category: "Brand & design",
  },
  {
    slug: "design-pitch-deck-visual-direction",
    title: "Pitch deck visual direction",
    description: "Anna gives slide-by-slide visual direction, layout, and treatment for a pitch deck outline you provide.",
    suggestedPersonaKey: "anna",
    category: "Brand & design",
  },
  {
    slug: "design-thumbnail-concepts",
    title: "Thumbnail concept set for a video",
    description: "Anna proposes several thumbnail directions for a video or podcast episode, built to survive the scroll-stop test.",
    suggestedPersonaKey: "anna",
    category: "Brand & design",
  },

  // --- Video & podcast (scott) ---
  {
    slug: "video-episode-edit-brief",
    title: "Edit brief for a raw recording",
    description: "Scott turns a raw recording and its rough timestamps into a structured edit brief: cuts, pacing notes, and where to place chapter markers.",
    suggestedPersonaKey: "scott",
    category: "Video & podcast",
  },
  {
    slug: "video-show-notes-draft",
    title: "Show notes draft from an episode outline",
    description: "Scott writes show notes and a timestamped summary from an episode outline or transcript you provide.",
    suggestedPersonaKey: "scott",
    category: "Video & podcast",
  },
  {
    slug: "video-short-clip-selects",
    title: "Short-form clip selects from a long recording",
    description: "Scott reviews a long-form recording's outline and flags the segments most likely to work as standalone short-form clips.",
    suggestedPersonaKey: "scott",
    category: "Video & podcast",
  },
  {
    slug: "video-production-checklist",
    title: "Production checklist for an upcoming shoot",
    description: "Scott builds a pre-shoot checklist covering audio, framing, and shot list for a video or podcast session you describe.",
    suggestedPersonaKey: "scott",
    category: "Video & podcast",
  },

  // --- Web & app (barry) ---
  {
    slug: "web-page-build-brief",
    title: "Technical build brief for a new page",
    description: "Barry turns a page brief into a technical build plan: structure, components, and what data it needs.",
    suggestedPersonaKey: "barry",
    category: "Web & app",
  },
  {
    slug: "web-bug-triage",
    title: "Bug triage and fix plan",
    description: "Barry reviews a described bug and lays out the likely cause and the fix plan before any code changes.",
    suggestedPersonaKey: "barry",
    category: "Web & app",
  },
  {
    slug: "web-schema-markup-plan",
    title: "Structured data plan for a page",
    description: "Barry specifies which schema markup a given page needs and what data populates it, for search and AI-answer readability.",
    suggestedPersonaKey: "barry",
    category: "Web & app",
  },
  {
    slug: "web-performance-review",
    title: "Site performance review",
    description: "Barry reviews a described page or flow for load-time and technical issues and lists fixes in priority order.",
    suggestedPersonaKey: "barry",
    category: "Web & app",
  },

  // --- Email & lifecycle (ray) ---
  {
    slug: "lifecycle-welcome-sequence",
    title: "Welcome email sequence",
    description: "Ray drafts a new-subscriber welcome sequence, timed and sequenced from signup.",
    suggestedPersonaKey: "ray",
    category: "Email & lifecycle",
  },
  {
    slug: "lifecycle-re-engagement-flow",
    title: "Re-engagement flow for inactive contacts",
    description: "Ray writes a short win-back sequence aimed at contacts who have gone quiet.",
    suggestedPersonaKey: "ray",
    category: "Email & lifecycle",
  },
  {
    slug: "lifecycle-newsletter-draft",
    title: "Newsletter draft from this month's updates",
    description: "Ray turns a list of updates into a single newsletter draft ready for review.",
    suggestedPersonaKey: "ray",
    category: "Email & lifecycle",
  },
  {
    slug: "lifecycle-abandoned-action-nudge",
    title: "Nudge sequence for an abandoned action",
    description: "Ray drafts a short nudge sequence for people who started but did not finish an action you describe, like a signup or a form.",
    suggestedPersonaKey: "ray",
    category: "Email & lifecycle",
  },

  // --- Reporting & analytics (henry) ---
  {
    slug: "reporting-monthly-marketing-summary",
    title: "Monthly marketing performance summary",
    description: "Henry turns your raw numbers into a monthly summary: what moved, what did not, and what to do next.",
    suggestedPersonaKey: "henry",
    category: "Reporting & analytics",
  },
  {
    slug: "reporting-competitor-move-brief",
    title: "Competitor move brief",
    description: "Henry reviews recent Vault entries for a named competitor and summarizes what changed and what it means for your plan.",
    suggestedPersonaKey: "henry",
    category: "Reporting & analytics",
  },
  {
    slug: "reporting-channel-comparison",
    title: "Channel-by-channel performance comparison",
    description: "Henry compares performance across the channels you list and recommends where to shift focus next.",
    suggestedPersonaKey: "henry",
    category: "Reporting & analytics",
  },
  {
    slug: "reporting-quarterly-retro",
    title: "Quarterly retro and next-quarter priorities",
    description: "Henry reviews the quarter's closed tasks and outcomes and drafts a retro with priorities for next quarter.",
    suggestedPersonaKey: "henry",
    category: "Reporting & analytics",
  },
];

export function getTemplate(slug: string): TaskTemplate | null {
  return TASK_TEMPLATES.find((t) => t.slug === slug) ?? null;
}

export function getTemplatesByCategory(category: TemplateCategory): TaskTemplate[] {
  return TASK_TEMPLATES.filter((t) => t.category === category);
}
