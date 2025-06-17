"use client";

import * as Y from "yjs";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useCallback, useEffect, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { yCollab } from "y-codemirror.next";
import { Toolbar } from "./toolbar";
import { Avatars } from "./liveblocks-avatar";
// import { HighlightStyle, tags as t } from "@codemirror/highlight";

// const customHighlightStyle = HighlightStyle.define([
//   { tag: t.keyword, color: "#ff7edb" },
//   { tag: [t.name, t.deleted, t.character, t.propertyName], color: "#ffd580" },
//   { tag: [t.function(t.variableName)], color: "#43d9ad" },
//   { tag: [t.labelName], color: "#ffcb6b" },
//   { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#82aaff" },
//   { tag: [t.definition(t.name), t.separator], color: "#c792ea" },
//   { tag: [t.className], color: "#ffcb6b" },
//   {
//     tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
//     color: "#f78c6c",
//   },
//   { tag: [t.typeName], color: "#addb67" },
//   { tag: [t.operator, t.operatorKeyword], color: "#89ddff" },
//   { tag: [t.string], color: "#c3e88d" },
//   { tag: [t.meta, t.comment], color: "#546e7a", fontStyle: "italic" },
//   { tag: [t.strong], fontWeight: "bold" },
//   { tag: [t.emphasis], fontStyle: "italic" },
//   { tag: [t.link], textDecoration: "underline" },
// ]);

// refer: https://codemirror.net/examples/styling/
const customDarkTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#0e0e0e",
      color: "#f1f1f1",
    },
    ".cm-content": {
      caretColor: "#ffffff",
    },
    ".cm-gutters": {
      backgroundColor: "#0e0e0e",
      color: "#4b5563", // Tailwind gray-600
      border: "none",
    },
    ".cm-activeLine": {
      backgroundColor: "#1e1e1e", // 👈 brighter line on focus
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#1e1e1e",
      color: "#f9fafb", // lighter line number
    },
  },
  { dark: true }
);



export function CollaborativeEditor() {
  const room = useRoom();

  // liveblocks x yjs
  const provider = getYjsProviderForRoom(room);

  const [element, setElement] = useState<HTMLElement>();
  const [yUndoManager, setYUndoManager] = useState<Y.UndoManager>();

  const userInfo = useSelf((me) => me.info);

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    setElement(node);
  }, []);

  // set up liveblocks yjs provider & attach codemirror editor
  useEffect(
    () => {
      if (!element || !room || !userInfo) return;

      // create yjs provider & document
      const ydoc = provider.getYDoc();
      const ytext = ydoc.getText("codemirror");
      const undoManager = new Y.UndoManager(ytext);
      setYUndoManager(undoManager);

      // attach user info to yjs
      provider.awareness.setLocalStateField("user", {
        name: userInfo.name,
        color: userInfo.color,
        colorLight: userInfo.color + "80",
      });

      // set up the actual editor powered by codemirror & extensions
      const state = EditorState.create({
        doc: ytext.toString(),
        extensions: [
          // base editor setup by codemirror
          basicSetup,

          // syntax highlighting support
          javascript(),

          // codemirror x yjs
          yCollab(ytext, provider.awareness, { undoManager }),

          // dark theme editor
          // oneDark,
          customDarkTheme,
          // customHighlightStyle
        ],
      });

      // attach codemirror as child to element
      const view = new EditorView({
        state,
        parent: element,
      });

      return () => {
        view?.destroy();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [element, room, userInfo]
  );

  return (
    <div className="flex border border-black/70 flex-col relative rounded-xl bg-white w-full h-full h-[calc(100vh-64px)] text-gray-900 overflow-hidden">
      <div className="flex bg-[#262727] justify-between items-center">
        <div>
          {yUndoManager ? <Toolbar yUndoManager={yUndoManager} /> : null}
        </div>
        <Avatars />
      </div>
      <div className="relative flex-grow overflow-auto" ref={ref}>
        {/* the editor view component from codemirror renders here */}
      </div>
    </div>
  );
}
