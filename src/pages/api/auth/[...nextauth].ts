import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import bcrypt from "bcrypt";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.status = user.status;
        session.user.verification = user.verification;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 10000,
      },
    }),
    CredentialsProvider({
      name: "E-mail Registration",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Insert your email",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials?: Credentials) => {
        if (!credentials) throw new Error("Credentials not found");
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("No user found with the email");
        }

        const isValid = await bcrypt.compare(password, user.password || "");
        if (!isValid) {
          throw new Error("Password is incorrect");
        }

        const verification =
          user.verification === "REJECTED" ? "UNVERIFIED" : user.verification;
        // Return user object if valid, which sets the user session
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          verification,
        };
      },
    }),

    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
