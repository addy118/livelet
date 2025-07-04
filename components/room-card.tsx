"use client";

import React from "react";
import { Card, CardFooter, CardHeader } from "./ui/card";
import { BaseRoom } from "@/types";
import { useRouter } from "next/navigation";

export const RoomCard = ({ room }: { room: BaseRoom }) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/room/${room.id}`)}
      className="cursor-pointer p-2"
    >
      <CardHeader className="font-bold text-lg">{room.name}</CardHeader>
      <CardFooter className="text-gray-400 text-center">
        Created at {room.createdAt.toLocaleDateString()}
      </CardFooter>
    </Card>
  );
};
