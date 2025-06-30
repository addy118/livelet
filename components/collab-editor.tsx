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

import axios from "axios";
import { AiOutlineEnter } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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

const languageMap = {
  c: 1,
  cpp: 2,
  java: 4,
  csharp: 22,
  python: 28,
} as const;

type Language = keyof typeof languageMap;

export function CollaborativeEditor() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Run");
  const [language, setLanguage] = useState<Language>("python");
  const apiBaseUrl = "https://judge0-extra-ce.p.rapidapi.com";

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
  const [yTextInstance, setYTextInstance] = useState<Y.Text | null>(null);
  useEffect(
    () => {
      if (!element || !room || !userInfo) return;

      // create yjs provider & document
      const ydoc = provider.getYDoc();
      const ytext = ydoc.getText("codemirror");
      setYTextInstance(ytext);
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

  const handleCodeSubmit = async () => {
    setStatus("Submitting...");
    setOutput("");
    if (!yTextInstance) {
      console.error("Editor is not ready yet.");
      return;
    }
    setCode(yTextInstance.toString());
    try {
      const { data: submission } = await axios.post(
        `${apiBaseUrl}/submissions?base64_encoded=false&wait=false`,
        {
          source_code: yTextInstance.toString() || "",
          language_id: languageMap[language],
          stdin: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_JUDGE_API || "",
            "X-RapidAPI-Host": "judge0-extra-ce.p.rapidapi.com",
          },
        }
      );

      const token = submission.token;
      setStatus("Queued...");

      let result;
      for (let i = 0; i < 10; i++) {
        try {
          const { data } = await axios.get(
            `${apiBaseUrl}/submissions/${token}?base64_encoded=false`,
            {
              headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": process.env.NEXT_PUBLIC_JUDGE_API || "",
                "X-RapidAPI-Host": "judge0-extra-ce.p.rapidapi.com",
              },
            }
          );

          if (data.status.id === 1) {
            setStatus("In Queue...");
          } else if (data.status.id === 2) {
            setStatus("Running...");
          } else {
            result = data;
            break;
          }
        } catch (pollErr) {
          console.error("Polling error:", pollErr);
          setOutput("Failed to get execution result. Try again.");
          return;
        }

        await new Promise((r) => setTimeout(r, 1000));
      }

      if (result) {
        if (result.stdout) setOutput(result.stdout.trim());
        else if (result.stderr) setOutput(result.stderr.trim());
        else if (result.compile_output) setOutput(result.compile_output.trim());
        else setOutput("No output.");
      } else {
        setOutput("Execution timed out. Try again.");
      }
    } catch (error) {
      console.error("Judge0 API error:", error);
      setOutput("Execution failed. Check your code or try again.");
    } finally {
      setStatus("Run");
    }
  };

  return (
    <div className="flex border border-black/70 flex-col relative rounded-xl bg-white w-full h-full h-[calc(100vh-64px)] text-gray-900 overflow-hidden">
      <div className="flex bg-[#262727] justify-between items-center">
        <div>
          {yUndoManager ? <Toolbar yUndoManager={yUndoManager} /> : null}
        </div>
        <div className="flex items-center gap-2 p-2 text-white">
          <Select
            onValueChange={(e) => setLanguage(e as Language)}
            defaultValue={language}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Python" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="cpp">CPP</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
            </SelectContent>
          </Select>
          <button
            disabled={status !== "Run"}
            className={`bg-green-500 dark:bg-green-300 text-black p-2 px-5 rounded-xl inline-flex items-center transition-transform font-bold disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleCodeSubmit}
          >
            {status}
            {status === "Run" ? (
              <AiOutlineEnter className="ml-2" />
            ) : (
              <CgSpinner className="ml-2 animate-spin" />
            )}
          </button>
        </div>
        <Avatars />
      </div>
      <div className="flex flow-col ">
        <div className="relative flex-grow overflow-auto" ref={ref}></div>
        <div className="flex flex-col flex-shrink-0 w-full lg:w-1/3 p-3 bg-gray-100 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold">OUTPUT</div>
          </div>
          <pre
            aria-live="polite"
            className="whitespace-pre-wrap break-words flex-grow text-sm overflow-y-auto max-h-96 p-1"
          >
            {output || "Your output will appear here..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
