import { RoomEditForm } from "@/components/room/room-edit-form";
import Room from "@/data/room";
import React from "react";

const RoomEdit = async ({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) => {
  const { roomId } = await params;
  const room = await Room.getByRoomId(roomId);
  if (!room) return <p>No room found</p>;

  return <RoomEditForm roomData={room} />;
};

export default RoomEdit;
