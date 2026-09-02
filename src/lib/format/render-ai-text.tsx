import { Fragment, type ReactNode } from "react";

/**
 * Dependency-free markdown-lite renderer for LLM-generated text.
 *
 * Scope is deliberately narrow: chatWithPersona() replies commonly include
 * **bold**, *italic*, "- "/"* " bullet lists, "1. " numbered lists, blank-line
 * paragraph breaks, and occasional "##"/"###" headers — nothing more exotic
 * (no tables, no code fences, no nested lists). A regex line-by-line parser
 * covers that surface fully; reaching for a markdown AST library would be
 * unjustified weight for one-call LLM chat output. Never throws — anything
 * it doesn't recognize falls back to a plain paragraph so content is never
 * dropped.
 *
 * Split into parseAiText() (pure, testable data transform) and
 * FormattedAiText (thin JSX wrapper) so the parsing logic can be unit
 * tested without a DOM/React renderer.
 */

type Block =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullet-list"; items: string[] }
  | { type: "numbered-list"; items: string[] };

const BULLET_RE = /^[-*]\s+(.*)$/;
const NUMBERED_RE = /^\d+[.)]\s+(.*)$/;
const HEADING_RE = /^(#{2,3})\s+(.*)$/;

/** Parses AI reply text into a flat list of block-level elements. Pure, no JSX. */
export function parseAiText(text: string): Block[] {
  if (!text || typeof text !== "string") return [];

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  let paragraphBuf: string[] = [];
  let bulletBuf: string[] = [];
  let numberedBuf: string[] = [];

  function flushParagraph() {
    if (paragraphBuf.length) {
      const joined = paragraphBuf.join(" ").trim();
      if (joined) blocks.push({ type: "paragraph", text: joined });
      paragraphBuf = [];
    }
  }
  function flushBullets() {
    if (bulletBuf.length) {
      blocks.push({ type: "bullet-list", items: bulletBuf });
      bulletBuf = [];
    }
  }
  function flushNumbered() {
    if (numberedBuf.length) {
      blocks.push({ type: "numbered-list", items: numberedBuf });
      numberedBuf = [];
    }
  }
  function flushAll() {
    flushParagraph();
    flushBullets();
    flushNumbered();
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      flushAll();
      continue;
    }

    const headingMatch = line.match(HEADING_RE);
    if (headingMatch) {
      flushAll();
      const level = headingMatch[1].length === 2 ? 2 : 3;
      blocks.push({ type: "heading", level, text: headingMatch[2].trim() });
      continue;
    }

    const bulletMatch = line.match(BULLET_RE);
    if (bulletMatch) {
      flushParagraph();
      flushNumbered();
      bulletBuf.push(bulletMatch[1]);
      continue;
    }

    const numberedMatch = line.match(NUMBERED_RE);
    if (numberedMatch) {
      flushParagraph();
      flushBullets();
      numberedBuf.push(numberedMatch[1]);
      continue;
    }

    // Plain text line: continues whichever list is open, else joins the
    // paragraph buffer (soft line breaks inside one block of prose).
    if (bulletBuf.length) {
      bulletBuf[bulletBuf.length - 1] += " " + line;
    } else if (numberedBuf.length) {
      numberedBuf[numberedBuf.length - 1] += " " + line;
    } else {
      paragraphBuf.push(line);
    }
  }
  flushAll();

  return blocks;
}

/** Splits one line of inline text on **bold** and *italic* markers. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  // Bold first (greedy but non-overlapping), then italic on the remainder.
  // A lone "*"/"**" that never closes is left as literal text, never dropped.
  const nodes: ReactNode[] = [];
  const combined = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = combined.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b${i++}`}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<em key={`${keyPrefix}-i${i++}`}>{match[2]}</em>);
    }
    lastIndex = combined.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes.length ? nodes : [text];
}

/**
 * Renders AI-generated reply/chat text with light markdown formatting.
 * Never apply this to user-authored input (task titles/descriptions, the
 * user's own chat messages) — only to LLM output, since user text is free
 * form and should render as literal plain text.
 */
export function FormattedAiText({ text }: { text: string }) {
  const blocks = parseAiText(text);
  if (blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, idx) => {
        const key = `block-${idx}`;
        switch (block.type) {
          case "heading": {
            const Tag = block.level === 2 ? "h4" : "h5";
            return <Tag key={key}>{renderInline(block.text, key)}</Tag>;
          }
          case "bullet-list":
            return (
              <ul key={key}>
                {block.items.map((item, i) => (
                  <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
                ))}
              </ul>
            );
          case "numbered-list":
            return (
              <ol key={key}>
                {block.items.map((item, i) => (
                  <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
                ))}
              </ol>
            );
          case "paragraph":
          default:
            return (
              <p key={key}>
                <Fragment>{renderInline(block.text, key)}</Fragment>
              </p>
            );
        }
      })}
    </>
  );
}
