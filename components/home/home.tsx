"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ExtendedUser } from "@/next-auth";
import { BaseRoom } from "@/types";
import { RoomCard } from "../room-card";

export const HomePage = ({
  user,
  rooms,
}: {
  user: ExtendedUser;
  rooms: BaseRoom[];
}) => {
  const router = useRouter();
  console.log(user.id);
  console.log(rooms);

  return (
    <>
      <h1 className="text-xl font-bold pb-6">My Rooms</h1>
      {rooms.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">You don't have any rooms</p>
      )}
    </>
  );
};
