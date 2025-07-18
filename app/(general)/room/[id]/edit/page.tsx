import { RoomEditForm } from "@/components/room/room-edit-form";
import Room from "@/data/room";
import React from "react";

const RoomEdit = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: roomId } = await params;
  console.log(roomId);
  const room = await Room.getByRoomId(roomId);
  if (!room) return <p>No room found</p>;
  console.log("Room from rsc: ", room);

  return <RoomEditForm roomData={room} />;
};

export default RoomEdit;
