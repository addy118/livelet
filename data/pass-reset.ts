import { db } from "@/lib/db";

class PassResetToken {
  static getByToken = async (token: string) => {
    try {
      const passToken = await db.passResetToken.findUnique({
        where: { token },
      });

      return passToken;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in PassResetToken.getByEmail: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in PassResetToken.getByEmail.");
    }
  };

  static getByEmail = async (email: string) => {
    try {
      const passToken = await db.passResetToken.findFirst({
        where: { email },
      });

      return passToken;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in PassResetToken.getByToken: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in PassResetToken.getByToken.");
    }
  };
}

export default PassResetToken;
