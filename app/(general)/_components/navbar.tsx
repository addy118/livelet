"use client";

import React from "react";
import { UserButton } from "@/components/auth/user-button";
import { useRouter } from "next/navigation";
import { SignedNav } from "./signed-navbar";
import { ExtendedUser } from "@/next-auth";

export const Navbar = ({ user }: { user: ExtendedUser | undefined }) => {
  const router = useRouter();

  return (
    <nav className="w-full">
      <div className="glass bg-[#000000] border-b border-[#333333]/50">
        <div className="">
          <div className="flex justify-between items-center h-14 px-6 md:px-8">
            <div className="flex items-center justify-between space-x-0">
              <h1
                className="text-xl font-bold cursor-pointer text-[#ffffff] tracking-tight"
                onClick={() => router.push("/")}
              >
                Livelet
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {!!user && <SignedNav />}
              <UserButton user={user} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
