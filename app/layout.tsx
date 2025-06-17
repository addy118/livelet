import type { Metadata } from "next";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { Navbar } from "./(protected)/_components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth Kit - Secure Authentication",
  description: "Modern authentication system built with Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-br from-[#000000] via-[#111111] to-[#000000]">
        <SessionProvider session={session}>
          <div className="min-h-screen w-full flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
              <div className="w-full max-w-md">{children}</div>
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
