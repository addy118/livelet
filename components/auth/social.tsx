"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center justify-center w-full gap-x-3">
      <Button
        className="flex-1 bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] text-[#ffffff] transition-smooth focus-ring justify-center"
        size="lg"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" size={10} />
        <span className="sr-only">Sign in with Google</span>
      </Button>

      <Button
        className="flex-1 bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] text-[#ffffff] transition-smooth focus-ring justify-center"
        size="lg"
        variant="outline"
        onClick={() => onClick("github")}
      >
        <FaGithub className="h-5 w-5" size={10} />
        <span className="sr-only">Sign in with GitHub</span>
      </Button>
    </div>
  );
};
