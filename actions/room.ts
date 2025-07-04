"use server";

import { auth } from "@/auth";
import Room from "@/data/room";
import { createCollabRoom } from "@/lib/room";
import { roomSchema, RoomSchema } from "@/schemas";
import { AccessTuple } from "@/types";
import { Prisma } from "@prisma/client";

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
    const accessMap: Record<"VIEW" | "EDIT", AccessTuple> = {
      VIEW: ["room:read", "room:presence:write"],
      EDIT: ["room:write"],
    } as const;

    const defaultAccesses = accessMap[defaultAccess];

    const groupsAccesses: Record<string, AccessTuple> = {};
    groups?.forEach((group) => {
      groupsAccesses[group.id] = [...accessMap[group.access]];
    });

    const usersAccesses: Record<string, AccessTuple> = {};
    // add the owner itself
    usersAccesses[user.id] = ["room:write"];
    // add form body users
    users?.forEach((formUser) => {
      usersAccesses[formUser.id] = [...accessMap[formUser.access]];
    });

    // create liveblocks room
    const room = await createCollabRoom(
      defaultAccesses,
      groupsAccesses,
      usersAccesses
    );

    // store room metadata in db
    const dbRoom = await Room.create(
      room.id,
      name,
      user.id,
      defaultAccess,
      groups,
      users
    );

    return { success: "Room created successfully" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Unknown error while submitting form" };
  }
};
