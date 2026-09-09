import { resolveEnding } from "@/lib/ending";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PORT = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id: sessionId } = await params;

  const answers = await prisma.answer.findMany({
    where: { sessionId },
    include: { option: true },
  });

  const totalScore = answers.reduce((sum, a) => sum + a.option.weight, 0);
  const answeredCount = answers.length;
  const timedOutCount = answers.filter((a) => a.timedOut).length;

  const ending = resolveEnding(totalScore, answeredCount, timedOutCount);

  const session = await prisma.session.update({
    where: { id: sessionId },
    data: {
      totalScore,
      timedOutCount,
      ending: ending.key,
      finishedAt: new Date(),
    },
  });

  return NextResponse.json({ session, ending, answeredCount, timedOutCount });
};
