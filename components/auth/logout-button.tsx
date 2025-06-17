"use client";

import { ReactNode } from "react";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  children?: ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  return (
    <span onClick={() => signOut()} className="cursor-pointer">
      {children}
    </span>
  );
};
