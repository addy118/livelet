"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button
      variant="link"
      className="font-normal w-full text-[#888888] hover:text-[#ffffff] transition-smooth p-0 h-auto text-sm"
      size="sm"
      asChild
    >
      <Link
        href={href}
        className="focus-ring rounded-md px-2 py-1"
      >
        {label}
      </Link>
    </Button>
  );
};
