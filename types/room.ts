export interface RoomAccessType {
  id: string;
  access: string;
}

export type AccessTuple = ["room:read", "room:presence:write"] | ["room:write"];
