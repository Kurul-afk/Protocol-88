// src/hooks/useQuestionTimer.ts
"use client";

import { useEffect, useRef } from "react";

/**
 * Запускает таймер на durationMs при монтировании и вызывает onTimeout,
 * если за это время колбэк не был отменён снаружи (enabled=false).
 * Компонент-потребитель должен размонтироваться/пересоздаваться через key
 * при смене вопроса — тогда эффект перезапускается сам по себе.
 */
export function useQuestionTimer(
  durationMs: number,
  onTimeout: () => void,
  enabled: boolean = true,
) {
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    if (!enabled) return;
    const id = setTimeout(() => {
      onTimeoutRef.current();
    }, durationMs);
    return () => clearTimeout(id);
  }, [durationMs, enabled]);
}
