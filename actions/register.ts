"use server";

import bcrypt from "bcryptjs";
import { RegiSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/lib/db";
import User from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegiSchema>) => {
  console.log(values);
  const validatedFields = RegiSchema.safeParse(values);

  if (!validatedFields) return { error: "Invalid Fields" };

  const { name, email, password } = validatedFields.data!;
  const hashedPass = await bcrypt.hash(password, 10);

  const existingUser = await User.getByEmail(email);
  if (existingUser) return { error: "Email already in use!" };

  // console.log(name, email, hashedPass);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPass,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  console.log(verificationToken);

  // send verification email
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: `Confirmation email sent to ${verificationToken.email}` };
};
