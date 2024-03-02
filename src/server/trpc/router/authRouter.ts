// src/server/routers/authRouter.ts
import { t } from "../trpc";
import { z } from "zod";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { prisma } from "../../db/client";

export const authRouter = t.router({
  register: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8), // Ensure strong passwords
        occupation: z.string().optional(),
        location: z.string().optional(),
        affiliation: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, password, occupation, location, affiliation } = input;
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already in use",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          birthDate: new Date(), // Set any other initial fields as necessary
          occupation,
          location,
          affiliation,

          // Set any other initial fields as necessary
        },
      });

      return { id: user.id, email: user.email };
    }),
  // Add other authentication procedures (e.g., login, logout) here
});
