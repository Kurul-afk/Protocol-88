// src/components/ui/Stamp.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StampProps {
  children?: ReactNode;
  className?: string;
}

export function Stamp({
  children = "МЧС · ОТДЕЛ ОЦЕНКИ УГРОЗ",
  className,
}: StampProps) {
  return (
    <div
      className={cn(
        "inline-block border border-[var(--grey)] px-2.5 py-[3px]",
        "text-[11px] tracking-[3px] uppercase font-mono text-[var(--paper-dim)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
