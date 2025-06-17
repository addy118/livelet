"use server";

import User from "@/data/user";
import { sendPassResetEmail } from "@/lib/mail";
import { generatePassResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await User.getByEmail(email);

  if (!existingUser) {
    return { error: "No user found!" };
  }

  // generate token & send email
  const passResetToken = await generatePassResetToken(email);
  await sendPassResetEmail(passResetToken.email, passResetToken.token);

  return { success: "Reset email sent" };
};
