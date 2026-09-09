// src/components/test/BootGate.tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CrtPowerOn } from "@/components/screens/CrtPowerOn";

export function BootGate({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false);
  const [poweredOn, setPoweredOn] = useState(false);

  useEffect(() => {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    [
      "/sounds/typewriter-1.mp3",
      "/sounds/typewriter-2.mp3",
      "/sounds/vhs-power-on.mp3",
    ].forEach((path) => {
      fetch(path)
        .then((r) => r.arrayBuffer())
        .then((buf) => ctx.decodeAudioData(buf))
        .catch(() => {});
    });
  }, []);

  if (!started) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => setStarted(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setStarted(true);
        }}
        className="flex h-screen w-full cursor-pointer items-center justify-center bg-black p-4"
      >
        <span className="animate-pulse font-mono text-sm tracking-wide text-[var(--paper-dim)]">
          НАЖМИТЕ ДЛЯ НАЧАЛА ЗАПИСИ
        </span>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!poweredOn ? (
        <CrtPowerOn key="power-on" onComplete={() => setPoweredOn(true)} />
      ) : (
        <motion.div
          key="content"
          initial={{
            opacity: 0,
            scaleY: 0.85,
            filter: "brightness(2) contrast(0.6)",
          }}
          animate={{
            opacity: 1,
            scaleY: 1,
            filter: "brightness(1) contrast(1)",
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "center" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
