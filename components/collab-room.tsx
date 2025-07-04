import React from "react";
import { Room } from "@/app/Room";
import { CollaborativeEditor } from "@/components/collab-editor";

const CollabRoom = ({ roomId }: { roomId: string } ) => {
  return (
    <main>
      <Room roomId={roomId}>
        <CollaborativeEditor />
      </Room>
    </main>
  );
};

export default CollabRoom;
