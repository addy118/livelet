"use client";

import React from "react";
import { UserButton } from "@/components/auth/user-button";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="glass bg-[#000000]/80 border-b border-[#333333]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-[#ffffff] tracking-tight">
                Auth Kit
              </h1>
            </div>
            <div className="flex items-center">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
