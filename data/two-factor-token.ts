import { db } from "@/lib/db";

class TwoFactorToken {
  static getByEmail = async (email: string) => {
    try {
      const twoFactorToken = await db.twoFactorToken.findFirst({
        where: { email },
      });

      return twoFactorToken;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in TwoFactorToken.getByEmail: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in TwoFactorToken.getByEmail.");
    }
  };

  static getByToken = async (token: string) => {
    try {
      const twoFactorToken = await db.twoFactorToken.findUnique({
        where: { token },
      });

      return twoFactorToken;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in TwoFactorToken.getByToken: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in TwoFactorToken.getByToken.");
    }
  };
}

export default TwoFactorToken;
