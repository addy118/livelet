"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Header } from "./header";
import { Social } from "./social";
import { BackButton } from "./back-button";

interface CardWrapperProps {
  children: ReactNode;
  headerLablel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLablel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="w-full bg-[#111111]/80 glass border border-[#333333]/50 transition-smooth hover:border-[#444444]/50">
        <CardHeader className="pb-4">
          <Header label={headerLablel} />
        </CardHeader>
        <CardContent className="px-8 pb-3">{children}</CardContent>
        {showSocial && (
          <CardFooter className="px-8 pb-6">
            <Social />
          </CardFooter>
        )}
        <CardFooter className="px-8 pb-8 pt-0">
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      </Card>
    </div>
  );
};
