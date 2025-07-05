//liveblocks.io/docs/authentication
import User from "@/data/user";
import { currentUser } from "@/lib/auth";
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

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
  // get user id from the database
  const user = await currentUser();
  if (!user || !user.id) return new Response("Unauthorized", { status: 401 });
  
  // get all the groups of the user
  const dbGroups = await User.getGroups(user.id);
  const groups: string[] = [];
  dbGroups.forEach((obj) => groups.push(obj.groupId));
  // console.log("User groups: ", groups);

  // set a color for user
  const color = LIVEBLOCKS_COLORS[Math.floor(Math.random() * 8)];

  const { status, body } = await liveblocks.identifyUser({
    userId: user.id,
    groupIds: groups
  }, 
  {
    // user meta-data
    userInfo: {
      name: user.name ?? "Guest",
      avatar: user.image ?? `https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 8) + 1}.png`,
      colors: [color, color, color]
    }
  })

  return new Response(body, { status });
}

const LIVEBLOCKS_COLORS = [
  "#D583F0", 
  "#F08385", 
  "#F0D885", 
  "#85EED6", 
  "#85BBF0", 
  "#8594F0", 
  "#85DBF0", 
  "#87EE85", 
];
