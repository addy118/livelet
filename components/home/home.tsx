"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ExtendedUser } from "@/next-auth";

export const HomePage = ({ user }: { user: ExtendedUser }) => {
  const router = useRouter();
  console.log(user.name);

  return (
    <Button onClick={() => router.push("/example")} variant="outline">
      Go to Room
    </Button>
  );
};
