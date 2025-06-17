import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserRole } from "@prisma/client";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

// any custom field types that you want to add on session obj
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

// any custom field types that you want to add on JWT token obj
declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  }
}
