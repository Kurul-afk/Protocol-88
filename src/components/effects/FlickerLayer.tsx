// src/components/effects/FlickerLayer.tsx
"use client";

import { useEffect, useRef } from "react";

export function FlickerLayer() {
  const flickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = flickerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleFlicker() {
      const delay = 500 + Math.random() * 1600;
      timeoutId = setTimeout(() => {
        if (el && Math.random() < 0.07) {
          el.style.opacity = (Math.random() * 0.09).toFixed(3);
          setTimeout(
            () => {
              if (el) el.style.opacity = "0";
            },
            50 + Math.random() * 70,
          );
        }
        scheduleFlicker();
      }, delay);
    }
    scheduleFlicker();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      ref={flickerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[53] bg-white opacity-0"
    />
  );
}
