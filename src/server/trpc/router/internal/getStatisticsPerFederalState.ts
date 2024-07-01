import { protectedProcedure } from "../../trpc";

export const getStatisticsPerFederalState = protectedProcedure.query(
  async ({ ctx: { prisma } }) => {
    const totalStudentsPerState = await prisma.user.groupBy({
      by: ["bundesland"],
      _count: { id: true },
    });
    return { totalStudentsPerState };
  },
);
