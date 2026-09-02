import { describe, expect, it } from "vitest";
import { parseAiText } from "./render-ai-text";

describe("parseAiText", () => {
  it("handles an empty string without crashing", () => {
    expect(parseAiText("")).toEqual([]);
  });

  it("parses plain paragraphs, including a blank-line break", () => {
    const blocks = parseAiText("First paragraph.\n\nSecond paragraph.");
    expect(blocks).toEqual([
      { type: "paragraph", text: "First paragraph." },
      { type: "paragraph", text: "Second paragraph." },
    ]);
  });

  it("joins soft-wrapped lines within one paragraph", () => {
    const blocks = parseAiText("Line one\nLine two still part of it.");
    expect(blocks).toEqual([{ type: "paragraph", text: "Line one Line two still part of it." }]);
  });

  it("keeps a **bold** marker as raw text in the parsed block (inline rendering happens in JSX)", () => {
    const blocks = parseAiText("This is **bold** text.");
    expect(blocks).toEqual([{ type: "paragraph", text: "This is **bold** text." }]);
  });

  it("parses a bullet list using both - and * markers", () => {
    const blocks = parseAiText("- First item\n- Second item\n* Third item");
    expect(blocks).toEqual([{ type: "bullet-list", items: ["First item", "Second item", "Third item"] }]);
  });

  it("parses a numbered list", () => {
    const blocks = parseAiText("1. Step one\n2. Step two\n3. Step three");
    expect(blocks).toEqual([{ type: "numbered-list", items: ["Step one", "Step two", "Step three"] }]);
  });

  it("parses mixed content: heading, paragraph, bullets, numbered list", () => {
    const text = [
      "## Summary",
      "",
      "Here is the plan.",
      "",
      "- Do this",
      "- Do that",
      "",
      "1. Then this",
      "2. Then that",
    ].join("\n");

    const blocks = parseAiText(text);
    expect(blocks).toEqual([
      { type: "heading", level: 2, text: "Summary" },
      { type: "paragraph", text: "Here is the plan." },
      { type: "bullet-list", items: ["Do this", "Do that"] },
      { type: "numbered-list", items: ["Then this", "Then that"] },
    ]);
  });

  it("parses ### as a level-3 heading", () => {
    const blocks = parseAiText("### Details");
    expect(blocks).toEqual([{ type: "heading", level: 3, text: "Details" }]);
  });

  it("treats a lone, unmatched ** as literal text rather than crashing or dropping content", () => {
    const blocks = parseAiText("This has a stray ** marker in it.");
    expect(blocks).toEqual([{ type: "paragraph", text: "This has a stray ** marker in it." }]);
  });

  it("does not drop content on malformed/irregular input", () => {
    const text = "   \n\n  - \n\nrandom # not a heading\n";
    const blocks = parseAiText(text);
    // Should not throw, and every non-empty, non-whitespace-only source
    // fragment should still surface in some block.
    expect(() => parseAiText(text)).not.toThrow();
    const allText = blocks.map((b) => ("text" in b ? b.text : b.items.join(" "))).join(" ");
    expect(allText).toContain("random # not a heading");
  });

  it("switches cleanly from a bullet list to a numbered list without a blank line between them", () => {
    const blocks = parseAiText("- bullet one\n1. numbered one");
    expect(blocks).toEqual([
      { type: "bullet-list", items: ["bullet one"] },
      { type: "numbered-list", items: ["numbered one"] },
    ]);
  });
});
