import { useOthers, useSelf } from "@liveblocks/react/suspense";
// import type { UserInfo } from "@/app/api/liveblocks-auth/route";

export function Avatars() {
  const users = useOthers();
  const currentUser = useSelf();
  // console.log("from avatars()");
  // console.log("others:", users.map(u => u.info));
  // console.log("self:", currentUser?.info);

  return (
    <div className=" flex px-3">
      {users.map(({ connectionId, info }) => {
        const userInfo = info;
        return (
          <Avatar
            key={connectionId}
            picture={userInfo.avatar}
            name={userInfo.name}
          />
        );
      })}

      {currentUser &&
        currentUser.info &&
        currentUser.info.name &&
        currentUser.info.avatar && (
          <div className="relative ml-8 first:ml-0">
            <Avatar
              picture={currentUser.info.avatar}
              name={currentUser.info.name}
            />
          </div>
        )}
    </div>
  );
}

export function Avatar({ picture, name }: { picture: string; name: string }) {
  return (
    <div
      className="flex justify-center items-center relative border-4 border-white rounded-full w-[42px] h-[42px] bg-gray-400 -ml-3 group"
      data-tooltip={name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={picture || "/placeholder.svg"}
        alt="Avatar"
        className="w-full h-full rounded-full"
        data-tooltip={name}
      />
      <div className="absolute top-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out py-1 px-2.5 text-white text-xs rounded-lg mt-2.5 z-10 bg-black whitespace-nowrap pointer-events-none">
        {name}
      </div>
    </div>
  );
}
