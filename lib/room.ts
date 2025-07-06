"use server";

import { Liveblocks, LiveblocksError, RoomData } from "@liveblocks/node";
import { nanoid } from "nanoid";
import { AccessTuple } from "@/types";
import { currentUser } from "./auth";

const { LIVEBLOCKS_SECRET_KEY } = process.env;
if (!LIVEBLOCKS_SECRET_KEY) console.log("NO SECRET KEY FOUND");

const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY!,
});

export const createCollabRoom = async (
  defaultAccesses: AccessTuple,
  groupsAccesses: Record<string, AccessTuple>,
  usersAccesses: Record<string, AccessTuple>
): Promise<RoomData> => {
  try {
    const user = await currentUser();
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
        `Liveblocks error in creating the room: ${error.status} - ${error.message}`
      );
      switch (error.status) {
        case 403:
          throw new Error("You don't have access to this room");

        default:
          throw new Error(
            "Liveblocks error in creating the room: " + error.message
          );
      }
    } else if (error instanceof Error) {
      console.error("Error in POST /api/room: ", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error in creating the room");
    }
  }
};

export const updateCollabRoom = async (
  roomId: string,
  defaultAccesses: AccessTuple,
  groupsAccesses: Record<string, AccessTuple>,
  usersAccesses: Record<string, AccessTuple>
): Promise<RoomData> => {
  try {
    const user = await currentUser();
    if (!user || !user.id) throw new Error("No user found");

    const room = await liveblocks.updateRoom(roomId, {
      defaultAccesses,
      groupsAccesses,
      usersAccesses,
    });

    return room;
  } catch (error) {
    if (error instanceof LiveblocksError) {
      console.error(
        `Liveblocks error in updating the room: ${error.status} - ${error.message}`
      );
      switch (error.status) {
        case 403:
          throw new Error("You don't have access to this room");

        default:
          throw new Error(
            "Liveblocks error in updating the room: " + error.message
          );
      }
    } else if (error instanceof Error) {
      console.error("Error in POST /api/room: ", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error in updating the room");
    }
  }
};

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

export const getRoomInfo = async (roomId: string): Promise<RoomData> => {
  const room = await liveblocks.getRoom(roomId);
  return room;
};
