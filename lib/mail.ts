import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://livelet.adityakirti.tech";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${baseUrl}/new-verification?token=${token}`;

  await resend.emails.send({
    from: "no-reply@adityakirti.tech",
    to: email,
    subject: "Confirm your email",
    html: `
    <p>Click <a href="${confirmLink}">here</a> to confirm email.</p>
    `,
  });
};

export const sendEmailChangeEmail = async (email: string, token: string) => {
  const confirmLink = `${baseUrl}/change-email?token=${token}`;

  await resend.emails.send({
    from: "no-reply@adityakirti.tech",
    to: email,
    subject: "Confirm your email",
    html: `
    <p>Click <a href="${confirmLink}">here</a> to confirm email.</p>
    `,
  });
};

export const sendPassResetEmail = async (email: string, token: string) => {
  const resetLink = `${baseUrl}/new-password?token=${token}`;

  await resend.emails.send({
    from: "no-reply@adityakirti.tech",
    to: email,
    subject: "Reset your password",
    html: `
    <p>Click <a href="${resetLink}">here</a> to reset password.</p>
    `,
  });
};

export const sendTwoFactorConf = async (email: string, token: string) => {
  await resend.emails.send({
    from: "no-reply@adityakirti.tech",
    to: email,
    subject: "Two Factor Authentication Code",
    html: `
    <p>Your 2FA Code: ${token}</p>
    `,
  });
};
