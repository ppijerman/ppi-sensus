import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { sendMail, EmailTemplate } from "@/utils/email/index";

const saltRounds = 10; // salt rounds for bcrypt

export const generateAndSendVerificationToken = protectedProcedure
  .input(
    z.object({
      id: z.string(), // User ID
      email: z.string().email(), // User Email
    }),
  )
  .mutation(async ({ ctx, input: { id, email } }) => {
    const now = new Date();

    // Check if a token already exists for the given email or user ID
    const existingToken =
      await ctx.prisma.universityEmailVerificationToken.findFirst({
        where: { OR: [{ email: email }, { userId: id }] },
      });

    if (existingToken) {
      if (existingToken.userId !== id) {
        return {
          success: false,
          message:
            "This email is already used for verification by another account. Please use a different email.",
        };
      }

      const lastSentAt = new Date(existingToken.lastSentAt);
      const timeSinceLastSent = (now.getTime() - lastSentAt.getTime()) / 1000; // seconds

      if (timeSinceLastSent < 60) {
        return {
          success: false,
          message: `Please wait ${Math.ceil(60 - timeSinceLastSent)} seconds before requesting new verification email.`,
          lastSentAt: existingToken.lastSentAt,
        };
      }
    }

    // Generate a new token and its hashed version
    const token = uuidv4();
    const hashedToken = await bcrypt.hash(token, saltRounds);
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000); // Expiry date for the token

    try {
      if (
        ctx.session &&
        ctx.session.user &&
        ctx.session.user.verification === "VERIFIED"
      ) {
        return { success: false, message: "User is already verified." };
      }

      if (existingToken) {
        // If an existing token is found, update it with the new hashed token and expiry
        await ctx.prisma.universityEmailVerificationToken.update({
          where: { id: existingToken.id },
          data: { token: hashedToken, expires: expires, lastSentAt: now },
        });
      } else {
        // If no existing token is found, create a new record with the hashed token and expiry
        await ctx.prisma.universityEmailVerificationToken.create({
          data: {
            userId: id,
            email: email,
            token: hashedToken,
            expires: expires,
            lastSentAt: now,
          },
        });
      }

      // Construct
      const verificationUrl = `https://sensus.ppijerman.org/auth/verify-token?token=${token}`;

      // Send
      await sendMail(email, EmailTemplate.EmailVerification, {
        verificationUrl: verificationUrl,
      });

      // Return success response after sending the email
      return {
        success: true,
        message: "Verification token generated and email sent successfully.",
        lastSentAt: now,
      };
    } catch {
      return {
        success: false,
        message: "Failed to generate and send verification token.",
      };
    }
  });
