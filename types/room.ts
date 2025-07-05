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

export interface RoomDB {
  default: RoomAccess;
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  users: {
    userId: string;
    access: string;
    role: string;
  }[];
  groups: {
    groupId: string;
    access: string;
  }[]
}

export const accessMap: Record<"VIEW" | "EDIT", AccessTuple> = {
  VIEW: ["room:read", "room:presence:write"],
  EDIT: ["room:write"],
} as const;
