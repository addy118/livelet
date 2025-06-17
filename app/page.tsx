"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { HomePage } from "@/components/home/home";
import { LandingPage } from "@/components/home/landing-page";

export default function Home() {
  const { data } = useSession();

  return (
    <main className="flex h-full flex-col items-center justify-center">
      {data ? <HomePage /> : <LandingPage />}
    </main>
  );
}
