"use server";

import { Liveblocks, LiveblocksError, RoomData } from "@liveblocks/node";
import { nanoid } from "nanoid";
import { auth } from "@/auth";
import { AccessTuple } from "@/types";

const { LIVEBLOCKS_SECRET_KEY } = process.env;
if (!LIVEBLOCKS_SECRET_KEY) console.log("No secret key found.");
console.log(LIVEBLOCKS_SECRET_KEY);

const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY!,
});

export const createCollabRoom = async (
  defaultAccesses: AccessTuple,
  groupsAccesses: Record<string, AccessTuple>,
  usersAccesses: Record<string, AccessTuple>
): Promise<RoomData> => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user || !user.id) throw new Error("No user found");

    const roomId = nanoid(10);
    const room = await liveblocks.createRoom(roomId, {
      defaultAccesses,
      groupsAccesses,
      usersAccesses,
    });

    return room;
  } catch (error) {
    if (error instanceof LiveblocksError) {
      console.error(
        `Liveblocks error in POST /api/room: ${error.status} - ${error.message}`
      );
      switch (error.status) {
        case 403:
          throw new Error("You don't have access to enter this room");

        default:
          throw new Error(
            "Liveblocks error in POST /api/room: " + error.message
          );
      }
    } else if (error instanceof Error) {
      console.error("Error in POST /api/room: ", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error in POST /api/room");
    }
  }
};
