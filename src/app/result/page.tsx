// src/app/result/page.tsx
import { prisma } from "@/lib/prisma";
import { ResultScreen } from "@/components/screens/ResultScreen";
import { endings, resolveEnding, timeoutEnding } from "@/lib/ending";

interface ResultPageProps {
  searchParams: Promise<{
    score?: string;
    timedOut?: string;
    total?: string;
    sessionId?: string;
  }>;
}

const allEndings = [...endings, timeoutEnding];

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const sessionId = params.sessionId ?? null;

  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { answers: true },
    });

    if (session?.finishedAt) {
      const total = session.answers.length;
      const timedOutCount =
        session.timedOutCount ??
        session.answers.filter((a) => a.timedOut).length;
      const ending =
        allEndings.find((e) => e.key === session.ending) ??
        resolveEnding(session.totalScore ?? 0, total, timedOutCount);

      return (
        <ResultScreen
          ending={ending}
          score={session.totalScore ?? 0}
          total={total}
          timedOutCount={timedOutCount}
          sessionId={session.id}
        />
      );
    }
  }

  // фолбэк — сессии в БД нет (например, /finish не успел отработать
  // или sessionId вообще не создавался) — доверяем тому, что пришло в URL
  const score = Number(params.score ?? 0);
  const total = Number(params.total ?? 0);
  const timedOutCount = Number(params.timedOut ?? 0);
  const ending = resolveEnding(score, total, timedOutCount);

  return (
    <ResultScreen
      ending={ending}
      score={score}
      total={total}
      timedOutCount={timedOutCount}
      sessionId={sessionId}
    />
  );
}
