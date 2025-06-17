import VerificationToken from "@/data/verification-token";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import PassResetToken from "@/data/pass-reset";
import TwoFactorToken from "@/data/two-factor-token";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000);

  const existingToken = await VerificationToken.getByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const generatePassResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000);

  const existingToken = await PassResetToken.getByEmail(email);

  if (existingToken) {
    await db.passResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passResetToken = await db.passResetToken.create({
    data: { email, token, expires },
  });

  return passResetToken;
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(1_00_000, 10_00_000).toString();

  // expires in 5 minutes
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await TwoFactorToken.getByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};
