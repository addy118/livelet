"use server";

import Room from "@/data/room";
import { currentUser } from "@/lib/auth";
import { genRoomId } from "@/lib/id";
import { deleteCollabRoom } from "@/lib/room";
import { roomSchema, RoomSchema } from "@/schemas";
// import { RoomAccess } from "@prisma/client";

export const newRoom = async (values: RoomSchema) => {
  const validatedFields = roomSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };
  if (!validatedFields.data) return { error: "No data entered." };
  const { name, defaultAccess, groups, users } = validatedFields.data;

  try {
    // form action logic
    const user = await currentUser();
    if (!user || !user.id) return { error: "No user found" };

    // add current user (owner) to room
    users?.push({ id: user.id, access: "EDIT" });
    await Room.create(genRoomId(), name, user.id, defaultAccess, groups, users);

    return { success: "New room created successfully" };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in newRoom() at /actions/room.ts: ", error.message);
      return { error: error.message };
    }
    return { error: "Unknown error while submitting room creation form" };
  }
};

export const updateRoom = async (values: RoomSchema, roomId: string) => {
  const validatedFields = roomSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };
  if (!validatedFields.data) return { error: "No data entered." };
  const { name, defaultAccess, groups, users } = validatedFields.data;

  try {
    // form action logic
    const user = await currentUser();
    if (!user || !user.id) return { error: "No user found" };
    await Room.update(roomId, name, user.id, defaultAccess, groups, users);

    return { success: "Room modified successfully" };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Error in updateRoom() at /actions/room.ts: ",
        error.message
      );
      return { error: error.message };
    }
    return { error: "Unknown error while submitting room modification form" };
  }
};

export const deleteRoom = async (roomId: string) => {
  try {
    // console.log(`deleting room ${roomId}`);

    // delete liveblocks room
    await deleteCollabRoom(roomId);

    // delete liveblocks room metadata from db
    await Room.delete(roomId);

    return { success: "Room deleted" };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Error in deleteRoom() at /actions/room.ts: ",
        error.message
      );
      return { error: error.message };
    }
    return { error: "Unknown error while deleting room" };
  }
};
