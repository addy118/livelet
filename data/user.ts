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

  static getGroups = async (userId: string) => {
    try {
      const groups = await db.userGroup.findMany({
        where: { userId },
        select: { groupId: true },
      });

      return groups;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in User.getGroups: ", error.stack);
        throw new Error(error.message);
      } else {
        throw new Error("Couldn't find groups by user ID.");
      }
    }
  };

  static getRooms = async (userId: string) => {
    try {
      const rooms: { id: string; name: string; createdAt: Date }[] = [];
      const roomsArr = await db.userRoom.findMany({
        where: { userId },
        select: { room: { select: { id: true, name: true, createdAt: true } } },
      });

      roomsArr.forEach((elem) => {
        rooms.push(elem.room);
      });

      return rooms;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in User.getRooms: ", error.stack);
        throw new Error(error.message);
      } else {
        throw new Error("Couldn't find rooms by user ID.");
      }
    }
  };

  static getAccess = async (
    userId: string,
    roomId: string
  ): Promise<string> => {
    try {
      const userRoom = await db.userRoom.findUnique({
        where: {
          userId_roomId: {
            userId,
            roomId,
          },
        },
      });

      return userRoom?.access || "VIEW";
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in User.getRooms: ", error.stack);
        throw new Error(error.message);
      } else {
        throw new Error("Couldn't find rooms by user ID.");
      }
    }
  };
}

export default User;
