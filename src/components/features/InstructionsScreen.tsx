// src/components/test/InstructionsScreen.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTypewriter } from "@/hooks/useTypeWritter";
import { useTapeAudio } from "@/hooks/useTapeRadio";
import { TapeButton } from "@/components/ui/TapeButton";
import { cn } from "@/lib/utils";
import { useEffect, useTransition } from "react";

const INSTRUCTION_LINES = [
  "ИНСТРУКЦИЯ ДЛЯ СУБЪЕКТА (ПРОТОКОЛ №88):",
  "1. Отвечайте без промедления. Задержка свыше 10 секунд расценивается как умственное вмешательство.",
  "2. Не пытайтесь анализировать изображение. Ваша первая реакция — всегда верная.",
  "3. Если в процессе тестирования вы услышите посторонний шум в комнате — не оборачивайтесь.",
];

function Cursor() {
  return (
    <span
      className="ml-0.5 inline-block h-[1em] w-2 translate-y-[2px] animate-[blink_0.9s_steps(1)_infinite] bg-current align-middle"
      aria-hidden="true"
    />
  );
}

export function InstructionsScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const { playClick, playCarriageReturn } = useTapeAudio();
  const [isPending, startTransition] = useTransition();

  const { typedLines, activeLine, isDone } = useTypewriter(INSTRUCTION_LINES, {
    charDelay: 16,
    lineGap: 280,
    startDelay: 200,
    onChar: playClick,
    onLineComplete: playCarriageReturn, // нужно добавить такой колбэк в useTypewriter
  });

  const handleContinue = () => {
    if (!isDone || isPending) return;
    playClick();
    const query = sessionId ? `?sessionId=${sessionId}` : "";
    startTransition(() => {
      router.push(`/test${query}`);
    });
  };

  useEffect(() => {
    router.prefetch(`/test${sessionId ? `?sessionId=${sessionId}` : ""}`);
  }, [router, sessionId]);

  const [header, ...rules] = typedLines;

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background p-4">
      <div className="w-full max-w-[560px] text-left">
        <div className="mb-5 font-mono text-[13px] uppercase tracking-[2px] text-[var(--red-bright)]">
          {header}
          {activeLine === 0 && !isDone && <Cursor />}
        </div>

        <div className="flex flex-col gap-3">
          {rules.map((line, i) => (
            <p
              key={i}
              className="font-mono text-sm leading-relaxed text-[var(--paper)]"
            >
              {line}
              {activeLine === i + 1 && !isDone && <Cursor />}
            </p>
          ))}
        </div>

        <div
          className={cn(
            "mt-9 flex justify-center opacity-0 transition-opacity duration-500",
            isDone && "opacity-100",
          )}
        >
          <TapeButton
            onClick={handleContinue}
            disabled={!isDone || isPending}
            className="disabled:pointer-events-none disabled:opacity-30"
          >
            {isPending ? "[ ИНИЦИАЛИЗАЦИЯ ПРОТОКОЛА... ]" : "[ Продолжить ]"}
          </TapeButton>
        </div>
      </div>
    </div>
  );
}
