// Stage 1 — Structured Extraction
// Given raw user input + (optional) URL probe, produce a typed JSON envelope
// describing the tool. Stage 2-4 (scoring, evidence, comparison) will consume this.
//
// Design:
//   - Single deepseek-v4-pro call. Low cost (<$0.05), <8s p95.
//   - URL probe uses Node fetch only (no cheerio/jsdom — keep zero new deps).
//   - Zod schema is the source of truth; prompt mirrors it.
//   - If JSON parse fails, retry ONCE with a strict nudge. Then throw.
//   - URL probe failures are non-fatal; the LLM still runs and the envelope
//     reflects `url_probed: false`.

import { callOllamaChat } from "@/lib/score/ollama";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ExtractionInput = {
  name: string;
  description: string;
  url?: string | undefined;
  competitors?: string | undefined;
};

export type Extraction = {
  category: {
    primary: string;
    secondary: string;
  };
  target_user: {
    segment: string;
    role: string;
    company_size: "solo" | "smb" | "midmarket" | "enterprise" | "unknown";
  };
  value_proposition: {
    one_sentence: string;
    bullets: [string, string, string];
  };
  claimed_features: string[];
  claimed_competitors: string[];
  differentiation_claims: string[];
  pricing_model: string; // "free" | "freemium" | "subscription" | "usage" | "one_time" | "unknown" | "<other>"
  tech_signals: {
    url_probed: boolean;
    final_url?: string;
    http_status?: number;
    title?: string;
    meta_description?: string;
    has_schema_org: boolean;
    schema_org_types?: string[];
    framework_hints: string[];
    og_image?: string;
    probed_at?: string;
    error?: string;
  };
  extraction_confidence: number; // 0..1
  model: string;
  extracted_at: string;
};

// ---------------------------------------------------------------------------
// Zod schema — runtime validator. Prompt MUST mirror this.
// ---------------------------------------------------------------------------

const ExtractionSchema = z.object({
  category: z.object({
    primary: z.string().min(2).max(60),
    secondary: z.string().min(2).max(60),
  }),
  target_user: z.object({
    segment: z.string().min(2).max(60),
    role: z.string().min(2).max(60),
    company_size: z.enum(["solo", "smb", "midmarket", "enterprise", "unknown"]),
  }),
  value_proposition: z.object({
    one_sentence: z.string().min(10).max(240),
    bullets: z.tuple([z.string(), z.string(), z.string()]),
  }),
  claimed_features: z.array(z.string().min(2).max(120)).max(20),
  claimed_competitors: z.array(z.string().min(1).max(80)).max(10),
  differentiation_claims: z.array(z.string().min(2).max(160)).max(8),
  pricing_model: z.string().max(40), // we coerce to canonical set post-hoc
  tech_signals: z.object({
    url_probed: z.boolean(),
    has_schema_org: z.boolean(),
    framework_hints: z.array(z.string()).max(10),
  }),
  extraction_confidence: z.number().min(0).max(1),
});

type RawExtraction = z.infer<typeof ExtractionSchema>;

// ---------------------------------------------------------------------------
// Confidence scoring — based on input completeness + URL probe success.
// LLM-reported confidence is ignored (models are poorly calibrated for this).
// ---------------------------------------------------------------------------

const PRICING_CANONICAL = new Set([
  "free",
  "freemium",
  "subscription",
  "usage",
  "one_time",
  "unknown",
]);

function normalizePricing(raw: string): string {
  const k = raw.trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (PRICING_CANONICAL.has(k)) return k;
  // common variants
  if (k === "pay_as_you_go" || k === "payg") return "usage";
  if (k === "per_seat" || k === "saas" || k === "monthly" || k === "annual")
    return "subscription";
  if (k === "tiered" || k === "custom") return "subscription";
  return "unknown";
}

function normalizeCompetitors(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c.length > 0 && c.length <= 80);
}

function computeConfidence(
  input: ExtractionInput,
  tech: Extraction["tech_signals"]
): number {
  let score = 0;
  // description length is the dominant signal
  const dlen = input.description.trim().length;
  if (dlen >= 200) score += 0.35;
  else if (dlen >= 80) score += 0.22;
  else if (dlen >= 40) score += 0.12;

  // URL
  if (input.url && /^https?:\/\//i.test(input.url)) score += 0.12;

  // Competitors provided
  const comps = normalizeCompetitors(input.competitors);
  if (comps.length >= 1) score += 0.10;
  if (comps.length >= 3) score += 0.05;

  // URL probe actually succeeded
  if (tech.url_probed) score += 0.20;

  // Schema.org JSON-LD present (rich structured signal)
  if (tech.has_schema_org) score += 0.05;

  // Name quality
  if (input.name.trim().length >= 3) score += 0.05;

  return Math.min(1, Math.round(score * 100) / 100);
}

// ---------------------------------------------------------------------------
// URL probe — pure Node fetch, no HTML parser deps.
// ---------------------------------------------------------------------------

type ProbeResult = Extraction["tech_signals"];

const FRAMEWORK_PATTERNS: Array<{ name: string; rx: RegExp }> = [
  { name: "next.js", rx: /\/\_next\//i },
  { name: "react", rx: /react/i },
  { name: "vue", rx: /\/vue\.|vue\.runtime/i },
  { name: "wordpress", rx: /wp-content|wp-includes/i },
  { name: "shopify", rx: /cdn\.shopify\.com|shopify\.com/i },
  { name: "webflow", rx: /webflow\.com|assets-global/i },
  { name: "squarespace", rx: /squarespace\.com/i },
  { name: "framer", rx: /framer\.com/i },
  { name: "vercel", rx: /vercel\.com|x-vercel/i },
  { name: "cloudflare", rx: /cloudflare|cf-ray/i },
  { name: "gtm", rx: /googletagmanager\.com/i },
  { name: "segment", rx: /segment\.com|analytics\.js/i },
  { name: "stripe", rx: /js\.stripe\.com/i },
  { name: "supabase", rx: /supabase\.co/i },
];

function extractMeta(html: string, attr: string, value: string): string | undefined {
  // matches: <meta attribute="value" content="..."> OR <meta content="..." attribute="value">
  const re = new RegExp(
    `<meta[^>]*\\b${attr}=["']${value}["'][^>]*\\bcontent=["']([^"']+)["']`,
    "i"
  );
  const m = html.match(re);
  if (m) return decodeEntities(m[1]);
  // reversed order
  const re2 = new RegExp(
    `<meta[^>]*\\bcontent=["']([^"']+)["'][^>]*\\b${attr}=["']${value}["']`,
    "i"
  );
  const m2 = html.match(re2);
  return m2 ? decodeEntities(m2[1]) : undefined;
}

function extractTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return undefined;
  const t = decodeEntities(m[1]).trim();
  return t.length > 0 ? t.slice(0, 240) : undefined;
}

function extractOg(html: string, property: string): string | undefined {
  return extractMeta(html, "property", property);
}

function extractJsonLd(html: string): unknown[] {
  const blocks: unknown[] = [];
  const re =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw) continue;
    try {
      blocks.push(JSON.parse(raw));
    } catch {
      // tolerate broken JSON-LD; skip
    }
  }
  return blocks;
}

function jsonLdTypes(blocks: unknown[]): string[] {
  const out = new Set<string>();
  for (const b of blocks) {
    if (b && typeof b === "object") {
      const obj = b as Record<string, unknown>;
      const t = obj["@type"];
      if (typeof t === "string") out.add(t);
      else if (Array.isArray(t)) {
        for (const x of t) if (typeof x === "string") out.add(x);
      }
      // nested @graph
      const g = obj["@graph"];
      if (Array.isArray(g)) {
        for (const item of g) {
          if (item && typeof item === "object") {
            const tt = (item as Record<string, unknown>)["@type"];
            if (typeof tt === "string") out.add(tt);
            else if (Array.isArray(tt)) {
              for (const x of tt) if (typeof x === "string") out.add(x);
            }
          }
        }
      }
    }
  }
  return Array.from(out);
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

async function probeUrl(rawUrl: string): Promise<ProbeResult> {
  const base: ProbeResult = {
    url_probed: false,
    has_schema_org: false,
    framework_hints: [],
  };

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { ...base, error: "invalid_url" };
  }
  if (!/^https?:$/.test(url.protocol)) {
    return { ...base, error: "non_http_scheme" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; Cre8tiveScoreProbe/1.0; +https://bluediamondcre8tive.com)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timer);

    if (!res.ok) {
      return {
        ...base,
        http_status: res.status,
        error: `http_${res.status}`,
      };
    }

    const ct = res.headers.get("content-type") || "";
    if (!/text\/html|application\/xhtml/i.test(ct)) {
      return {
        ...base,
        http_status: res.status,
        error: `non_html_content_type`,
      };
    }

    // Read up to 1 MB — enough for meta/JSON-LD/head detection.
    const reader = res.body?.getReader();
    let buf = "";
    if (reader) {
      const decoder = new TextDecoder("utf-8", { fatal: false });
      let received = 0;
      const limit = 1024 * 1024;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        buf += decoder.decode(value, { stream: true });
        if (received >= limit) break;
      }
      buf += decoder.decode();
    } else {
      buf = await res.text();
      if (buf.length > 1024 * 1024) buf = buf.slice(0, 1024 * 1024);
    }

    const title = extractTitle(buf);
    const metaDesc = extractMeta(buf, "name", "description");
    const ogImage = extractOg(buf, "og:image");
    const jsonLd = extractJsonLd(buf);
    const types = jsonLdTypes(jsonLd);

    const hints = new Set<string>();
    for (const f of FRAMEWORK_PATTERNS) {
      if (f.rx.test(buf)) hints.add(f.name);
    }
    if (res.headers.get("x-powered-by")) hints.add(res.headers.get("x-powered-by")!.toLowerCase());
    if (res.headers.get("server")) hints.add(res.headers.get("server")!.toLowerCase());

    return {
      url_probed: true,
      final_url: res.url,
      http_status: res.status,
      title,
      meta_description: metaDesc,
      has_schema_org: types.length > 0,
      schema_org_types: types.length > 0 ? types : undefined,
      framework_hints: Array.from(hints).slice(0, 10),
      og_image: ogImage,
      probed_at: new Date().toISOString(),
    };
  } catch (err) {
    clearTimeout(timer);
    const msg =
      err instanceof Error
        ? err.name === "AbortError"
          ? "timeout"
          : err.message.slice(0, 120)
        : "unknown_error";
    return { ...base, error: msg };
  }
}

// ---------------------------------------------------------------------------
// Prompt — mirrors Zod schema exactly. Keep both in sync if you change fields.
// ---------------------------------------------------------------------------

function buildExtractionPrompt(
  input: ExtractionInput,
  probe: ProbeResult
): string {
  const comps = normalizeCompetitors(input.competitors);

  const probeBlock = probe.url_probed
    ? `LANDING PAGE PROBE (success):
- Title: ${probe.title ?? "(none)"}
- Meta description: ${probe.meta_description ?? "(none)"}
- Schema.org types detected: ${probe.schema_org_types?.join(", ") ?? "(none)"}
- Framework / infra hints: ${probe.framework_hints.join(", ") || "(none)"}`
    : `LANDING PAGE PROBE: failed (${probe.error ?? "unknown"}). Use only the description below.`;

  return `You are a structured-data extraction model for Cre8tive Score, an AI-tool assessment tool.

Given the user's submission + (optional) landing page probe, extract a STRICT JSON object.
Do NOT score the tool. Do NOT give opinions. Just structure the claims the user made.

USER SUBMISSION:
- Tool name: ${input.name}
- Description: ${input.description}
${input.url ? `- URL: ${input.url}` : "- URL: (none provided)"}
${comps.length ? `- User-claimed competitors: ${comps.join(", ")}` : "- Competitors: (none provided)"}

${probeBlock}

INSTRUCTIONS:
- "category.primary" = the dominant vertical (e.g. "AI writing assistant", "developer tools", "data analytics").
- "category.secondary" = a closely related vertical or sub-category (e.g. "SEO content", "code review").
- "target_user.segment" = who buys/uses this (e.g. "indie founders", "enterprise data teams", "growth marketers").
- "target_user.role" = the specific job title / persona (e.g. "Head of Content", "Backend Engineer", "Solo creator").
- "target_user.company_size" = exactly one of: solo, smb, midmarket, enterprise, unknown.
- "value_proposition.one_sentence" = a single sentence, 12-25 words, in the user's own framing if possible.
- "value_proposition.bullets" = exactly THREE short benefit bullets (each <= 14 words). Each bullet must be a distinct benefit.
- "claimed_features" = ONLY features explicitly stated in the description or landing page probe. NO inventions. Max 20.
- "claimed_competitors" = the user-claimed competitors, each trimmed. If none were provided, return [].
- "differentiation_claims" = explicit "we are different because..." statements, either from the description or detectable from the landing page. Max 8.
- "pricing_model" = exactly one of: free, freemium, subscription, usage, one_time, unknown. Use "unknown" if no pricing information is stated.
- "tech_signals" = repeat what the probe found. Do NOT invent frameworks.
- "extraction_confidence" = your honest 0..1 estimate of how complete + consistent the input was.

RULES:
1. Output ONLY the JSON object. No prose, no markdown fences.
2. If a field is not present in the input, fill with the closest sensible value — do NOT use null.
3. NEVER invent features, competitors, or frameworks that are not in the input or probe.
4. Keep strings concise. Bullets must be parallel in form.

REQUIRED JSON SHAPE:
{
  "category": { "primary": "...", "secondary": "..." },
  "target_user": { "segment": "...", "role": "...", "company_size": "solo|smb|midmarket|enterprise|unknown" },
  "value_proposition": { "one_sentence": "...", "bullets": ["...", "...", "..."] },
  "claimed_features": ["...", "..."],
  "claimed_competitors": ["..."],
  "differentiation_claims": ["..."],
  "pricing_model": "free|freemium|subscription|usage|one_time|unknown",
  "tech_signals": { "url_probed": ${probe.url_probed ? "true" : "false"}, "has_schema_org": ${probe.has_schema_org ? "true" : "false"}, "framework_hints": ${JSON.stringify(probe.framework_hints)} },
  "extraction_confidence": <number 0..1>
}`;
}

function tryParseJson(raw: string): unknown | null {
  // Strip ``` fences if the model wrapped the JSON anyway.
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
  }
  // Try direct parse
  try {
    return JSON.parse(text);
  } catch {
    // Last-ditch: extract first {...} block.
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first !== -1 && last > first) {
      try {
        return JSON.parse(text.slice(first, last + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Extract a structured envelope from raw user input. Safe to call repeatedly;
 * given identical input + identical probe outcome, output is deterministic.
 *
 * Behavior:
 *   - URL probe runs in parallel with the LLM (we still need probe data in the
 *     prompt, so in practice they run sequentially — but each is bounded).
 *   - On JSON parse failure, retries ONCE with a strict nudge.
 *   - On retry failure, throws. Caller should decide whether to fall back.
 */
export async function extractStructured(
  input: ExtractionInput,
  opts?: { model?: string }
): Promise<Extraction> {
  // Normalize & validate input shape up front.
  if (!input.name || input.name.trim().length < 2) {
    throw new Error("extractStructured: name is required (min 2 chars)");
  }
  if (!input.description || input.description.trim().length < 10) {
    throw new Error("extractStructured: description is required (min 10 chars)");
  }

  const urlProvided =
    typeof input.url === "string" &&
    input.url.trim().length > 0 &&
    /^https?:\/\//i.test(input.url.trim());

  const probe: ProbeResult = urlProvided
    ? await probeUrl(input.url!.trim())
    : { url_probed: false, has_schema_org: false, framework_hints: [] };

  const model =
    opts?.model ||
    process.env.OLLAMA_ANALYSIS_MODEL ||
    "deepseek-v4-pro:cloud";

  const prompt = buildExtractionPrompt(input, probe);

  const systemMsg =
    "You are a strict structured-data extraction model. You ALWAYS respond with a single valid JSON object matching the required shape. No prose, no markdown fences, no explanation.";

  let raw = await callOllamaChat({
    model,
    messages: [
      { role: "system", content: systemMsg },
      { role: "user", content: prompt },
    ],
    temperature: 0.1,
    maxTokens: 1500,
  });

  let parsed = tryParseJson(raw);
  if (parsed === null) {
    // One retry with a strict nudge
    raw = await callOllamaChat({
      model,
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: prompt },
        {
          role: "assistant",
          content: raw, // surface what we already got so the model can correct
        },
        {
          role: "user",
          content:
            "Your previous response was not valid JSON. Re-emit ONLY a single JSON object matching the required shape. No markdown, no prose.",
        },
      ],
      temperature: 0.0,
      maxTokens: 1500,
    });
    parsed = tryParseJson(raw);
    if (parsed === null) {
      throw new Error(
        "extractStructured: model returned non-JSON after retry"
      );
    }
  }

  // Validate against Zod
  const result = ExtractionSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      "extractStructured: model output failed schema validation: " +
        JSON.stringify(result.error.flatten())
    );
  }

  const r: RawExtraction = result.data;

  // Hydrate final envelope with probe-only fields + derived metadata.
  const tech_signals: Extraction["tech_signals"] = {
    ...probe,
    // model may echo these; probe values are authoritative for tech_signals
    url_probed: probe.url_probed,
    has_schema_org: probe.has_schema_org,
    framework_hints:
      probe.framework_hints.length > 0
        ? probe.framework_hints
        : r.tech_signals.framework_hints.slice(0, 10),
  };

  // Normalize claimed_competitors: prefer user input over model output
  const userComps = normalizeCompetitors(input.competitors);
  const claimed_competitors =
    userComps.length > 0 ? userComps : r.claimed_competitors.slice(0, 10);

  return {
    category: r.category,
    target_user: r.target_user,
    value_proposition: r.value_proposition,
    claimed_features: r.claimed_features.slice(0, 20),
    claimed_competitors,
    differentiation_claims: r.differentiation_claims.slice(0, 8),
    pricing_model: normalizePricing(r.pricing_model),
    tech_signals,
    extraction_confidence: computeConfidence(input, tech_signals),
    model,
    extracted_at: new Date().toISOString(),
  };
}