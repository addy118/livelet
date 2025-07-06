import type { Metadata } from "next";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { Navbar } from "./(general)/_components/navbar";
import { Providers } from "./Providers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Livelet",
  description: "Modern authentication system built with Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/code.svg" />
      </head>

      <body className="min-h-screen bg-gradient-to-br from-[#000000] via-[#111111] to-[#000000]">
        <SessionProvider session={session}>
          <Providers>
            <div className="min-h-screen w-full flex flex-col">
              <Navbar user={user} />
              <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="w-full h-full">{children}</div>
              </main>
            </div>
          </Providers>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
