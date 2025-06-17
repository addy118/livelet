import { db } from "@/lib/db";

class Account {
  static getByUserId = async (userId: string) => {
    try {
      const account = await db.account.findFirst({
        where: { userId },
      });

      return account;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in Account.getByUserId: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in Account.getByUserId.");
    }
  };
}

export default Account;
