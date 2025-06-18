import Image from "next/image";

export function Loading() {
  return (
    <div className="absolute w-screen h-screen flex justify-center items-center">
      <Image
        src="https://liveblocks.io/loading.svg"
        alt="Loading"
        width={64}
        height={64}
        className="opacity-20"
      />
    </div>
  );
}
