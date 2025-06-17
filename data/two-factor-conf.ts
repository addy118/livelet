import { db } from "@/lib/db";

class TwoFactorConfirm {
  static getByUserId = async (userId: string) => {
    try {
      const twoFactorConf = await db.twoFactorConfirmation.findUnique({
        where: { userId },
      });

      return twoFactorConf;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in TwoFactorConfirm.getByUserId: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in TwoFactorConfirm.getByUserId.");
    }
  };
}

export default TwoFactorConfirm;
