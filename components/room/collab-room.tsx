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

export default function CollabRoom({
  room,
  user,
}: {
  room: RoomDB;
  user: ExtendedUser;
}) {
  const isOwner = room.ownerId === user.id;

  return (
    <main>
      <Room room={room}>
        <Card className="p-4 font-semibold text-xl flex-row flex items-center justify-between mb-4">
          <p>{room.name}</p>

          {isOwner && (
            <div className="flex gap-2">
              <Link href={`/room/${room.id}/edit`}>
                <Button variant="outline">
                  <Pencil className="h-4 w-4" />
                  <p>Edit</p>
                </Button>
              </Link>

              <DeleteRoomButton roomId={room.id} />
            </div>
          )}
        </Card>
        <CollaborativeEditor />
      </Room>
    </main>
  );
}
