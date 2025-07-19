"use client";

import { Room } from "@/app/Room";
import { CollaborativeEditor } from "@/components/collab-editor";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { RoomDB } from "@/types";
import { ExtendedUser } from "@/next-auth";
import { DeleteRoomButton } from "./delete-btn";
import { useState } from "react";

export default function CollabRoom({
  room,
  user,
}: {
  room: RoomDB;
  user: ExtendedUser;
}) {
  const [isCopied, setIsCopied] = useState<boolean>();
  const isOwner = room.ownerId === user.id;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(room.id);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy room ID: ", error);
    }
  };

  return (
    <main>
      <Room room={room}>
        <Card className="py-2 px-6 font-semibold text-md flex-row flex items-center justify-between">
          <p>{room.name}</p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-8 text-xs"
              onClick={() => handleCopy()}
            >
              {isCopied ? "Copied!" : "Copy ID"}
            </Button>

            {isOwner && (
              <>
                <Link href={`/room/${room.id}/edit`}>
                  <Button variant="outline" className="h-8 text-xs">
                    <Pencil className="h-4 w-4" />
                    <p>Edit</p>
                  </Button>
                </Link>

                <DeleteRoomButton roomId={room.id} />
              </>
            )}
          </div>
        </Card>
        <CollaborativeEditor />
      </Room>
    </main>
  );
}
