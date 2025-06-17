import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

export const HomePage = () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.push("/example")} variant="outline">
      Go to Room
    </Button>
  );
};
