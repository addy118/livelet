import CollabRoom from "@/components/room/collab-room";
import React from "react";
import dbRoom from "@/data/room";
import { currentUser } from "@/lib/auth";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: roomId } = await params;
  console.log(roomId);
  const user = await currentUser();
  if (!user) return <p>User unauthenticated</p>;
  const room = await dbRoom.getByRoomId(roomId);
  if (!room) return <p>No room found</p>;

  return <CollabRoom room={room} user={user} />;
}
