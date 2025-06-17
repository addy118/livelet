//liveblocks.io/docs/authentication
import { Liveblocks } from "@liveblocks/node"
import { NextRequest } from "next/server";

const { LIVEBLOCKS_SECRET_KEY } = process.env;
if (!LIVEBLOCKS_SECRET_KEY) console.log("No secret key found.");

const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY!
})

export interface UserInfo {
  name: string;
  color: string;
  picture: string;
}

let userCounter = 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
  // get user id from the database
  const userId = userCounter % USER_INFO.length;
  userCounter++;

  // create a session for the current user
  // this userInfo is made available in Liveblocks presence hooks, eg. useOthers
  const session = liveblocks.prepareSession(`user-${userId}-${Date.now()}`, {
    userInfo: USER_INFO[userId],
  });

  // use a naming pattern to allow access to rooms with a wildcard
  session.allow(`liveblocks:examples:*`, session.FULL_ACCESS);

  // authorize the user and return the result
  const { body, status } = await session.authorize();
  return new Response(body, { status });
}

const USER_INFO = [
  {
    name: "User 1",
    color: "#D583F0",
    picture: "https://liveblocks.io/avatars/avatar-1.png",
  },
  {
    name: "User 2",
    color: "#F08385",
    picture: "https://liveblocks.io/avatars/avatar-2.png",
  },
  {
    name: "User 3",
    color: "#F0D885",
    picture: "https://liveblocks.io/avatars/avatar-3.png",
  },
  {
    name: "User 4",
    color: "#85EED6",
    picture: "https://liveblocks.io/avatars/avatar-4.png",
  },
  {
    name: "User 5",
    color: "#85BBF0",
    picture: "https://liveblocks.io/avatars/avatar-5.png",
  },
  {
    name: "User 6",
    color: "#8594F0",
    picture: "https://liveblocks.io/avatars/avatar-6.png",
  },
  {
    name: "User 7",
    color: "#85DBF0",
    picture: "https://liveblocks.io/avatars/avatar-7.png",
  },
  {
    name: "User 8",
    color: "#87EE85",
    picture: "https://liveblocks.io/avatars/avatar-8.png",
  },
];
