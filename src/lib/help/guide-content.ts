/**
 * Hardcoded "Browse guide" topic list for the help widget's guide tab —
 * mirrors Opsara's src/lib/help/guideContent.ts pattern: hand-curated, one
 * topic per real feature area, never AI-generated, never a claim beyond what
 * the codebase actually does.
 */
export interface GuideTopic {
  title: string;
  body: string[];
}

export const GUIDE_TOPICS: GuideTopic[] = [
  {
    title: "Task board & Projects",
    body: [
      "Create a project with a brief (goals, industry, audience, channels), and your team drafts a starter task list from it.",
      "Work tasks on the kanban board: assign a task to one of your six personas, run it, and review the reply before marking it done.",
      "Each project tracks its own status (discovery, active, review, complete) and links out to AI Visibility, Paid Media Plan, and Outbound Drafts for that project.",
    ],
  },
  {
    title: "Templates",
    body: [
      "The template gallery is a curated library of ready-made task briefs, organized by category (SEO & AEO, paid media, outbound, copy, brand, video, web, email, reporting, legal).",
      "Click \"Use this template\" to prefill the new-task form on Tasks, then edit it before assigning.",
      "You can also save your own custom templates from the Templates page for work you repeat often.",
    ],
  },
  {
    title: "AI Visibility Report",
    body: [
      "A simulated check of how a brand might show up in AI-assistant answers (ChatGPT-style, Claude-style, Perplexity-style, Google AI Overviews-style judges), not a live query against those real products.",
      "Enter your brand, category, and competitors to get a scored comparison and sample probe responses.",
    ],
  },
  {
    title: "Paid Media Plan",
    body: [
      "A creative and budget-allocation recommendation across the channels you pick (Google, Meta, LinkedIn, YouTube, Reddit).",
      "This is planning output only. Blue Diamond Cre8tive does not manage ad accounts or spend on your behalf, you take the plan to your own media buyer or ad platform account.",
    ],
  },
  {
    title: "Outbound Drafts",
    body: [
      "Draft cold email and LinkedIn opener copy written against an ICP you describe, using placeholder tokens like [First name] and [Company].",
      "These are drafts for you to personalize and send yourself. There is no real contact sourcing, scraping, or enrichment, and nothing is sent on your behalf.",
    ],
  },
  {
    title: "Execution Memory",
    body: [
      "A running record of every task your team has closed (done or dismissed), with the AI's reply and any outcome note you add.",
      "It exists so the next brief can build on what already happened instead of starting from zero.",
    ],
  },
  {
    title: "Custom agents",
    body: [
      "Build your own AI agent for marketing work your six-person team doesn't already cover, with a name, mission, and system prompt you write.",
      "Custom agents are locked to marketing tasks for your business only, no matter how a request is phrased.",
    ],
  },
  {
    title: "Your Cre8tive Team",
    body: [
      "Six built-in AI personas, each grounded in a real role: a Chief Marketing Officer, a Legal Representative, a Copywriter, a Graphic Designer, a Video Editor & Podcast Producer, and an App Designer, Web Builder & Coder.",
      "Chat with any of them directly from their page, or assign them tasks from the board.",
    ],
  },
  {
    title: "Vault",
    body: [
      "The Competitor Intelligence Vault holds hand-entered competitor research: weekly scans and monthly reviews you log yourself.",
      "Entries are added manually through the form on this page, not scraped automatically.",
    ],
  },
];
