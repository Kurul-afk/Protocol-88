// src/components/test/TimeoutWarning.tsx
"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function TimeoutWarning({ visible }: { visible: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mx-auto mb-5 flex max-w-[520px] items-center justify-center gap-2 border border-[var(--red-bright)] bg-[rgba(122,20,20,0.14)] px-3.5 py-2.5 font-mono text-[12.5px] uppercase tracking-wide text-[var(--red-bright)]"
        >
          <motion.span
            animate={prefersReducedMotion ? {} : { opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            ⚠ ЗАДЕРЖКА ОТВЕТА ПРЕВЫШЕНА · ЗАФИКСИРОВАНО В ЖУРНАЛЕ ⚠
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
