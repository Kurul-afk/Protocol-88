// src/components/ui/GlowText.tsx
"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface GlowTextProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export function GlowText({
  children,
  className,
  color = "217,212,196",
}: GlowTextProps) {
  const prefersReducedMotion = useReducedMotion();

  const glowKeyframes = [
    `0 0 6px rgba(${color},0.35), 0 0 14px rgba(${color},0.15)`,
    `0 0 12px rgba(${color},0.55), 0 0 26px rgba(${color},0.28)`,
    `0 0 6px rgba(${color},0.35), 0 0 14px rgba(${color},0.15)`,
  ];

  return (
    <motion.span
      className={className}
      style={
        prefersReducedMotion ? { textShadow: glowKeyframes[0] } : undefined
      }
      animate={prefersReducedMotion ? undefined : { textShadow: glowKeyframes }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}
