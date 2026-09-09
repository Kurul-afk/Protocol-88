// src/components/test/ResultScreen.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { TapeButton } from "@/components/ui/TapeButton";
import { Stamp } from "@/components/ui/Stamp";
import type { Ending } from "@/lib/ending";

interface ResultScreenProps {
  ending: Ending;
  score: number;
  total: number;
  timedOutCount: number;
  sessionId: string | null;
}

export function ResultScreen({
  ending,
  total,
  timedOutCount,
  sessionId,
}: ResultScreenProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen w-full items-center justify-center overflow-hidden bg-background p-4"
    >
      <div className="w-full max-w-[560px] text-center">
        <Stamp>ОЦЕНКА ЗАВЕРШЕНА</Stamp>

        <h1 className="mt-5 mb-4 font-mono text-[clamp(22px,4vw,32px)] uppercase leading-[1.2] tracking-[1.5px] text-[var(--paper)]">
          {ending.title}
        </h1>

        <p className="mx-auto mb-8 max-w-[480px] font-mono text-sm leading-relaxed text-[var(--paper-dim)]">
          {ending.text}
        </p>

        {timedOutCount > 0 && (
          <p className="mb-8 font-mono text-xs uppercase tracking-wide text-[var(--red-bright)]">
            Зафиксировано задержек ответа: {timedOutCount} из {total}
          </p>
        )}

        <TapeButton onClick={() => router.push("/")}>
          [ Пройти тест заново ]
        </TapeButton>

        <div className="mt-9 font-mono text-[11px] tracking-wide text-[var(--grey)]">
          ЗАПИСЬ ОСТАНОВЛЕНА · ИЗЪЯТА ДЛЯ АРХИВА
          {sessionId && (
            <>
              <br />
              ПРОТОКОЛ №{sessionId.slice(-8).toUpperCase()}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
