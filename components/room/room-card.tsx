"use client";

import React, { useState } from "react";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { BaseRoom } from "@/types";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

export const RoomCard = ({ room }: { room: BaseRoom }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>();

  const handleClick = () => {
    setIsLoading(true);
    router.push(`/room/${room.id}`);
  };

  return (
    <Card className="text-left">
      <CardHeader className="font-bold text-lg">{room.name}</CardHeader>
      <CardFooter className="text-gray-400 text-center">
        <div
          onClick={handleClick}
          className="flex items-center justify-center gap-2 rounded-4xl px-4 py-1 border-1 border-gray-400 cursor-pointer"
        >
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p className="text-md">Enter</p>
              <ArrowRightIcon size={16} />
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
