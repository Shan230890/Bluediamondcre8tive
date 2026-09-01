"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

const BRUSH_RADIUS = 145;
const DECAY = 0.018;
const IDLE_CLEAR_FRAMES = 120;
const DPR_CAP = 2;

/**
 * The hero's signature liquid-reveal: a base "before" layer (scattered,
 * grayscale abstract chaos -- scattered tabs / spreadsheets / disconnected
 * tools) sits underneath at all times. A canvas paints a soft brush trail
 * along the cursor that reveals an "after" layer (a clean orange-accented
 * grid/dashboard composition) only where the pointer has been, with a
 * radial-gradient brush and per-frame decay so the reveal dissolves once the
 * pointer stops. Nothing here is a photo -- both layers are drawn shapes,
 * true to Blue Diamond Cre8tive having no photography asset library.
 *
 * On prefers-reduced-motion or touch, the canvas never mounts: the visitor
 * sees a static half-and-half split of the two layers instead.
 */
export function LiquidHero() {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const artRef = useRef<HTMLCanvasElement | null>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
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

    const mask = document.createElement("canvas");
    const maskCtx = mask.getContext("2d");
    maskRef.current = mask;

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
      for (const c of [canvas, art, mask]) {
        if (!c) continue;
        c.width = width * dpr;
        c.height = height * dpr;
        c.style.width = `${width}px`;
        c.style.height = `${height}px`;
      }
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      artCtx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      maskCtx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawAfterArt();
    }

    let pointerX = -9999;
    let pointerY = -9999;
    let idleFrames = IDLE_CLEAR_FRAMES;
    let lastX = -9999;
    let lastY = -9999;

    function onPointerMove(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      idleFrames = 0;
    }
    function onPointerLeave() {
      pointerX = -9999;
      pointerY = -9999;
    }

    let raf = 0;
    function frame() {
      if (!maskCtx || !ctx) return;

      const moved = Math.hypot(pointerX - lastX, pointerY - lastY) > 0.5;
      if (moved && pointerX > -1000) {
        const grad = maskCtx.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, BRUSH_RADIUS);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.6, "rgba(255,255,255,0.8)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        maskCtx.globalCompositeOperation = "source-over";
        maskCtx.fillStyle = grad;
        maskCtx.beginPath();
        maskCtx.arc(pointerX, pointerY, BRUSH_RADIUS, 0, Math.PI * 2);
        maskCtx.fill();
        lastX = pointerX;
        lastY = pointerY;
      }

      idleFrames += 1;
      const fadeAmount = idleFrames > 40 ? DECAY * 3 : DECAY;
      maskCtx.globalCompositeOperation = "destination-out";
      maskCtx.fillStyle = `rgba(0,0,0,${fadeAmount})`;
      maskCtx.fillRect(0, 0, width, height);

      if (idleFrames > IDLE_CLEAR_FRAMES) {
        maskCtx.clearRect(0, 0, width, height);
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(art, 0, 0, width, height);
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, 0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerleave", onPointerLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("pointermove", onPointerMove);
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
