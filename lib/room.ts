"use server";

import { Liveblocks, LiveblocksError, RoomData } from "@liveblocks/node";

const { LIVEBLOCKS_SECRET_KEY } = process.env;
if (!LIVEBLOCKS_SECRET_KEY) console.log("NO SECRET KEY FOUND");

const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY!,
});

export const deleteCollabRoom = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);
  } catch (error) {
    if (error instanceof LiveblocksError) {
      console.error(
        `Liveblocks error in deleting the room: ${error.status} - ${error.message}`
      );
      switch (error.status) {
        case 403:
          throw new Error("You don't have access to this room");

        default:
          throw new Error(
            "Liveblocks error in deleting the room: " + error.message
          );
      }
    } else if (error instanceof Error) {
      console.error(
        "Error in deleting the room at /lib/room.ts: ",
        error.message
      );
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error in deleting the room");
    }
  }
};
