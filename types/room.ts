import { RoomAccess } from "@prisma/client";

export interface RoomAccessType {
  id: string;
  access: RoomAccess;
}

export type AccessTuple = ["room:read", "room:presence:write"] | ["room:write"];

export interface BaseRoom {
  id: string;
  name: string;
  createdAt: Date;
}

export const accessMap: Record<"VIEW" | "EDIT", AccessTuple> = {
  VIEW: ["room:read", "room:presence:write"],
  EDIT: ["room:write"],
} as const;