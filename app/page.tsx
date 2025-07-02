// "use client";

import React from "react";
// import { useSession } from "next-auth/react";
import { HomePage } from "@/components/home/home";
import { LandingPage } from "@/components/home/landing-page";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex h-full flex-col items-center justify-center">
      {session ? <HomePage user={session?.user} /> : <LandingPage />}
    </main>
  );
}
