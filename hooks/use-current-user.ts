"use client";

import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();

  const status = session?.status;
  return { data: session?.data?.user, status };
};
