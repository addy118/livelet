"use client";

import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export const SignedNav = () => {
  const router = useRouter();

  return (
    <div className="flex">
      <Button
        variant="link"
        onClick={() => router.push("/groups")}
        className="inline-flex items-center gap-2 px-2 py-1"
      >
        <span className="text-sm leading-none">Groups</span>
      </Button>

      <Button
        variant="link"
        onClick={() => router.push("/room/new")}
        className="inline-flex items-center gap-2 px-2 py-1"
      >
        <SquarePlus className="w-5 h-5" />
        <span className="text-sm leading-none">New Room</span>
      </Button>

      <Button
        variant="link"
        onClick={() => router.push("/group/new")}
        className="inline-flex items-center gap-2 px-2 py-1"
      >
        <SquarePlus className="w-5 h-5" />
        <span className="text-sm leading-none">New Group</span>
      </Button>
    </div>
  );
};
