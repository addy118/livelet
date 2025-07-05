"use server";

import Room from "@/data/room";
import { currentUser } from "@/lib/auth";
import { createCollabRoom, updateCollabRoom } from "@/lib/room";
import { toLiveblocksData } from "@/lib/utils";
import { roomSchema, RoomSchema } from "@/schemas";

export const newRoom = async (values: RoomSchema) => {
  const validatedFields = roomSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid Fields" };

  if (!validatedFields.data) {
    return { error: "No data entered." };
  }

  const { name, defaultAccess, groups, users } = validatedFields.data;

  try {
    // form action logic
    const user = await currentUser();
    if (!user || !user.id) return { error: "No user found" };

    // transform data for liveblocks room creation
    const { defaultAccesses, groupsAccesses, usersAccesses } = toLiveblocksData(
      user.id,
      defaultAccess,
      groups,
      users
    );

    // create liveblocks room
    const room = await createCollabRoom(
      defaultAccesses,
      groupsAccesses,
      usersAccesses
    );

    // store room metadata in db
    await Room.upsert(room.id, name, user.id, defaultAccess, groups, users);

    return { success: "New room created successfully" };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in newRoom() at /actions/room.ts: ", error.message);
      return { error: error.message };
    }
    return { error: "Unknown error while submitting room creation form" };
  }
};

export const updateRoom = async (values: RoomSchema) => {
  const validatedFields = roomSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid Fields" };

  if (!validatedFields.data) {
    return { error: "No data entered." };
  }

  const { name, defaultAccess, groups, users } = validatedFields.data;

  try {
    // form action logic
    const user = await currentUser();
    if (!user || !user.id) return { error: "No user found" };

    // transform data for liveblocks room creation
    const { defaultAccesses, groupsAccesses, usersAccesses } = toLiveblocksData(
      user.id,
      defaultAccess,
      groups,
      users
    );

    // create liveblocks room
    const room = await updateCollabRoom(
      defaultAccesses,
      groupsAccesses,
      usersAccesses
    );

    // store room metadata in db
    await Room.upsert(room.id, name, user.id, defaultAccess, groups, users);

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
