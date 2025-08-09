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
import { useRouter } from "next/navigation";

export default function CollabRoom({
  room,
  user,
  canEdit,
}: {
  room: RoomDB;
  user: ExtendedUser;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      <Room user={user} room={room}>
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
                <Button
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={() => {
                    setIsLoading(true);
                    router.push(`/room/${room.id}/edit`);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  {isLoading ? <p>Editing...</p> : <p>Edit</p>}
                </Button>

                <DeleteRoomButton roomId={room.id} />
              </>
            )}
          </div>
        </Card>
        <CollaborativeEditor canEdit={canEdit} />
      </Room>
    </main>
  );
}
