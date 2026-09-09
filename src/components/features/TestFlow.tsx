// src/components/test/TestFlow.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import type { QuestionWithOptions } from "@/lib/queries";
import { QuestionScreen } from "./QuestionScreen";

interface TestFlowProps {
  questions: QuestionWithOptions[];
  sessionId?: string | null;
}

interface RecordedAnswer {
  questionId: string;
  optionId: string;
  weight: number;
  timedOut: boolean;
}

const ANSWER_DELAY_MS = 550;

export function TestFlow({ questions, sessionId }: TestFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<RecordedAnswer[]>([]);
  const hasFinishedRef = useRef(false);

  const currentQuestion = questions[step];
  const isLast = step === questions.length - 1;

  const persistAnswer = useCallback(
    (questionId: string, optionId: string, timedOut: boolean) => {
      if (!sessionId) return;
      fetch(`/api/sessions/${sessionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, optionId, timedOut }),
      }).catch(() => {});
    },
    [sessionId],
  );

  const finishTest = useCallback(
    async (finalAnswers: RecordedAnswer[]) => {
      const totalScore = finalAnswers.reduce((sum, a) => sum + a.weight, 0);
      const timedOutCount = finalAnswers.filter((a) => a.timedOut).length;

      if (sessionId) {
        try {
          const res = await fetch(`/api/sessions/${sessionId}/finish`, {
            method: "POST",
          });
          if (!res.ok) {
            console.error(
              `Не удалось финализировать сессию: ${res.status} ${res.statusText}`,
            );
          }
        } catch (err) {
          console.error("Сетевая ошибка при финализации сессии:", err);
        }
      }

      const params = new URLSearchParams({
        score: String(totalScore),
        timedOut: String(timedOutCount),
        total: String(questions.length),
      });
      if (sessionId) params.set("sessionId", sessionId);

      router.push(`/result?${params.toString()}`);
    },
    [questions.length, router, sessionId],
  );

  // побочный эффект (навигация) вынесен из апдейтера setAnswers —
  // срабатывает после коммита стейта, когда answers реально изменился
  useEffect(() => {
    if (
      answers.length === questions.length &&
      questions.length > 0 &&
      !hasFinishedRef.current
    ) {
      hasFinishedRef.current = true;
      finishTest(answers);
    }
  }, [answers, questions.length, finishTest]);

  const handleAnswer = useCallback(
    (optionId: string, timedOut: boolean) => {
      const option = currentQuestion.options.find((o) => o.id === optionId);
      if (!option) return;

      persistAnswer(currentQuestion.id, option.id, timedOut);

      setTimeout(() => {
        setAnswers((prev) => [
          ...prev,
          {
            questionId: currentQuestion.id,
            optionId: option.id,
            weight: option.weight,
            timedOut,
          },
        ]);
        if (!isLast) {
          setStep((s) => s + 1);
        }
      }, ANSWER_DELAY_MS);
    },
    [currentQuestion, isLast, persistAnswer],
  );

  if (!currentQuestion) return null;

  return (
    <AnimatePresence mode="wait">
      <QuestionScreen
        key={currentQuestion.id}
        question={currentQuestion}
        index={step}
        total={questions.length}
        onAnswer={handleAnswer}
      />
    </AnimatePresence>
  );
}
