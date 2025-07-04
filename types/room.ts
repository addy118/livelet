import { string } from "zod";

export interface RoomAccessType {
  id: string;
  access: string;
}

export type AccessTuple = ["room:read", "room:presence:write"] | ["room:write"];

export interface BaseRoom {
  id: string;
  name: string;
  createdAt: Date;
}
