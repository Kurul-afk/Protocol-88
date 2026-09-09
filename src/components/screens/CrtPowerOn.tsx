// src/components/screens/CrtPowerOn.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTapeAudio } from "@/hooks/useTapeAudio";

interface CrtPowerOnProps {
  onComplete: () => void;
}

const FALLBACK_DURATION_MS = 900; // если файл не загрузился вообще

export function CrtPowerOn({ onComplete }: CrtPowerOnProps) {
  const { playVhsPowerOn } = useTapeAudio();
  const [phase, setPhase] = useState<"line" | "expand" | "flicker" | "done">(
    "line",
  );

  useEffect(() => {
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    playVhsPowerOn().then((durationSec) => {
      if (cancelled) return;
      const totalMs =
        durationSec > 0 ? durationSec * 1000 : FALLBACK_DURATION_MS;

      // фазы визуального эффекта распределены пропорционально
      // реальной длине звука, а не фиксированными числами
      const lineEnd = totalMs * 0.18;
      const expandEnd = totalMs * 0.5;
      const flickerEnd = totalMs * 0.85;

      timeouts.push(setTimeout(() => setPhase("expand"), lineEnd));
      timeouts.push(setTimeout(() => setPhase("flicker"), expandEnd));
      timeouts.push(setTimeout(() => setPhase("done"), flickerEnd));
      timeouts.push(setTimeout(() => onComplete(), totalMs));
    });

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-black"
    >
      {phase === "line" && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="h-[2px] bg-[var(--paper)] [box-shadow:0_0_12px_4px_rgba(217,212,196,0.6)]"
        />
      )}

      {phase === "expand" && (
        <motion.div
          initial={{ height: "2px", opacity: 1 }}
          animate={{ height: "100%", opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.3, 1] }}
          className="w-full bg-[var(--paper)]"
        />
      )}

      {phase === "flicker" && (
        <motion.div
          className="absolute inset-0 bg-[var(--paper)]"
          animate={{ opacity: [1, 0.15, 0.85, 0.05, 1, 0] }}
          transition={{ duration: 0.3, times: [0, 0.15, 0.3, 0.5, 0.7, 1] }}
        />
      )}
    </motion.div>
  );
}
