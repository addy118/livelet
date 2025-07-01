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

const customDarkTheme = EditorView.theme(
  {
    "&": { backgroundColor: "#0e0e0e", color: "#f1f1f1" },
    ".cm-content": { caretColor: "#ffffff" },
    ".cm-gutters": {
      backgroundColor: "#0e0e0e",
      color: "#4b5563",
      border: "none",
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
      ],
    });

    const view = new EditorView({ state, parent: element });

    return () => view?.destroy();
  }, [element, room, userInfo, provider]);

  const handleCodeSubmit = async () => {
    if (!yTextInstance) {
      console.error("Editor is not ready yet.");
      return;
    }

    const currentCode = yTextInstance.toString().trim();
    if (!currentCode) {
      alert("No code provided!");
      return;
    }

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
    } catch (error) {
      console.error("Judge0 API error:", error);
      setOutput("Execution failed. Check your code or try again.");
    } finally {
      setStatus("Run");
    }
  };

  return (
    <div className="flex flex-col border border-black/70 rounded-xl w-full h-full overflow-hidden text-gray-900 bg-white">
      <div className="flex justify-between items-center bg-[#262727]">
        {yUndoManager && <Toolbar yUndoManager={yUndoManager} />}
        <div className="flex items-center gap-2 p-2 text-white">
          <Select
            onValueChange={(val: Language) => setLanguage(val)}
            defaultValue={language}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Python" />
            </SelectTrigger>
            <SelectContent>
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
            className="bg-green-500 dark:bg-green-300 text-black p-2 px-5 rounded-xl inline-flex items-center font-bold transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
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

      <div className="flex flex-col lg:flex-row">
        <div
          className="relative flex-grow min-h-[400px] overflow-auto bg-black"
          ref={ref}
        />
        <div className="flex flex-col flex-shrink-0 w-full lg:w-1/3 p-3 bg-gray-100 rounded-lg">
          <div className="font-bold mb-2">OUTPUT</div>
          <div
            className={`flex-grow whitespace-pre-wrap break-words text-sm overflow-y-auto max-h-96 p-2 rounded-lg border ${
              outputStatus === "success"
                ? "bg-green-50 border-green-300 text-green-800"
                : outputStatus === "error"
                  ? "bg-red-50 border-red-300 text-red-800"
                  : "bg-gray-50 border-gray-300 text-gray-800"
            }`}
            aria-live="polite"
          >
            {output || "Your output will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}
