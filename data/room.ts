import { db } from "@/lib/db";
import { RoomAccessType } from "@/types";
import { InviteStatus, RoomAccess, RoomRole } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class Room {
  static getByRoomId = async (roomId: string) => {
    try {
      const room = await db.room.findFirst({
        where: { id: roomId },
        include: {
          users: { select: { userId: true, access: true, role: true } },
          groups: { select: { groupId: true, access: true } },
        },
      });

      return room;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in Room.getByRoomId: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in Room.getByRoomId.");
    }
  };

  static upsert = async (
    id: string,
    name: string,
    ownerId: string,
    defaultAcc: string = "VIEW",
    groupAcc: RoomAccessType[] = [],
    userAcc: RoomAccessType[] = []
  ) => {
    try {
      const room = await db.room.upsert({
        // update existing room
        where: { id },
        update: {
          name,
          owner: { connect: { id: ownerId } },
          default: defaultAcc as RoomAccess,
        },

        // create a new room
        create: {
          id,
          name,
          owner: { connect: { id: ownerId } },
          default: defaultAcc as RoomAccess,
        },
      });

      // upsert user-room entries
      for (const user of userAcc) {
        await db.userRoom.upsert({
          where: {
            userId_roomId: {
              userId: user.id,
              roomId: id,
            },
          },
          update: {
            access: user.access as RoomAccess,
            role: (user.id === ownerId ? "OWNER" : "MEMBER") as RoomRole,
            inviter: { connect: { id: ownerId } },
            status: "ACCEPTED" as InviteStatus,
            joinedAt: new Date(),
          },
          create: {
            user: { connect: { id: user.id } },
            room: { connect: { id } },
            access: user.access as RoomAccess,
            role: (user.id === ownerId ? "OWNER" : "MEMBER") as RoomRole,
            inviter: { connect: { id: ownerId } },
            status: "ACCEPTED" as InviteStatus,
            joinedAt: new Date(),
          },
        });
      }

      // upsert group entries
      for (const group of groupAcc) {
        await db.groupRoom.upsert({
          where: {
            groupId_roomId: {
              groupId: group.id,
              roomId: id,
            },
          },
          update: {
            access: group.access as RoomAccess,
          },
          create: {
            group: { connect: { id: group.id } },
            room: { connect: { id } },
            access: group.access as RoomAccess,
          },
        });
      }

      return room;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("Room already contains one of these users.");
      } else if (error instanceof Error) {
        console.error("Error in Room.upsert: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in Room.upsert.");
    }
  };

  static delete = async (roomId: string): Promise<void> => {
    try {
      await db.room.delete({ where: { id: roomId } });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in Room.delete: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in Room.delete.");
    }
  };

  // static create = async (
  //   id: string,
  //   name: string,
  //   ownerId: string,
  //   defaultAcc: string = "VIEW",
  //   groupAcc: RoomAccessType[] = [],
  //   userAcc: RoomAccessType[] = []
  // ) => {
  //   try {
  //     const room = await db.room.create({
  //       data: {
  //         id,
  //         name,
  //         owner: { connect: { id: ownerId } },
  //         default: defaultAcc as RoomAccess,
  //         users: {
  //           create: userAcc.map((user) => ({
  //             user: { connect: { id: user.id } },
  //             access: user.access as RoomAccess,
  //             role:
  //               user.id == ownerId
  //                 ? ("OWNER" as RoomRole)
  //                 : ("MEMBER" as RoomRole),
  //             inviter: { connect: { id: ownerId } },
  //             status: "ACCEPTED" as InviteStatus,
  //             joinedAt: new Date(),
  //           })),
  //         },
  //         groups: {
  //           create: groupAcc.map((group) => ({
  //             group: { connect: { id: group.id } },
  //             access: group.access as RoomAccess,
  //           })),
  //         },
  //       },
  //     });

  //     return room;
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error("Error in Room.create: ", error.stack);
  //       throw new Error(error.message);
  //     } else throw new Error("Error in Room.create.");
  //   }
  // };
}

export default Room;
