"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

const FADE_EASE = 0.07;
const DPR_CAP = 2;

/**
 * The hero's signature liquid-reveal: a base "before" layer (scattered,
 * grayscale abstract chaos -- scattered tabs / spreadsheets / disconnected
 * tools) sits underneath at all times. Hovering anywhere in the hero fades
 * in an "after" layer (a clean orange-accented grid/dashboard composition)
 * across the ENTIRE hero at once, not just a localized brush trail around
 * the cursor -- moving the mouse away fades it back out. Nothing here is a
 * photo -- both layers are drawn shapes, true to Blue Diamond Cre8tive
 * having no photography asset library.
 *
 * On prefers-reduced-motion or touch, the canvas never mounts: the visitor
 * sees a static half-and-half split of the two layers instead.
 */
export function LiquidHero() {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const artRef = useRef<HTMLCanvasElement | null>(null);
  const [staticFallback, setStaticFallback] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    // Touch/pointer capability is unknown until after mount (SSR has no
    // window), so this correction can't be a lazy initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (reduced || isTouch) setStaticFallback(true);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const wrap = canvas?.parentElement;
    if (!canvas || !wrap) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    let width = 0;
    let height = 0;

    const art = document.createElement("canvas");
    const artCtx = art.getContext("2d");
    artRef.current = art;

    // Read the design token at runtime rather than hardcoding a duplicate
    // rgb triplet — every accent colour drawn on the canvas traces back to
    // the same --accent-rgb custom property the rest of the CSS uses.
    const accentRgb = (
      getComputedStyle(wrap.closest(".landing-e") || wrap).getPropertyValue("--accent-rgb") || "247, 101, 45"
    ).trim();

    function drawAfterArt() {
      if (!artCtx) return;
      artCtx.clearRect(0, 0, width, height);
      // Clean, orange-accented abstract "dashboard" grid composition.
      const cols = 6;
      const rows = 4;
      const gx = width / cols;
      const gy = height / rows;
      artCtx.fillStyle = "#0f2437";
      artCtx.fillRect(0, 0, width, height);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if ((r + c) % 3 === 0) continue;
          const pad = Math.min(gx, gy) * 0.12;
          const x = c * gx + pad;
          const y = r * gy + pad;
          const w = gx - pad * 2;
          const h = gy - pad * 2;
          const isAccent = (r * cols + c) % 5 === 0;
          artCtx.fillStyle = isAccent ? `rgba(${accentRgb},0.85)` : "rgba(255,255,255,0.08)";
          const radius = 10;
          artCtx.beginPath();
          artCtx.roundRect(x, y, w, h, radius);
          artCtx.fill();
          if (isAccent) {
            artCtx.strokeStyle = "rgba(255,255,255,0.35)";
            artCtx.lineWidth = 1;
            artCtx.stroke();
          }
        }
      }
      // Thin connective grid lines to read as a dashboard/system.
      artCtx.strokeStyle = `rgba(${accentRgb},0.25)`;
      artCtx.lineWidth = 1;
      for (let c = 1; c < cols; c++) {
        artCtx.beginPath();
        artCtx.moveTo(c * gx, 0);
        artCtx.lineTo(c * gx, height);
        artCtx.stroke();
      }
    }

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      for (const c of [canvas, art]) {
        if (!c) continue;
        c.width = width * dpr;
        c.height = height * dpr;
        c.style.width = `${width}px`;
        c.style.height = `${height}px`;
      }
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      artCtx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawAfterArt();
    }

    // Whole-hero hover fade: any pointer movement inside the hero counts as
    // "hovering" (not just directly over the canvas), so moving the mouse
    // anywhere across the background highlights the entire after-layer at
    // once rather than tracing a small brush trail behind the cursor.
    let hovering = false;
    let opacity = 0;

    function onPointerMove() {
      hovering = true;
    }
    function onPointerLeave() {
      hovering = false;
    }

    let raf = 0;
    function frame() {
      if (!ctx) return;

      const target = hovering ? 1 : 0;
      opacity += (target - opacity) * FADE_EASE;
      if (Math.abs(target - opacity) < 0.002) opacity = target;

      ctx.clearRect(0, 0, width, height);
      if (opacity > 0.001) {
        ctx.globalAlpha = opacity;
        ctx.drawImage(art, 0, 0, width, height);
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerenter", onPointerMove);
    wrap.addEventListener("pointerleave", onPointerLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerenter", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reduced]);

  return (
    <div className="bdc-liquid-wrap">
      {/* Base "before" layer: cluttered, muted, grayscale abstraction of
          scattered tools/spreadsheets/disconnected tabs -- always visible. */}
      <svg className="bdc-liquid-before" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="800" height="500" fill="#e2e2e0" />
        {Array.from({ length: 22 }).map((_, i) => {
          const seed = i * 37;
          const x = (seed * 13) % 760;
          const y = (seed * 29) % 460;
          const w = 40 + ((seed * 7) % 90);
          const h = 20 + ((seed * 11) % 50);
          const rotate = ((seed * 3) % 14) - 7;
          const shade = 60 + ((seed * 5) % 40);
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={h}
              fill={`rgb(${shade},${shade},${shade})`}
              opacity={0.35}
              transform={`rotate(${rotate} ${x + w / 2} ${y + h / 2})`}
              rx={4}
            />
          );
        })}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`l-${i}`}
            x1={(i * 83) % 800}
            y1={0}
            x2={(i * 83 + 60) % 800}
            y2={500}
            stroke="#333333"
            strokeOpacity={0.08}
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* Liquid-reveal canvas: only rendered content when JS/canvas can run. */}
      <canvas ref={canvasRef} className="bdc-liquid-canvas" aria-hidden="true" />

      {/* Static fallback for reduced-motion / touch: half-opacity clean art. */}
      {staticFallback && <div className="bdc-liquid-static" aria-hidden="true" />}
    </div>
  );
}
