import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";
import React from "react";

const Server = async () => {
  const user = await currentUser();
  return (
    <div>
      <UserInfo label="Server Page" user={user} />
    </div>
  );
};

export default Server;
