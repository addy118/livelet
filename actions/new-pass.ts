"use server";

import PassResetToken from "@/data/pass-reset";
import User from "@/data/user";
import { db } from "@/lib/db";
import { generatePassResetToken } from "@/lib/tokens";
import { NewPassSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";

export const newPass = async (
  values: z.infer<typeof NewPassSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token" };
  }

  const validatedFields = NewPassSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { password } = validatedFields.data;
  const existingToken = await PassResetToken.getByToken(token);

  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await User.getByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  const hashedPass = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPass },
  });

  await db.passResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated" };
};
