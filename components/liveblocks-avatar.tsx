import { useOthers, useSelf } from "@liveblocks/react/suspense";
import Image from "next/image";

export function Avatars() {
  const users = useOthers();
  const currentUser = useSelf();

  return (
    <div className=" flex px-3">
      {users.map(({ connectionId, info }) => {
        const userInfo = info;
        console.log(userInfo.avatar);
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
  const [firstName, lastName] = name.split(" ");
  const fallbackImg = `https://ui-avatars.com/api/?name=${firstName}+${lastName ? lastName : ""}&background=111&color=fff`;
  console.log(fallbackImg);

  return (
    <div
      className="flex justify-center items-center relative border-2 border-gray-800 rounded-full w-[32px] h-[32px] bg-gray-400 -ml-3 group"
      data-tooltip={name}
    >
      <Image
        src={picture || fallbackImg}
        alt="Avatar"
        width={32}
        height={32}
        className="w-full h-full rounded-full object-cover"
        data-tooltip={name}
      />
      <div className="absolute top-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out py-1 px-2.5 text-white text-xs rounded-lg mt-2.5 z-10 bg-black whitespace-nowrap pointer-events-none">
        {name}
      </div>
    </div>
  );
}
