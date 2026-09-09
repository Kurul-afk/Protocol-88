import { prisma } from "./prisma";

export const getQuestions = async () => {
  return prisma.question.findMany({
    orderBy: { order: "asc" },
    include: {
      options: {
        orderBy: { order: "asc" },
      },
    },
  });
};

export type QuestionWithOptions = Awaited<
  ReturnType<typeof getQuestions>
>[number];
