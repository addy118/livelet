import React from "react";
// import { Liveblocks } from "@liveblocks/node";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const { LIVEBLOCKS_SECRET_KEY } = process.env;
if (!LIVEBLOCKS_SECRET_KEY) console.log("No secret key found.");

// const liveblocks = new Liveblocks({
//   secret: LIVEBLOCKS_SECRET_KEY!,
// });

const Test = async () => {
  const session = await auth();
  console.log("test success!");
  const user = session?.user;
  if (!user) return;
  console.log(user.id);
  if (!user.id) return;

  // const roomId = "room-cmbxww91t0002e60us1pqjy52-Daru5ztmYm";

  const dbUser = await db.user.findFirst({
    where: { id: user.id },
  });

  console.log(dbUser);

  // const view = ["room:read", "room:presence:write"];
  // const edit = ["room:write"];

  // console.log(isEqual(view, ["room:read", "room:presence:write"]));
  // console.log(isEqual(edit, ["room:write"]));

  // let room = await liveblocks.createRoom(
  //   "room-cmbxww91t0002e60us1pqjy52-Daru5ztmYm",
  //   {
  //     defaultAccesses: ["room:read", "room:presence:write"],
  //     groupsAccesses: {},
  //     usersAccesses: {
  //       [user.id]: ["room:write"],
  //     },
  //   }
  // );

  // let room = await liveblocks.updateRoom(roomId, {
  //   usersAccesses: {
  //     [user.id]: ["room:read", "room:presence:write"],
  //   },
  // });
  // console.log(room)

  // const rooms = await liveblocks.getRooms();
  // console.log(rooms);

  // let room = await liveblocks.getRoom("room-cmbxww91t0002e60us1pqjy52-");

  // room = await liveblocks.updateRoomId({
  //   roomId: "room-cmbxww91t0002e60us1pqjy52-",
  //   newRoomId: "room-cmbxww91t0002e60us1pqjy52-",
  // });

  // console.log(room);
  // await liveblocks.deleteRoom("new-room-id");

  // const { data: rooms } = await liveblocks.getRooms();
  // console.log(rooms);

  // const yjsDoc = await liveblocks.getYjsDocument("room-cmbxww91t0002e60us1pqjy52-Daru5ztmYm");
  // console.log(yjsDoc.codemirror);

  return <div>Test Page</div>;
};

export default Test;
