import React from "react";
import { HomePage } from "@/components/home/home";
import { LandingPage } from "@/components/home/landing-page";
import User from "@/data/user";
import { currentUser } from "@/lib/auth";

export default async function Home() {
  const user = await currentUser();
  if (!user || !user.id) return;
  const rooms = await User.getRooms(user.id);
  console.log("main page");
  console.log(user);

  console.log(user ? "home page" : "landing page");

  return (
    <main className="flex h-full flex-col items-center justify-center">
      {user ? <HomePage rooms={rooms} /> : <LandingPage />}
    </main>
  );
}
