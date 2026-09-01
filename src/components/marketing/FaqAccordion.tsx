"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FaqEntry = { question: string; answer: React.ReactNode };

/** Simple single-open-at-a-time accordion, no external library. */
export function FaqAccordion({ entries }: { entries: FaqEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bdc-faq">
      {entries.map((entry, i) => {
        const open = openIndex === i;
        return (
          <div className={`bdc-faq-row ${open ? "bdc-faq-open" : ""}`} key={entry.question}>
            <button
              type="button"
              className="bdc-faq-question"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              {entry.question}
              <ChevronDown size={18} className="bdc-faq-chevron" />
            </button>
            <div className="bdc-faq-answer">
              <div className="bdc-faq-answer-inner">
                <p>{entry.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
