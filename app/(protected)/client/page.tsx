"use client";

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";
import React from "react";

const Client = () => {
  const user = useCurrentUser();
  
  console.log("User from client: ", user);
  return (
    <div>
      <UserInfo label="Client Page" user={user} />
    </div>
  );
};

export default Client;
