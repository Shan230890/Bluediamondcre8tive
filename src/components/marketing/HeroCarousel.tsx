"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    stat: "Two ways to work with us",
    body: "A done-for-you marketing service, and a self-serve platform of tools, under one account.",
  },
  {
    stat: "Principal-reviewed",
    body: "Every Services deliverable is signed off by our principal before it reaches you, not just an AI pipeline.",
  },
  {
    stat: "Self-serve or done-for-you",
    body: "Start with the Vault for instant access, or hand the whole thing to our team. Your call.",
  },
];

/** Small spring-swapped carousel card in the hero's right column. */
export function HeroCarousel() {
  const [i, setI] = useState(0);
  const slide = SLIDES[i];

  return (
    <div className="bdc-carousel">
      <div className="bdc-carousel-body" key={i}>
        <span className="bdc-carousel-stat">{slide.stat}</span>
        <p>{slide.body}</p>
      </div>
      <div className="bdc-carousel-controls">
        <div className="bdc-carousel-dots">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`bdc-carousel-dot ${idx === i ? "bdc-carousel-dot-active" : ""}`}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
            />
          ))}
        </div>
        <div className="bdc-carousel-arrows">
          <button type="button" aria-label="Previous" onClick={() => setI((v) => (v - 1 + SLIDES.length) % SLIDES.length)}>
            <ChevronLeft size={16} />
          </button>
          <button type="button" aria-label="Next" onClick={() => setI((v) => (v + 1) % SLIDES.length)}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
