"use client";

import * as Y from "yjs";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useCallback, useEffect, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { yCollab } from "y-codemirror.next";
import axios from "axios";
import { AiOutlineEnter } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import { Toolbar } from "./toolbar";
import { Avatars } from "./liveblocks-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Split from "react-split";

const customDarkTheme = EditorView.theme(
  {
    "&": { backgroundColor: "#0e0e0e", color: "#f1f1f1" },
    ".cm-content": { caretColor: "#ffffff" },
    ".cm-gutters": {
      backgroundColor: "#0e0e0e",
      color: "#4b5563",
      border: "none",
    },
    ".cm-scroller": {
      scrollBehavior: "smooth",
    },
    ".cm-activeLine": { backgroundColor: "#1e1e1e" },
    ".cm-activeLineGutter": { backgroundColor: "#1e1e1e", color: "#f9fafb" },
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
  const [output, setOutput] = useState("");
  const [outputStatus, setOutputStatus] = useState<"success" | "error" | null>(
    null
  );
  const [status, setStatus] = useState("Run");
  const [language, setLanguage] = useState<Language>("python");

  const apiBaseUrl = "https://judge0-extra-ce.p.rapidapi.com";
  const room = useRoom();
  const provider = getYjsProviderForRoom(room);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [yUndoManager, setYUndoManager] = useState<Y.UndoManager | null>(null);
  const [yTextInstance, setYTextInstance] = useState<Y.Text | null>(null);
  const userInfo = useSelf((me) => me.info);

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element || !room || !userInfo) return;

    const ydoc = provider.getYDoc();
    const ytext = ydoc.getText("codemirror");
    setYTextInstance(ytext);
    const undoManager = new Y.UndoManager(ytext);
    setYUndoManager(undoManager);

    provider.awareness.setLocalStateField("user", {
      name: userInfo.name,
      color: userInfo.color,
      colorLight: userInfo.color + "80",
    });

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        javascript(),
        yCollab(ytext, provider.awareness, { undoManager }),
        customDarkTheme,
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({ state, parent: element });

    return () => view?.destroy();
  }, [element, room, userInfo, provider]);

  const handleCodeSubmit = async () => {
    if (!yTextInstance) return alert("Editor not ready!");
    const currentCode = yTextInstance.toString().trim();
    if (!currentCode) return alert("No code provided!");

    setStatus("Submitting...");
    setOutput("");

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_JUDGE_API || "",
        "X-RapidAPI-Host": "judge0-extra-ce.p.rapidapi.com",
      },
    };

    try {
      const { data: submission } = await axios.post(
        `${apiBaseUrl}/submissions?base64_encoded=false&wait=false`,
        {
          source_code: currentCode,
          language_id: languageMap[language],
          stdin: "",
        },
        axiosConfig
      );

      setStatus("Queued...");
      const token = submission.token;

      let result;
      for (let i = 0; i < 10; i++) {
        const { data } = await axios.get(
          `${apiBaseUrl}/submissions/${token}?base64_encoded=false`,
          axiosConfig
        );

        if (data.status.id === 1) setStatus("In Queue...");
        else if (data.status.id === 2) setStatus("Running...");
        else {
          result = data;
          break;
        }

        await new Promise((r) => setTimeout(r, 1000));
      }

      if (result) {
        if (result.stdout) {
          setOutput(result.stdout.trim());
          setOutputStatus("success");
        } else if (result.stderr) {
          setOutput(result.stderr.trim());
          setOutputStatus("error");
        } else if (result.compile_output) {
          setOutput(result.compile_output.trim());
          setOutputStatus("error");
        } else {
          setOutput("No output.");
          setOutputStatus("error");
        }
      } else {
        setOutput("Execution timed out. Try again.");
        setOutputStatus("error");
      }
    } catch (e) {
      console.error("Judge0 API error", e);
      setOutput("Execution failed. Try again.");
      setOutputStatus("error");
    } finally {
      setStatus("Run");
    }
  };

  const createGutter = (direction: string) => {
    const gutter = document.createElement("div");
    gutter.className = `
      flex items-center justify-center
      bg-black hover:bg-blue-900 transition
      ${direction === "horizontal" ? "cursor-col-resize" : "cursor-row-resize"}
    `;
    const dot = document.createElement("div");
    dot.className = `
      rounded-full bg-gray-300
      ${direction === "horizontal" ? "w-1 h-6" : "w-6 h-1"}
    `;
    gutter.appendChild(dot);
    return gutter;
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#0e0e0e] text-gray-200">
      <div className="flex justify-between items-center bg-[#1a1a1a] p-2 shadow-md">
        {yUndoManager && <Toolbar yUndoManager={yUndoManager} />}
        <div className="flex items-center gap-2">
          <Select
            onValueChange={(val: Language) => setLanguage(val)}
            defaultValue={language}
          >
            <SelectTrigger className="w-40 bg-[#2b2b2b] border-none text-gray-200 focus:ring-0">
              <SelectValue placeholder="Python" />
            </SelectTrigger>
            <SelectContent className="bg-[#2b2b2b] text-gray-200">
              {Object.keys(languageMap).map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            disabled={status !== "Run"}
            onClick={handleCodeSubmit}
            className="bg-green-500 text-black p-2 px-5 rounded-xl inline-flex items-center font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
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

      <Split
        className="flex w-full h-full"
        sizes={[75, 25]}
        minSize={[300, 150]}
        gutterSize={6}
        gutter={(i, d) => createGutter(d)}
      >
        <Split
          className="flex flex-col w-full h-full"
          sizes={[70, 30]}
          minSize={[200, 100]}
          direction="vertical"
          gutterSize={6}
          gutter={(i, d) => createGutter(d)}
        >
          <div className="flex-grow flex flex-col min-h-0 bg-black">
            <div className="flex-grow min-h-0 relative overflow-auto bg-black" ref={ref} />
          </div>
          <div className="flex flex-col p-3 bg-[#1e1e1e] rounded-lg overflow-hidden">
            <div className="font-bold mb-2 text-gray-300">OUTPUT</div>
            <div
              className={`flex-grow whitespace-pre-wrap break-words text-sm overflow-y-auto rounded-lg border p-2 ${
                outputStatus === "success"
                  ? "bg-green-100/10 border-green-500 text-green-300"
                  : outputStatus === "error"
                    ? "bg-red-100/10 border-red-500 text-red-300"
                    : "bg-gray-700 border-gray-500 text-gray-300"
              }`}
              aria-live="polite"
            >
              {output || "Your output will appear here..."}
            </div>
          </div>
        </Split>

        <div className="flex flex-col w-full h-full p-3 bg-[#1a1a1a] rounded-lg overflow-hidden">
          <div className="font-bold mb-2 text-gray-300">CHAT (Coming Soon)</div>
          <div className="flex-grow flex items-center justify-center text-gray-400 text-sm text-center border border-dashed border-gray-600 rounded-lg p-4">
            Collaborative chat feature will appear here.
          </div>
        </div>
      </Split>
    </div>
  );
}
