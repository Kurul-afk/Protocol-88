// src/components/ui/TapeButton.tsx
"use client";

import {
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>;

interface TapeButtonProps extends NativeButtonProps {
  scareTexts?: string[];
  glitchOnHover?: boolean;
  trembleOnHover?: boolean;
}

export function TapeButton({
  children,
  scareTexts = ["[ ОНИ УЖЕ ВНУТРИ ]", "[ НЕ СМОТРИ ЕМУ В ГЛАЗА ]"],
  glitchOnHover = true,
  trembleOnHover = true,
  className,
  onClick,
  ...props
}: TapeButtonProps) {
  const [displayText, setDisplayText] = useState<ReactNode>(children);
  const [glitching, setGlitching] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseEnter = () => {
    if (!glitchOnHover || scareTexts.length === 0 || prefersReducedMotion)
      return;

    const scare = scareTexts[Math.floor(Math.random() * scareTexts.length)];
    setDisplayText(scare);
    setGlitching(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDisplayText(children);
      setGlitching(false);
    }, 260);
  };

  const trembleAnimation =
    trembleOnHover && !prefersReducedMotion
      ? {
          x: [0, -2, 2, -1.5, 1.5, -1, 1, 0],
          y: [0, 1, -1, 1, -1, 0.5, -0.5, 0],
          transition: {
            duration: 0.35,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        }
      : undefined;

  return (
    <motion.button
      type="button"
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      whileHover={trembleAnimation}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "cursor-pointer bg-transparent border border-[var(--paper-dim)] text-[var(--paper)]",
        "px-8 py-3.5 text-[15px] tracking-[3px] uppercase font-mono",
        "transition-colors duration-150",
        "hover:border-[var(--red-bright)] hover:text-white",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--red-bright)] focus-visible:outline-offset-[3px]",
        glitching && "animate-[btnglitch_0.28s_steps(2,end)]",
        className,
      )}
      {...props}
    >
      {displayText}
    </motion.button>
  );
}
