import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const updateUser = protectedProcedure
  .input(
    z.object({
      name: z.string().optional(),
      address: z.string().optional(),
      zipCode: z.string().optional(),
      gender: z.string().optional(),
      birthDate: z.date().optional(),
      occupation: z.string().optional(),
      location: z.string().optional(),
      ppicabang: z.string().optional(),
      fieldOfStudy: z.string().optional(),
      expectedGraduation: z.date().optional(),
      studySpecialization: z.string().optional(),
      bundesland: z.string().optional(),
      updatedAt: z.date(),
    }),
  )
  .mutation(
    async ({
      ctx,
      input: {
        name,
        address,
        zipCode,
        gender,
        birthDate,
        occupation,
        location,
        ppicabang,
        fieldOfStudy,
        studySpecialization,
        expectedGraduation,
        bundesland,
        updatedAt,
      },
    }) => {
      const userId = ctx.session.user.id;

      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          address,
          zipCode,
          gender,
          birthDate,
          occupation,
          location,
          ppicabang,
          fieldOfStudy,
          studySpecialization,
          expectedGraduation,
          bundesland,
          updatedAt,
        },
      });
    },
  );
