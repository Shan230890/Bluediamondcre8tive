// Stage 2 — Seeded "known AI tools" corpus.
//
// ~55 well-known AI tools across 12+ categories. Each entry:
//   - name:        canonical display name
//   - category:    primary vertical slug (used by Competition scoring)
//   - text:        short semantic description (~15-25 words). Used for
//                  embedding-based similarity against the user's tool.
//   - founded_year: integer (used as a lightweight "maturity" signal)
//   - funded:      boolean — did they raise institutional capital?
//   - funding_tier: "bootstrap" | "seed" | "series_a" | "series_b_plus" | "bigtech"
//                   used to weight Competition scoring.
//
// NOTE: descriptions are intentionally short and value-prop oriented so
// cosine similarity against the user's value_proposition is meaningful.
// Funded/funding_tier is a coarse signal — updated as of mid-2026.
//
// IMPORTANT: This is the AUTHORITATIVE category taxonomy for Stage 2. The
// Competition scorer counts how many tools in the user's category; adding
// more tools to a category shifts the user's score. Keep it curated.

export type CorpusCategory =
  | "ai-writing-assistant"
  | "ai-code-assistant"
  | "ai-image-generator"
  | "ai-video-generator"
  | "ai-meeting-summarizer"
  | "ai-search"
  | "ai-chatbot"
  | "ai-data-analytics"
  | "ai-agent-platform"
  | "ai-voice-speech"
  | "ai-translation"
  | "ai-sales-crm"
  | "ai-recruiting-hr"
  | "ai-design-tool"
  | "ai-research-assistant"
  | "ai-presentation"
  | "ai-music-audio"
  | "ai-document-summarizer"
  | "ai-avatar-video"
  | "ai-workflow-automation";

export type CorpusFundingTier =
  | "bootstrap"
  | "seed"
  | "series_a"
  | "series_b_plus"
  | "bigtech";

export type CorpusEntry = {
  name: string;
  category: CorpusCategory;
  text: string;
  founded_year: number;
  funded: boolean;
  funding_tier: CorpusFundingTier;
};

// Pre-computed deterministic embeddings for each entry. Keyed by the same
// `deterministicEmbed` algorithm in ollama.ts so a fresh embed() of the
// description would produce a vector aligned with these.
//
// Real embeddings are dimension-dependent (nomic-embed-text = 768,
// mxbai-embed-large = 1024, etc.). For determinism across runs we lock to
// 384 dim — matches our fallback default. If real embeddings become
// available later, we'd recompute these.
import { deterministicEmbed } from "@/lib/score/ollama";

// Shared embedding dimension constant. Locked to 384 to match the
// deterministic fallback. If real Ollama embed becomes available later, we
// recompute corpus vectors against that dim.
const EMBED_DIM = 384;

const RAW_CORPUS: CorpusEntry[] = [
  // ---------------------------------------------------------------------
  // AI writing assistants (8) — saturated category
  // ---------------------------------------------------------------------
  {
    name: "ChatGPT",
    category: "ai-chatbot",
    text: "OpenAI's general-purpose conversational AI assistant for writing, coding, analysis, and Q&A across many domains.",
    founded_year: 2022,
    funded: true,
    funding_tier: "bigtech",
  },
  {
    name: "Claude",
    category: "ai-chatbot",
    text: "Anthropic's helpful, harmless, and honest conversational AI assistant for writing, reasoning, and coding tasks.",
    founded_year: 2023,
    funded: true,
    funding_tier: "bigtech",
  },
  {
    name: "Gemini",
    category: "ai-chatbot",
    text: "Google's multimodal conversational AI for search, writing, coding, image understanding, and productivity tasks.",
    founded_year: 2023,
    funded: true,
    funding_tier: "bigtech",
  },
  {
    name: "Jasper",
    category: "ai-writing-assistant",
    text: "AI writing assistant for marketing teams to generate blog posts, ad copy, emails, and brand-consistent content at scale.",
    founded_year: 2021,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Copy.ai",
    category: "ai-writing-assistant",
    text: "AI copywriting platform for marketers to produce blog intros, social captions, product descriptions, and email campaigns.",
    founded_year: 2020,
    funded: true,
    funding_tier: "series_a",
  },
  {
    name: "Writesonic",
    category: "ai-writing-assistant",
    text: "AI writer for SEO articles, ads, ecommerce product descriptions, and fact-checked long-form content.",
    founded_year: 2021,
    funded: true,
    funding_tier: "series_a",
  },
  {
    name: "Rytr",
    category: "ai-writing-assistant",
    text: "Affordable AI writing assistant that generates blog outlines, emails, social posts, and ad copy in 30+ tones.",
    founded_year: 2021,
    funded: true,
    funding_tier: "seed",
  },
  {
    name: "Notion AI",
    category: "ai-writing-assistant",
    text: "AI features embedded inside Notion workspace for summarizing notes, drafting docs, action items, and Q&A on your wiki.",
    founded_year: 2023,
    funded: true,
    funding_tier: "bigtech",
  },

  // ---------------------------------------------------------------------
  // AI code assistants (7)
  // ---------------------------------------------------------------------
  {
    name: "GitHub Copilot",
    category: "ai-code-assistant",
    text: "AI pair programmer that suggests code completions, functions, and tests inline inside IDEs like VS Code.",
    founded_year: 2021,
    funded: true,
    funding_tier: "bigtech",
  },
  {
    name: "Cursor",
    category: "ai-code-assistant",
    text: "AI-first code editor with project-wide code understanding, multi-file edits, and natural-language refactoring.",
    founded_year: 2023,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Codeium",
    category: "ai-code-assistant",
    text: "Free AI code completion and chat that supports 70+ languages inside VS Code, JetBrains, and Jupyter.",
    founded_year: 2022,
    funded: true,
    funding_tier: "series_a",
  },
  {
    name: "Tabnine",
    category: "ai-code-assistant",
    text: "Enterprise AI code completion assistant trained on permissive licenses with private deployment and air-gapped options.",
    founded_year: 2019,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Replit Ghostwriter",
    category: "ai-code-assistant",
    text: "AI code generation and chat built into Replit's cloud IDE for rapid prototyping, debugging, and learning.",
    founded_year: 2023,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Cody by Sourcegraph",
    category: "ai-code-assistant",
    text: "AI coding assistant with deep codebase context, code search, and multi-repo reasoning for enterprise teams.",
    founded_year: 2023,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "v0 by Vercel",
    category: "ai-code-assistant",
    text: "Generative UI tool that turns natural-language prompts into React + Tailwind component code for the web.",
    founded_year: 2024,
    funded: true,
    funding_tier: "bigtech",
  },

  // ---------------------------------------------------------------------
  // AI image generators (5)
  // ---------------------------------------------------------------------
  {
    name: "Midjourney",
    category: "ai-image-generator",
    text: "Text-to-image AI generator known for high-aesthetic, stylized images favored by artists and concept designers.",
    founded_year: 2022,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "DALL-E",
    category: "ai-image-generator",
    text: "OpenAI's text-to-image generator that creates realistic images and art from natural language prompts.",
    founded_year: 2022,
    funded: true,
    funding_tier: "bigtech",
  },
  {
    name: "Stable Diffusion",
    category: "ai-image-generator",
    text: "Open-source text-to-image diffusion model that can be self-hosted and fine-tuned for custom artistic styles.",
    founded_year: 2022,
    funded: true,
    funding_tier: "series_a",
  },
  {
    name: "Adobe Firefly",
    category: "ai-image-generator",
    text: "Adobe's commercially-safe generative image and text-effect model integrated into Photoshop and Illustrator.",
    founded_year: 2023,
    funded: true,
    funding_tier: "bigtech",
  },
  {
    name: "Ideogram",
    category: "ai-image-generator",
    text: "Text-to-image AI generator with strong typography rendering, ideal for posters, logos, and graphic design.",
    founded_year: 2023,
    funded: true,
    funding_tier: "series_a",
  },

  // ---------------------------------------------------------------------
  // AI video generators (4)
  // ---------------------------------------------------------------------
  {
    name: "Runway",
    category: "ai-video-generator",
    text: "AI video generation and editing suite for filmmakers with text-to-video, motion brush, and Gen-3 models.",
    founded_year: 2018,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Pika",
    category: "ai-video-generator",
    text: "Text-to-video AI that generates short cinematic clips from prompts and supports image-to-video style transfer.",
    founded_year: 2023,
    funded: true,
    funding_tier: "series_a",
  },
  {
    name: "Sora",
    category: "ai-video-generator",
    text: "OpenAI's text-to-video model that generates up to one minute of high-fidelity video from natural language.",
    founded_year: 2024,
    funded: true,
    funding_tier: "bigtech",
  },
  {
    name: "Synthesia",
    category: "ai-avatar-video",
    text: "AI avatar video platform that turns scripts into studio-quality talking-head videos in 140+ languages.",
    founded_year: 2017,
    funded: true,
    funding_tier: "series_b_plus",
  },

  // ---------------------------------------------------------------------
  // AI meeting / notes (3)
  // ---------------------------------------------------------------------
  {
    name: "Otter.ai",
    category: "ai-meeting-summarizer",
    text: "AI meeting assistant that records, transcribes, and summarizes Zoom, Teams, and Google Meet calls in real time.",
    founded_year: 2016,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Fireflies.ai",
    category: "ai-meeting-summarizer",
    text: "AI notetaker that joins meetings, transcribes conversations, and produces searchable summaries and action items.",
    founded_year: 2016,
    funded: true,
    funding_tier: "series_a",
  },
  {
    name: "Read.ai",
    category: "ai-meeting-summarizer",
    text: "AI meeting assistant delivering real-time transcription, engagement analytics, and coaching reports for teams.",
    founded_year: 2021,
    funded: true,
    funding_tier: "series_a",
  },

  // ---------------------------------------------------------------------
  // AI search (3)
  // ---------------------------------------------------------------------
  {
    name: "Perplexity",
    category: "ai-search",
    text: "AI-powered answer engine that cites sources and synthesizes real-time answers from the web for research queries.",
    founded_year: 2022,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "You.com",
    category: "ai-search",
    text: "AI search engine with customizable apps, modes, and citations for developer and research-oriented queries.",
    founded_year: 2020,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Brave Leo",
    category: "ai-search",
    text: "Privacy-preserving AI assistant built into the Brave browser that summarizes pages and answers queries locally.",
    founded_year: 2023,
    funded: true,
    funding_tier: "series_b_plus",
  },

  // ---------------------------------------------------------------------
  // AI data analytics (3)
  // ---------------------------------------------------------------------
  {
    name: "Julius AI",
    category: "ai-data-analytics",
    text: "AI data analyst that connects to spreadsheets and databases to answer questions in natural language with charts.",
    founded_year: 2022,
    funded: true,
    funding_tier: "seed",
  },
  {
    name: "Hex",
    category: "ai-data-analytics",
    text: "AI-powered collaborative data notebook for SQL, Python, and no-code exploration with AI query assistance.",
    founded_year: 2020,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Sigma Computing",
    category: "ai-data-analytics",
    text: "Cloud analytics and BI platform with spreadsheet UI, AI-assisted formulas, and live dashboards on the data warehouse.",
    founded_year: 2014,
    funded: true,
    funding_tier: "series_b_plus",
  },

  // ---------------------------------------------------------------------
  // AI agent platforms (4)
  // ---------------------------------------------------------------------
  {
    name: "Zapier",
    category: "ai-workflow-automation",
    text: "Workflow automation platform connecting 6,000+ apps with no-code triggers, actions, and now AI-powered steps.",
    founded_year: 2011,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Make",
    category: "ai-workflow-automation",
    text: "Visual automation platform with branching scenarios and 1,000+ app integrations for complex no-code workflows.",
    founded_year: 2019,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "n8n",
    category: "ai-workflow-automation",
    text: "Source-available workflow automation tool with AI nodes, self-hosting, and flexible code-based integrations.",
    founded_year: 2019,
    funded: true,
    funding_tier: "series_a",
  },
  {
    name: "AutoGen",
    category: "ai-agent-platform",
    text: "Microsoft's open-source framework for orchestrating multi-agent AI systems that converse and collaborate on tasks.",
    founded_year: 2023,
    funded: true,
    funding_tier: "bigtech",
  },

  // ---------------------------------------------------------------------
  // AI voice / speech (3)
  // ---------------------------------------------------------------------
  {
    name: "ElevenLabs",
    category: "ai-voice-speech",
    text: "AI voice synthesis platform with realistic text-to-speech, voice cloning, and dubbing in 29 languages.",
    founded_year: 2022,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Murf",
    category: "ai-voice-speech",
    text: "AI voice generator for studio-quality voiceovers, e-learning narration, and explainer videos in 20+ languages.",
    founded_year: 2020,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Play.ht",
    category: "ai-voice-speech",
    text: "AI text-to-speech platform with 600+ voices for podcasts, articles, and video narration with API access.",
    founded_year: 2018,
    funded: true,
    funding_tier: "series_a",
  },

  // ---------------------------------------------------------------------
  // AI translation (2)
  // ---------------------------------------------------------------------
  {
    name: "DeepL",
    category: "ai-translation",
    text: "AI translation service known for natural, fluent translations across 30+ languages used by enterprise teams.",
    founded_year: 2017,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Lokalise AI",
    category: "ai-translation",
    text: "AI-assisted localization platform with context-aware translation, glossary, and developer-friendly CI/CD hooks.",
    founded_year: 2011,
    funded: true,
    funding_tier: "series_a",
  },

  // ---------------------------------------------------------------------
  // AI sales / CRM (3)
  // ---------------------------------------------------------------------
  {
    name: "Gong",
    category: "ai-sales-crm",
    text: "Revenue intelligence platform that records sales calls, surfaces insights, and predicts deal outcomes with AI.",
    founded_year: 2015,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Clay",
    category: "ai-sales-crm",
    text: "AI-powered outbound platform combining 50+ data providers, enrichment, and personalized email sequencing.",
    founded_year: 2021,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Lavender",
    category: "ai-sales-crm",
    text: "AI sales email coach that scores cold emails, suggests improvements, and helps reps book more meetings.",
    founded_year: 2020,
    funded: true,
    funding_tier: "series_a",
  },

  // ---------------------------------------------------------------------
  // AI recruiting / HR (2)
  // ---------------------------------------------------------------------
  {
    name: "Eightfold",
    category: "ai-recruiting-hr",
    text: "Enterprise talent intelligence platform using AI to match candidates, identify skills gaps, and retain employees.",
    founded_year: 2016,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Fetcher",
    category: "ai-recruiting-hr",
    text: "AI sourcing tool that automates candidate outreach and aggregates profiles for full-cycle recruiting teams.",
    founded_year: 2015,
    funded: true,
    funding_tier: "series_a",
  },

  // ---------------------------------------------------------------------
  // AI design (3)
  // ---------------------------------------------------------------------
  {
    name: "Figma AI",
    category: "ai-design-tool",
    text: "AI features inside Figma for auto-generating layouts, asset search, and design system consistency checks.",
    founded_year: 2024,
    funded: true,
    funding_tier: "bigtech",
  },
  {
    name: "Canva Magic Studio",
    category: "ai-design-tool",
    text: "AI design suite inside Canva for generating graphics, presentations, videos, and brand-consistent marketing assets.",
    founded_year: 2023,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Galileo AI",
    category: "ai-design-tool",
    text: "Text-to-UI design generator that creates editable Figma mockups from natural language product descriptions.",
    founded_year: 2022,
    funded: true,
    funding_tier: "seed",
  },

  // ---------------------------------------------------------------------
  // AI research assistant (2)
  // ---------------------------------------------------------------------
  {
    name: "Elicit",
    category: "ai-research-assistant",
    text: "AI research assistant that finds relevant academic papers, extracts data, and summarizes findings from PDFs.",
    founded_year: 2018,
    funded: true,
    funding_tier: "series_a",
  },
  {
    name: "Consensus",
    category: "ai-research-assistant",
    text: "AI search engine that pulls answers directly from peer-reviewed scientific studies with citations.",
    founded_year: 2021,
    funded: true,
    funding_tier: "series_a",
  },

  // ---------------------------------------------------------------------
  // AI presentation (2)
  // ---------------------------------------------------------------------
  {
    name: "Gamma",
    category: "ai-presentation",
    text: "AI presentation maker that generates slide decks, docs, and websites from prompts in under a minute.",
    founded_year: 2022,
    funded: true,
    funding_tier: "series_a",
  },
  {
    name: "Tome",
    category: "ai-presentation",
    text: "AI storytelling tool that turns prompts into narrative-driven presentations with images, charts, and animations.",
    founded_year: 2022,
    funded: true,
    funding_tier: "series_b_plus",
  },

  // ---------------------------------------------------------------------
  // AI music / audio (2)
  // ---------------------------------------------------------------------
  {
    name: "Suno",
    category: "ai-music-audio",
    text: "AI music generator that produces full songs with vocals, lyrics, and instrumentation from text prompts.",
    founded_year: 2023,
    funded: true,
    funding_tier: "series_b_plus",
  },
  {
    name: "Udio",
    category: "ai-music-audio",
    text: "AI music creation platform for generating studio-quality songs across genres with vocal and instrumental control.",
    founded_year: 2023,
    funded: true,
    funding_tier: "series_a",
  },

  // ---------------------------------------------------------------------
  // AI document summarizer (2)
  // ---------------------------------------------------------------------
  {
    name: "ChatPDF",
    category: "ai-document-summarizer",
    text: "AI tool that lets you chat with PDF documents, ask questions, and extract key insights from uploaded files.",
    founded_year: 2023,
    funded: true,
    funding_tier: "seed",
  },
  {
    name: "Humata",
    category: "ai-document-summarizer",
    text: "AI PDF analyzer that summarizes long documents, answers questions, and cites specific pages from legal/technical papers.",
    founded_year: 2022,
    funded: true,
    funding_tier: "seed",
  },
];

// ---------------------------------------------------------------------------
// Pre-computed embeddings + helpers
// ---------------------------------------------------------------------------

export type CorpusEntryWithEmbedding = CorpusEntry & {
  vector: number[];
};

/**
 * Build the corpus with deterministic embeddings. Pure function — same input
 * produces the same vector. Called at module load.
 *
 * Why "with embedding": embedding the corpus entry text with the same
 * algorithm as the user's query ensures cosine similarity is comparable.
 */
function buildCorpus(): CorpusEntryWithEmbedding[] {
  return RAW_CORPUS.map((entry) => ({
    ...entry,
    vector: deterministicEmbed(entry.text, EMBED_DIM),
  }));
}

export const CORPUS: ReadonlyArray<CorpusEntryWithEmbedding> = buildCorpus();

/**
 * Get all known categories in the corpus, with counts and funded counts.
 * Used by Competition scoring.
 */
export function getCategoryStats(): Map<
  CorpusCategory,
  { total: number; funded: number; bigtech: number }
> {
  const stats = new Map<
    CorpusCategory,
    { total: number; funded: number; bigtech: number }
  >();
  for (const entry of CORPUS) {
    const s = stats.get(entry.category) ?? { total: 0, funded: 0, bigtech: 0 };
    s.total += 1;
    if (entry.funded) s.funded += 1;
    if (entry.funding_tier === "bigtech") s.bigtech += 1;
    stats.set(entry.category, s);
  }
  return stats;
}

/**
 * Look up a corpus entry by name (case-insensitive). Returns null if not in
 * the corpus. Used by Competition scoring to check if user-claimed competitors
 * are funded.
 */
export function lookupByName(name: string): CorpusEntry | null {
  const norm = name.trim().toLowerCase();
  if (!norm) return null;
  for (const e of CORPUS) {
    if (e.name.toLowerCase() === norm) return e;
  }
  // Fuzzy: substring match (e.g. "ChatGPT 4" still finds "ChatGPT")
  for (const e of CORPUS) {
    if (norm.includes(e.name.toLowerCase()) || e.name.toLowerCase().includes(norm)) {
      return e;
    }
  }
  return null;
}

/**
 * Get total corpus size. Useful for metrics / debug.
 */
export const CORPUS_SIZE = CORPUS.length;

/**
 * Get all distinct categories. Used to validate user input category strings
 * (and decide what to do with novel categories — they get the median).
 */
export const CORPUS_CATEGORIES: ReadonlyArray<CorpusCategory> = Array.from(
  new Set(CORPUS.map((e) => e.category))
);