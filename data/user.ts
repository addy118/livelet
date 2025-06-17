import { db } from "@/lib/db";

class User {
  static getByEmail = async (email: string) => {
    try {
      const user = await db.user.findUnique({ where: { email } });
      return user;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in User.getByEmail: ", error.stack);
        throw new Error(error.message);
      } else {
        throw new Error("Couldn't find user by email.");
      }
    }
  };

  static getById = async (userId: string) => {
    try {
      const user = await db.user.findUnique({ where: { id: userId } });
      return user;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in User.getById: ", error.stack);
        throw new Error(error.message);
      } else {
        throw new Error("Couldn't find user by user ID.");
      }
    }
  };
}

export default User;
