// src/components/test/QuestionScreen.tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { QuestionWithOptions } from "@/lib/queries";
import { GlitchPhoto } from "../effects/GlitchPhoto";
import { TimeoutWarning } from "../features/TimeoutWarning";
import { useQuestionTimer } from "@/hooks/useQuestionTimer";
import { useTapeAudio } from "@/hooks/useTapeAudio";
import { cn } from "@/lib/utils";

const LETTERS = ["А", "Б", "В", "Г"];

interface QuestionScreenProps {
  question: QuestionWithOptions;
  index: number;
  total: number;
  onAnswer: (optionId: string, timedOut: boolean) => void;
}

export function QuestionScreen({
  question,
  index,
  total,
  onAnswer,
}: QuestionScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const { playClick } = useTapeAudio();

  useQuestionTimer(10000, () => setShowWarning(true), selectedId === null);

  const handleSelect = (optionId: string) => {
    if (selectedId) return;
    setSelectedId(optionId);
    playClick();
    onAnswer(optionId, showWarning);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4"
    >
      <div className="w-full max-w-[560px] text-center">
        <div className="mb-4 font-mono text-xs uppercase tracking-[3px] text-[var(--red-bright)]">
          ОЦЕНКА СУБЪЕКТА — ВОПРОС {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </div>

        <TimeoutWarning visible={showWarning} />

        <GlitchPhoto src={question.image} />

        <p className="mx-auto mb-8 max-w-[520px] font-mono text-[18px] leading-relaxed text-[var(--paper)]">
          {question.text}
        </p>

        <div className="mx-auto flex max-w-[520px] flex-col gap-2.5 text-left">
          {question.options.map((option, i) => {
            const isSelected = selectedId === option.id;
            const isLocked = selectedId !== null;
            return (
              <button
                key={option.id}
                type="button"
                disabled={isLocked}
                onClick={() => handleSelect(option.id)}
                className={cn(
                  "flex items-center gap-3.5 border border-white/[0.08] border-l-[3px] border-l-[var(--grey)]",
                  "bg-white/[0.02] px-4 py-3.5 text-left font-mono text-[14.5px] text-[var(--paper)]",
                  "transition-colors duration-150",
                  !isLocked &&
                    "hover:border-l-[var(--red-bright)] hover:bg-white/[0.05]",
                  isSelected &&
                    "border-l-[var(--red-bright)] bg-[rgba(122,20,20,0.12)]",
                  isLocked && !isSelected && "pointer-events-none opacity-55",
                )}
              >
                <span className="w-[22px] flex-shrink-0 font-bold text-[var(--paper-dim)]">
                  {LETTERS[i]})
                  {isSelected && (
                    <span className="text-[var(--red-bright)]"> ✓</span>
                  )}
                </span>
                <span>{option.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
