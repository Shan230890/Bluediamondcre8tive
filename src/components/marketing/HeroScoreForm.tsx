"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

/**
 * Hero-embedded lightweight Cre8tive Score capture, modeled on Metaflow's
 * "Enter your website -> Get my free GTM report" hero pattern. This does NOT
 * call /api/score directly (that endpoint requires an email + a 20-2000
 * char description per its zod schema in src/app/api/score/route.ts) — it
 * collects just the idea name + a one-line description here, then deep-links
 * into the full /tools/score form with those fields pre-filled via query
 * params, where the visitor completes email + submits for real. Keeps a
 * single source of truth for the scoring flow instead of duplicating it.
 */
export function HeroScoreForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (name.trim()) params.set("name", name.trim());
    if (description.trim()) params.set("description", description.trim());
    router.push(`/tools/score${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form className="bdc-hero-score-form" onSubmit={onSubmit}>
      <div className="bdc-hero-score-row">
        <input
          type="text"
          placeholder="Idea or product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          aria-label="Idea or product name"
        />
        <input
          type="text"
          placeholder="What are you building?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
          aria-label="What are you building?"
        />
        <button type="submit">
          Get my free score
          <ArrowRight size={14} />
        </button>
      </div>
      <p className="bdc-hero-score-note">Free, no credit card. 3 scores included before you need an account.</p>
    </form>
  );
}
