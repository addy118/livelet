"use client";

import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();

  console.log(session.status);
  return session?.data?.user;
};
