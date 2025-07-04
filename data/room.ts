import { db } from "@/lib/db";
import { RoomAccessType } from "@/types";
import { InviteStatus, RoomAccess, RoomRole } from "@prisma/client";

class Room {
  static getByRoomId = async (roomId: string) => {
    try {
      const room = await db.room.findFirst({
        where: { id: roomId },
      });

      return room;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in Room.getByRoomId: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in Room.getByRoomId.");
    }
  };

  static create = async (
    id: string,
    name: string,
    ownerId: string,
    defaultAcc: string = "VIEW",
    groupAcc: RoomAccessType[] = [],
    userAcc: RoomAccessType[] = []
  ) => {
    try {
      const room = await db.room.create({
        data: {
          id,
          name,
          owner: { connect: { id: ownerId } },
          default: defaultAcc as RoomAccess,
          users: {
            create: userAcc.map((user) => ({
              user: { connect: { id: user.id } },
              access: user.access as RoomAccess,
              role:
                user.id == ownerId
                  ? ("OWNER" as RoomRole)
                  : ("MEMBER" as RoomRole),
              inviter: { connect: { id: ownerId } },
              status: "ACCEPTED" as InviteStatus,
              joinedAt: new Date(),
            })),
          },
          groups: {
            create: groupAcc.map((group) => ({
              group: { connect: { id: group.id } },
              access: group.access as RoomAccess,
            })),
          },
        },
      });

      return room;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in Room.create: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in Room.create.");
    }
  };
}

export default Room;
