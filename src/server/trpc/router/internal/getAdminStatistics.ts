import { z } from "zod";
import { adminProcedure } from "../../trpc";

export const getAdminStatistics = adminProcedure
  .input(z.object({ bundesland: z.string().optional() }))
  .query(async ({ ctx: { prisma }, input: { bundesland } }) => {
    const users = await prisma.user.count({
      where: { bundesland },
    });
    const verified = await prisma.user.count({
      where: { verification: "VERIFIED", bundesland },
    });
    const unverified = await prisma.user.count({
      where: { verification: "UNVERIFIED", bundesland },
    });
    const rejected = await prisma.user.count({
      where: { verification: "REJECTED", bundesland },
    });
    const active = await prisma.user.count({
      where: { status: "ACTIVE", bundesland },
    });
    const inactive = await prisma.user.count({
      where: { status: "INACTIVE", bundesland },
    });
    const updated = await prisma.user.count({
      where: { updated: false, bundesland },
    });
    const admins = await prisma.user.count({
      where: { role: "ADMIN", bundesland },
    });

    const dates = await prisma.user.findMany({
      select: {
        birthDate: true,
        updatedAt: true,
        createdAt: true,
        expectedGraduation: true,
      },
      where: {
        bundesland,
      },
    });
    const subscribed = await prisma.user.count({
      where: { subscribeNewsletterEmail: true, bundesland },
    });
    const unsubscribed = await prisma.user.count({
      where: { subscribeNewsletterEmail: false, bundesland },
    });
    const thirdPartyConsent = await prisma.user.count({
      where: { forwardDataThirdParty: true, bundesland },
    });
    const noThirdPartyConsent = await prisma.user.count({
      where: { forwardDataThirdParty: false, bundesland },
    });

    return {
      users,
      verified,
      unverified,
      rejected,
      active,
      inactive,
      updated,
      admins,
      dates,
      subscribed,
      unsubscribed,
      thirdPartyConsent,
      noThirdPartyConsent,
    };
  });
