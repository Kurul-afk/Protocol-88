// src/hooks/useTypeWritter.ts
"use client";

import { useEffect, useRef, useState } from "react";

interface UseTypewriterOptions {
  charDelay?: number;
  lineGap?: number;
  startDelay?: number;
  onChar?: () => void;
  /** Вызывается один раз, когда строка полностью напечатана (переход к следующей) */
  onLineComplete?: () => void;
}

export function useTypewriter(
  lines: string[],
  {
    charDelay = 18,
    lineGap = 260,
    startDelay = 0,
    onChar,
    onLineComplete,
  }: UseTypewriterOptions = {},
) {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState(-1);
  const [isDone, setIsDone] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const onCharRef = useRef(onChar);
  const onLineCompleteRef = useRef(onLineComplete);
  onCharRef.current = onChar;
  onLineCompleteRef.current = onLineComplete;

  useEffect(() => {
    setTypedLines([]);
    setActiveLine(-1);
    setIsDone(false);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const result: string[] = [];
    let lineIndex = 0;
    let charIndex = 0;

    function typeNextChar() {
      if (lineIndex >= lines.length) {
        setIsDone(true);
        return;
      }
      setActiveLine(lineIndex);

      if (prefersReducedMotion) {
        result[lineIndex] = lines[lineIndex];
        setTypedLines([...result]);
        onLineCompleteRef.current?.();
        lineIndex += 1;
        timeoutRef.current = setTimeout(typeNextChar, 40);
        return;
      }

      const line = lines[lineIndex];
      if (charIndex < line.length) {
        result[lineIndex] = line.slice(0, charIndex + 1);
        setTypedLines([...result]);
        charIndex += 1;
        if (charIndex % 3 === 0) onCharRef.current?.();
        timeoutRef.current = setTimeout(typeNextChar, charDelay);
      } else {
        onLineCompleteRef.current?.();
        lineIndex += 1;
        charIndex = 0;
        timeoutRef.current = setTimeout(typeNextChar, lineGap);
      }
    }

    timeoutRef.current = setTimeout(typeNextChar, startDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines.join("\u0001")]);

  return { typedLines, activeLine, isDone };
}
