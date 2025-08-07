"use client";

import { Loading } from "@/components/liveblocks-loading";
import { useCurrentUser } from "@/hooks/use-current-user";
import { RoomDB } from "@/types";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";

export function Room({
  children,
  room,
}: {
  children: ReactNode;
  room: RoomDB;
}) {
  const user = useCurrentUser();
  if (!user || !user?.id) return <p>No user retrieved</p>;
  const hasAccess = room.users.find((member) => member.userId === user.id);
  if (!hasAccess) return <p>User unauthenticated</p>;

  return (
    <RoomProvider id={room.id} initialPresence={{ cursor: null }}>
      <ClientSideSuspense fallback={<Loading />}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
}
