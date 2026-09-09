// src/components/test/BootScreen.tsx
"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useTypewriter } from "@/hooks/useTypeWritter";
import { useTapeAudio } from "@/hooks/useTapeAudio";

interface BootScreenProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  "TALAS-4 BIOS v2.04 (C) 1988 TALAS SECTOR DEPT.",
  "ПРОВЕРКА ОЗУ... 640 КБ ОК",
  "ПРОВЕРКА КОНТРОЛЛЕРА ЛЕНТОПРОТЯЖНОГО МЕХАНИЗМА... ОК",
  "ПОДКЛЮЧЕНИЕ К АУДИОВИЗУАЛЬНОЙ ЛЕНТЕ... ОК",
  "ЧТЕНИЕ СЕКТОРА 0x00F1... ЗАВЕРШЕНО",
  "ЧТЕНИЕ СЕКТОРА 0x00F2... ЗАВЕРШЕНО",
  "ЧТЕНИЕ СЕКТОРА 0x00F3... ОШИБКА ЧТЕНИЯ, ПОВТОР...",
  "ЧТЕНИЕ СЕКТОРА 0x00F3... ЗАВЕРШЕНО",
  "ЗАГРУЗКА ПРОТОКОЛА_88.SYS... ЗАВЕРШЕНО",
  "ПРОВЕРКА ЦЕЛОСТНОСТИ ПРОТОКОЛА... 128/128 БЛОКОВ ОК",
  "ИНИЦИАЛИЗАЦИЯ МОДУЛЯ ОБНАРУЖЕНИЯ АНОМАЛИЙ...",
  "СИНХРОНИЗАЦИЯ С АРХИВОМ ОТДЕЛА ОЦЕНКИ УГРОЗ... ОК",
  "ЗАГРУЖЕНО СУБЪЕКТОВ В БАЗЕ: 4 391",
  "ПОСЛЕДНЯЯ ОТМЕТКА АКТИВНОСТИ: НЕИЗВЕСТНО",
  "[!] ВНИМАНИЕ: ОБНАРУЖЕНО ИСКАЖЕНИЕ СИГНАЛА [!]",
  "[!] УРОВЕНЬ ИСКАЖЕНИЯ: 12.4% — В ПРЕДЕЛАХ НОРМЫ [!]",
  "ТРЕБУЕТСЯ АВТОРИЗАЦИЯ",
];

const WARNING_LINE_START = 14;

export function BootScreen({ onComplete }: BootScreenProps) {
  const { playClick, playVhsPowerOn } = useTapeAudio();
  const burstPlayedRef = useRef(false);

  const { typedLines, isDone } = useTypewriter(BOOT_LINES, {
    charDelay: 14,
    lineGap: 180,
    onChar: playClick,
  });

  useEffect(() => {
    if (isDone && !burstPlayedRef.current) {
      burstPlayedRef.current = true;
      playVhsPowerOn();
    }
  }, [isDone, playVhsPowerOn]);

  useEffect(() => {
    if (!isDone) return;

    function advance() {
      playClick();
      onComplete();
    }

    document.addEventListener("keydown", advance, { once: true });
    return () => document.removeEventListener("keydown", advance);
  }, [isDone, onComplete, playClick]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-screen w-full items-center justify-center overflow-hidden bg-background p-4"
    >
      <div className="w-full max-w-[640px] text-left font-mono text-sm leading-[1.7]">
        {typedLines.map((line, i) => (
          <div
            key={i}
            className={
              i >= WARNING_LINE_START
                ? "text-[var(--red-bright)] [text-shadow:0_0_6px_rgba(184,30,30,0.5)]"
                : "text-paper [text-shadow:0_0_4px_rgba(127,232,154,0.35)]"
            }
          >
            {line}
          </div>
        ))}

        {isDone && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              playClick();
              onComplete();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                playClick();
                onComplete();
              }
            }}
            className="mt-6 cursor-pointer tracking-wide text-[var(--paper)]"
          >
            НАЖМИТЕ ЛЮБУЮ КЛАВИШУ ИЛИ НАЖМИТЕ ДЛЯ ЗАГРУЗКИ СИСТЕМЫ...
          </div>
        )}
      </div>
    </motion.div>
  );
}
