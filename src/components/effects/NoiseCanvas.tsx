// src/components/effects/NoiseCanvas.tsx
"use client";

import { useEffect, useRef } from "react";

interface NoiseCanvasProps {
  opacity?: number;
  /** периодические горизонтальные полосы "срыва трекинга", как на изношенной кассете */
  tracking?: boolean;
}

export function NoiseCanvas({
  opacity = 0.05,
  tracking = true,
}: NoiseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let rafId: number;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // состояние полосы срыва трекинга — живёт между кадрами
    let bandActive = false;
    let bandY = 0;
    let bandHeight = 0;
    let bandShift = 0;
    let bandTimer = 0;

    function maybeStartBand(h: number) {
      bandTimer -= 1;
      if (bandTimer <= 0) {
        bandTimer = 90 + Math.random() * 220; // раз в ~1.5–5 секунд при 60fps
        if (Math.random() < 0.5) {
          bandActive = true;
          bandY = Math.random() * h;
          bandHeight = 4 + Math.random() * 14;
          bandShift = (Math.random() - 0.5) * 40;
        }
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      const imgData = ctx.createImageData(w, h);
      const buf = imgData.data;
      for (let i = 0; i < buf.length; i += 4) {
        const v = Math.random() * 255;
        // лёгкий цветовой шум вместо чистого ЧБ — на глаз читается
        // как "аналоговый" шум камкордера, а не цифровой TV-снег
        buf[i] = v;
        buf[i + 1] = Math.max(0, Math.min(255, v + (Math.random() - 0.5) * 12));
        buf[i + 2] = Math.max(0, Math.min(255, v + (Math.random() - 0.5) * 12));
        buf[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);

      if (tracking) {
        if (bandActive) {
          try {
            ctx.drawImage(
              canvas,
              0,
              bandY,
              w,
              bandHeight,
              bandShift,
              bandY,
              w,
              bandHeight,
            );
          } catch {
            // canvas ещё не готов к самокопированию на первом кадре — пропускаем
          }
          bandActive = false;
        } else {
          maybeStartBand(h);
        }
      }

      if (!prefersReducedMotion) rafId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [tracking]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[50] mix-blend-overlay"
      style={{ opacity }}
    />
  );
}
