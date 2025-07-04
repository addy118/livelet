import { NextRequest } from "next/server";
import { Liveblocks, LiveblocksError } from "@liveblocks/node";
import { nanoid } from "nanoid";
import { auth } from "@/auth";
import Room from "@/data/room";

const { LIVEBLOCKS_SECRET_KEY } = process.env;
if (!LIVEBLOCKS_SECRET_KEY) console.log("No secret key found.");

const liveblocks = new Liveblocks({
  secret: LIVEBLOCKS_SECRET_KEY!,
});

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user || !user.id)
      return new Response("No user found", { status: 401 });

    // create a room w/ different permissions (4001 for no access)
    const roomId = `room-${user.id}-${nanoid(10)}`;
    const room = await liveblocks.createRoom(roomId, {
      defaultAccesses: ["room:read", "room:presence:write"],
      groupsAccesses: {},
      usersAccesses: {
        [user.id]: ["room:write"],
      },
    });
  } catch (error) {
    if (error instanceof LiveblocksError) {
      console.error(
        `Liveblocks error in POST /api/room: ${error.status} - ${error.message}`
      );
      switch (error.status) {
        case 403:
          return new Response("You don't have access to enter this room", {
            status: error.status,
          });

        default:
          return new Response("Liveblocks error in POST /api/room: ", {
            status: error.status,
          });
      }
    } else if (error instanceof Error) {
      console.error("Error in POST /api/room: ", error.message);
      return new Response(error.message, { status: 401 });
    } else {
      return new Response("Unknown error in POST /api/room", { status: 500 });
    }
  }
}
