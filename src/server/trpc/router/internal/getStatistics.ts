import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const getStatistics = protectedProcedure
  .input(
    z.object({
      bundesland: z.string().optional(),
    }),
  )
  .query(async ({ ctx: { prisma }, input: { bundesland } }) => {
    const vocation = await prisma.user.count({
      where: { occupation: "ausbildung", bundesland },
    });
    const bachelor = await prisma.user.count({
      where: { occupation: "bachelor", bundesland },
    });
    const master = await prisma.user.count({
      where: { occupation: "master", bundesland },
    });
    const doctorand = await prisma.user.count({
      where: { occupation: "doctor", bundesland }, // i.e. doctorand
    });
    const professor = await prisma.user.count({
      where: { occupation: "professor", bundesland },
    });
    const female = await prisma.user.count({
      where: { gender: "Perempuan", bundesland },
    });
    const male = await prisma.user.count({
      where: { gender: "Laki-Laki", bundesland },
    });

    return {
      vocation,
      bachelor,
      master,
      doctorand,
      professor,
      female,
      male,
    };
  });
