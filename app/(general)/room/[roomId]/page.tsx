"use client";

import CollabRoom from "@/components/collab-room";
import { useParams } from "next/navigation";
import React from "react";

const RoomPage = () => {
  const { roomId } = useParams();
  console.log(typeof roomId);
  if (!roomId) return <h1>No valid room ID was provided</h1>;

  return <CollabRoom roomId={roomId as string} />;
};

export default RoomPage;
