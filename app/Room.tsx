"use client";

import { Loading } from "@/components/liveblocks-loading";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";

export function Room({ children, roomId }: { children: ReactNode, roomId: string }) {
  const user = useCurrentUser();
  if (!user || !user.id) return <p>No user retrieved</p>;

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ cursor: null }}
    >
      <ClientSideSuspense fallback={<Loading />}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
}
