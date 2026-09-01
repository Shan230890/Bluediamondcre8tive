"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { useReducedMotion } from "./useReducedMotion";
import { useReady } from "./ReadyContext";

/**
 * Line-reveal: splits `lines` into overflow-hidden rows, each inner span
 * translating up from 100% with a per-line stagger. Plays once, the first
 * time it scrolls into view -- and, for hero copy, only once the intro
 * loader has finished (via ReadyContext).
 */
export function LineReveal({
  lines,
  as: Tag = "h2",
  className = "",
  gateOnReady = false,
  staggerMs = 110,
  style,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  /** Hero headings gate on the loader; everything else just uses scroll. */
  gateOnReady?: boolean;
  staggerMs?: number;
  style?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  const ready = useReady();
  const ref = useRef<HTMLDivElement | null>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (reduced) {
      // Reduced-motion preference is unknown until after mount; skip
      // straight to the settled state rather than animating.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlay(true);
      return;
    }
    if (gateOnReady && !ready) return;
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setPlay(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPlay(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced, gateOnReady, ready]);

  return (
    <div ref={ref} className="bdc-line-reveal-wrap">
      <Tag className={`bdc-line-reveal ${className}`} style={style}>
        {lines.map((line, i) => (
          <span className="bdc-line-row" key={`${i}-${line}`}>
            <span
              className={`bdc-line-inner ${play ? "bdc-in" : ""}`}
              style={{ transitionDelay: play ? `${i * staggerMs}ms` : "0ms" }}
            >
              {line}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

/**
 * Word-reveal: splits `text` into words, each fading + rising with a 35ms
 * stagger. Used for the About statement.
 */
export function WordReveal({
  text,
  mutedWords = [],
  className = "",
}: {
  text: string;
  /** Words (case-sensitive, matched whole) rendered in the muted tone. */
  mutedWords?: string[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [play, setPlay] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    if (reduced) {
      // Reduced-motion preference is unknown until after mount; skip
      // straight to the settled state rather than animating.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlay(true);
      return;
    }
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setPlay(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPlay(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <p ref={ref} className={`bdc-word-reveal ${className}`}>
      {words.map((word, i) => (
        <span className="bdc-word-mask" key={`${i}-${word}`}>
          <span
            className={`bdc-word-inner ${mutedWords.includes(word.replace(/[.,]/g, "")) ? "bdc-word-muted" : ""} ${play ? "bdc-in" : ""}`}
            style={{ transitionDelay: play ? `${i * 35}ms` : "0ms" }}
          >
            {word}&nbsp;
          </span>
        </span>
      ))}
    </p>
  );
}
