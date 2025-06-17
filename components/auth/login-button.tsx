"use client";
// important to import from next/navigation and not next/router
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

interface LoginButtonProps {
  children: ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    console.log("LOGIN BUTTON CLIKED");
    router.push("/login");
  };

  if (mode === "modal") {
    return <span> TODO: Implement modal</span>;
  }

  return (
    <span onClick={onClick} className="cursor pointer">
      {children}
    </span>
  );
};
