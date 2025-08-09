"use client";

import { Loading } from "@/components/liveblocks-loading";
import { ExtendedUser } from "@/next-auth";
import { RoomDB } from "@/types";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";

export function Room({
  children,
  user,
  room,
}: {
  children: ReactNode;
  user: ExtendedUser;
  room: RoomDB;
}) {
  if (!user || !user?.id) return <p>No user retrieved</p>;

  const hasAccess = room.users.find((member) => member.userId === user.id);
  if (!hasAccess) return <p>User not allowed</p>;

  return (
    <RoomProvider id={room.id} initialPresence={{ cursor: null }}>
      <ClientSideSuspense fallback={<Loading />}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
}
