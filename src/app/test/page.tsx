import { Suspense } from "react";
import { getQuestions } from "@/lib/queries";
import { TestPageClient } from "@/components/features/TestPageClient";

export const revalidate = 60;

export default async function TestPage() {
  const questions = await getQuestions();

  if (questions.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-4 text-center">
        <p className="font-mono text-sm text-[var(--paper-dim)]">
          Банк вопросов пуст. Запустите{" "}
          <code className="text-[var(--paper)]">npx prisma db seed</code>.
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={null}>
      <TestPageClient questions={questions} />
    </Suspense>
  );
}
