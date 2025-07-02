"use client";

import { Loading } from "@/components/liveblocks-loading";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { useSearchParams } from "next/navigation";
import { ReactNode, useMemo } from "react";

export function Room({ children }: { children: ReactNode }) {
  // const roomId = useExampleRoomId("liveblocks:examples:nextjs-yjs-codemirror");
  const user = useCurrentUser();
  if (!user || !user.id) return <p>No user retrieved</p>;
  const roomId = `${user.id}-room-3`;

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<Loading />}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
}
