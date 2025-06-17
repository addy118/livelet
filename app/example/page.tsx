import React from "react";
import { Room } from "../Room";
import { CollaborativeEditor } from "@/components/collab-editor";

const Example = () => {
  return (
    <>
      <main>
        <Room>
          <CollaborativeEditor />
        </Room>
      </main>
    </>
  );
};

export default Example;
