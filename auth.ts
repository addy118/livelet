import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import User from "./data/user";
import TwoFactorConfirm from "./data/two-factor-conf";
import Account from "./data/account";

export const {
  // nested destructuring
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },

  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    // don't allow unverified email users to login
    async signIn({ user, account }) {
      // only allow oauth without email verification
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;

      // prevent sign in w/o email verification
      const existingUser = await User.getById(user.id);
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }

      // add 2fa check
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await TwoFactorConfirm.getByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        // delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      // allow signIn
      return true;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await User.getById(token.sub);
      // console.log("User from JWT callback: ", existingUser);
      if (!existingUser) return token;

      const existingAcc = await Account.getByUserId(existingUser.id);
      // if (!existingAcc) return token;

      // editable fields to be set manually
      token.name = existingUser.name;
      token.email = existingUser.email;

      // token custom fields
      token.isOAuth = !!existingAcc;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      // console.log("JWT: ", token);
      return token;
    },

    async session({ token, session }) {
      // console.log({
      //   sessionToken: token,
      //   session,
      // });

      // session custom fields
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.role) {
          session.user.role = token.role;
        }

        if (token.isTwoFactorEnabled) {
          session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        }

        if (token.name) {
          session.user.name = token.name;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        if (token.isOAuth) {
          session.user.isOAuth = token.isOAuth;
        }
      }

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
