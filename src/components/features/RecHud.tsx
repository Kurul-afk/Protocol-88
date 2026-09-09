// src/components/ui/RecHud.tsx
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RecHudProps {
  channelLabel?: string;
  className?: string;
}

function formatTimecode(totalSeconds: number): string {
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function RecHud({
  channelLabel = "СИСТЕМА ОПОВЕЩЕНИЯ · КАНАЛ 03",
  className,
}: RecHudProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - start) / 1000));
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none absolute top-0 left-0 right-0 z-40",
        "flex justify-between px-[22px] py-4",
        "font-mono text-[13px] tracking-wide text-[var(--paper-dim)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-[var(--red-bright)]">
        <span
          className={cn(
            "inline-block h-2 w-2 rounded-full bg-[var(--red-bright)]",
            "shadow-[0_0_6px_var(--red-bright)]",
            "animate-[recBlink_1s_steps(1)_infinite]",
          )}
        />
        <span className="uppercase tracking-[2px]">
          ЗАПИСЬ ●{" "}
          <span className="tabular-nums">{formatTimecode(seconds)}</span>
        </span>
      </div>
      <div>{channelLabel}</div>
    </div>
  );
}
