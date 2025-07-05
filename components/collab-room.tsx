import { Room } from "@/app/Room";
import { CollaborativeEditor } from "@/components/collab-editor";
import dbRoom from "@/data/room";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Pencil, Trash } from "lucide-react";
import { currentUser } from "@/lib/auth";
import Link from "next/link";

const CollabRoom = async ({ roomId }: { roomId: string }) => {
  const room = await dbRoom.getByRoomId(roomId);
  if (!room) return <p>No room found</p>;

  const user = await currentUser();
  if (!user) return <p>User unauthenticated</p>;

  const isOwner = room.ownerId === user.id;

  return (
    <main>
      <Room room={room}>
        <Card className="p-4 font-semibold text-xl flex-row flex items-center justify-between mb-4">
          <p>{room.name}</p>

          {isOwner && (
            <div>
              <Link href={`/room/${room.id}/delete`}>
                <Button variant="outline">
                  <Trash />
                  <p>Edit</p>
                </Button>
              </Link>

              <Link href={`/room/${room.id}/edit`}>
                <Button variant="outline">
                  <Pencil />
                  <p>Edit</p>
                </Button>
              </Link>
            </div>
          )}
        </Card>
        <CollaborativeEditor />
      </Room>
    </main>
  );
};

export default CollabRoom;
