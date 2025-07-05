import CollabRoom from "@/components/collab-room";
import React from "react";

const RoomPage = async ({ params }: { params: { roomId: string } }) => {
  const { roomId } = await params;

  return <CollabRoom roomId={roomId as string} />;
};

export default RoomPage;
