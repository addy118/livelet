"use server";

import { auth } from "@/auth";
import Room from "@/data/room";
import { createCollabRoom } from "@/lib/room";
import { toLiveblocksData } from "@/lib/utils";
import { roomSchema, RoomSchema } from "@/schemas";

export const room = async (values: RoomSchema) => {
  const validatedFields = roomSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid Fields" };

  if (!validatedFields.data) {
    return { error: "No data entered." };
  }

  const { name, defaultAccess, groups, users } = validatedFields.data;

  try {
    // form action logic
    const session = await auth();
    const user = session?.user;
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
    await Room.create(room.id, name, user.id, defaultAccess, groups, users);

    return { success: "Room created successfully" };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in /actions/room.ts: ", error.message);
      return { error: error.message };
    }
    return { error: "Unknown error while submitting form" };
  }
};
