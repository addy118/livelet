"use server";

import VerificationToken from "@/data/verification-token";
import { db } from "@/lib/db";
import { ExtendedUser } from "@/next-auth";

export const emailChange = async (token: string, user: ExtendedUser) => {
  const existingToken = await VerificationToken.getByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist." };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired." };
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified" };
};