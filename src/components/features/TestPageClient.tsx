// src/components/test/TestPageClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import type { QuestionWithOptions } from "@/lib/queries";
import { TestFlow } from "./TestFlow";

export function TestPageClient({
  questions,
}: {
  questions: QuestionWithOptions[];
}) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  return <TestFlow questions={questions} sessionId={sessionId} />;
}
