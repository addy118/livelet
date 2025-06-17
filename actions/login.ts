"use server";

import { signIn } from "@/auth";
import TwoFactorConfirm from "@/data/two-factor-conf";
import TwoFactorToken from "@/data/two-factor-token";
import User from "@/data/user";
import { db } from "@/lib/db";
import { sendTwoFactorConf, sendVerificationEmail } from "@/lib/mail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid Fields" };

  if (!validatedFields.data) {
    return { error: "No data entered." };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await User.getByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: `Confirmation email sent to ${verificationToken.email}` };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email)
    if (code) {
      const twoFactorToken = await TwoFactorToken.getByEmail(
        existingUser.email
      );

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid code" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await TwoFactorConfirm.getByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorConf(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
      // redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "Logged in successfully!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    } else if (error instanceof Error) {
      console.error("Error in login.ts: ", error.stack);
      return { error: error.message };
    }
  }
};
