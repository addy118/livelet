// currently not in use
"use client";

// important to import from next/navigation and not next/router
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

interface RegiButtonProps {
  children: ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const RegiButton = ({
  children,
  mode = "redirect",
  asChild,
}: RegiButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    console.log("REGISTER BUTTON CLIKED");
    router.push("/register");
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
