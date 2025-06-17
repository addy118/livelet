import { db } from "@/lib/db";

class VerificationToken {
  static getByEmail = async (email: string) => {
    try {
      const verificationToken = await db.verificationToken.findFirst({
        where: { email },
      });

      return verificationToken;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in VerificationToken.getByEmail: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in VerificationToken.getByEmail.");
    }
  };

  static getByToken = async (token: string) => {
    try {
      const verificationToken = await db.verificationToken.findUnique({
        where: { token },
      });

      return verificationToken;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in VerificationToken.getByToken: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in VerificationToken.getByToken.");
    }
  };
}

export default VerificationToken;
