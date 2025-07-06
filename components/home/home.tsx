"use client";

import React from "react";
import { BaseRoom } from "@/types";
import { RoomCard } from "../room/room-card";

export const HomePage = ({ rooms }: { rooms: BaseRoom[] }) => {
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
        <p className="text-gray-400">You don&apos;t have any rooms</p>
      )}
    </>
  );
};
