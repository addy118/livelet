import CollabRoom from "@/components/room/collab-room";
import React from "react";
import dbRoom from "@/data/room";
import { currentUser } from "@/lib/auth";
import User from "@/data/user";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: roomId } = await params;
  console.log(roomId);
  const user = await currentUser();
  if (!user || !user?.id) return <p>User unauthenticated</p>;
  const room = await dbRoom.getByRoomId(roomId);
  if (!room) return <p>No room found</p>;

  const userAccess = await User.getAccess(user.id, room.id);
  const canEdit = userAccess === "VIEW" ? false : true;

  return <CollabRoom room={room} user={user} canEdit={canEdit} />;
}
