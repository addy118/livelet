//liveblocks.io/docs/authentication
import User from "@/data/user";
import { currentUser } from "@/lib/auth";
import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";

const { LIVEBLOCKS_SECRET_KEY } = process.env;
if (!LIVEBLOCKS_SECRET_KEY) console.log("No secret key found.");

const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY!,
});

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: NextRequest) {
  // get user id from the database
  const user = await currentUser();
  if (!user || !user.id) return new Response("Unauthorized", { status: 401 });

  // set a color for user
  const color = LIVEBLOCKS_COLORS[Math.floor(Math.random() * 8)];
  const userMetaData = {
    name: user.name ?? "Guest",
    avatar:
      user.image ??
      `https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 8) + 1}.png`,
    colors: [color, color, color],
  };

  const session = liveblocks.prepareSession(user.id, {
    userInfo: userMetaData,
  });

  const rooms = await User.getRooms(user.id);
  rooms.forEach((room) => {
    session.allow(
      `${room.id}`,
      room.access === "EDIT" ? session.FULL_ACCESS : session.READ_ACCESS
    );
    // TODO: Group Logic
  });

  const { status, body } = await session.authorize();
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
