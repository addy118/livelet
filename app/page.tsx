// "use client";

import React from "react";
// import { useSession } from "next-auth/react";
import { HomePage } from "@/components/home/home";
import { LandingPage } from "@/components/home/landing-page";
import { auth } from "@/auth";
import User from "@/data/user";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) return;
  const rooms = await User.getRooms(user.id);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      {session ? <HomePage user={session?.user} rooms={rooms} /> : <LandingPage />}
    </main>
  );
}
