"use client";
import * as Y from "yjs";
import { useRoom, useSelf, useOthers } from "@liveblocks/react/suspense";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { useCallback, useEffect, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { csharp } from "@replit/codemirror-lang-csharp";
import { yCollab } from "y-codemirror.next";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import axios from "axios";
import {
  Play,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Terminal,
} from "lucide-react";
import { Toolbar } from "./toolbar";
import { Avatars } from "./liveblocks-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// VS Code inspired syntax highlighting
const vscodeHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#569cd6", fontWeight: "normal" },
  { tag: tags.string, color: "#ce9178" },
  { tag: tags.comment, color: "#6a9955", fontStyle: "italic" },
  { tag: tags.number, color: "#b5cea8" },
  { tag: tags.operator, color: "#d4d4d4" },
  { tag: tags.function(tags.variableName), color: "#dcdcaa" },
  { tag: tags.variableName, color: "#9cdcfe" },
  { tag: tags.typeName, color: "#4ec9b0" },
  { tag: tags.propertyName, color: "#9cdcfe" },
  { tag: tags.className, color: "#4ec9b0" },
  { tag: tags.bracket, color: "#ffd700" },
  { tag: tags.brace, color: "#ffd700" },
  { tag: tags.punctuation, color: "#d4d4d4" },
  { tag: tags.definition(tags.variableName), color: "#4fc1ff" },
  { tag: tags.special(tags.string), color: "#d7ba7d" },
]);

// Enhanced theme with #111111 background and rounded borders
const enhancedTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#111111",
      color: "#d4d4d4",
      fontSize: "14px",
      fontFamily:
        "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
      height: "100%",
      borderRadius: "8px",
      overflow: "hidden",
    },
    ".cm-content": {
      caretColor: "#ffffff",
      padding: "16px 12px",
      minHeight: "100%",
      lineHeight: "1.5",
    },
    ".cm-focused": {
      outline: "none",
    },
    ".cm-editor": {
      borderRadius: "8px",
      height: "100%",
      backgroundColor: "#111111",
    },
    ".cm-scroller": {
      scrollBehavior: "smooth",
      fontFamily: "inherit",
      borderRadius: "8px",
    },
    ".cm-gutters": {
      backgroundColor: "#1a1a1a",
      color: "#666666",
      border: "none",
      paddingLeft: "2px",
      paddingRight: "2px", // Reduced gap between line numbers and code
      minWidth: "18px",
      borderRadius: "8px 0 0 8px",
    },
    ".cm-gutterElement": {
      padding: "0 0px", // Reduced padding
      minWidth: "18px",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      textAlign: "right",
      fontSize: "13px",
    },
    ".cm-activeLine": {
      backgroundColor: "#1a1a1a",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#1a1a1a",
      color: "#ffffff",
    },
    // Enhanced text selection
    ".cm-selectionBackground": {
      backgroundColor: "#264f78 !important",
    },
    ".cm-focused .cm-selectionBackground": {
      backgroundColor: "#264f78 !important",
    },
    ".cm-line ::selection": {
      backgroundColor: "#264f78 !important",
    },
    ".cm-selectionLayer .cm-selectionBackground": {
      backgroundColor: "#264f78 !important",
    },
    "&.cm-focused .cm-selectionBackground": {
      backgroundColor: "#264f78 !important",
    },
    "&:not(.cm-focused) .cm-selectionBackground": {
      backgroundColor: "#264f78 !important",
      opacity: "0.7",
    },
    ".cm-content ::selection": {
      backgroundColor: "#264f78 !important",
      color: "inherit",
    },
    ".cm-content.cm-focused ::selection": {
      backgroundColor: "#264f78 !important",
      color: "inherit",
    },
    ".cm-selectionMatch": {
      backgroundColor: "#264f78 !important",
      opacity: "0.8",
    },
    ".cm-cursor": {
      borderLeftColor: "#ffffff",
      borderLeftWidth: "1px",
    },
    ".cm-cursor-primary": {
      borderLeftColor: "#ffffff",
      borderLeftWidth: "2px",
    },
    ".cm-dropCursor": {
      borderLeftColor: "#ffffff",
      borderLeftWidth: "2px",
    },
    ".cm-searchMatch": {
      backgroundColor: "#515c6a",
      outline: "1px solid #457dff",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#6199ff",
      color: "#ffffff",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "#1a1a1a",
      border: "1px solid #333333",
      color: "#cccccc",
      borderRadius: "3px",
    },
    ".cm-tooltip": {
      backgroundColor: "#1a1a1a",
      border: "1px solid #333333",
      color: "#cccccc",
      borderRadius: "4px",
    },
    ".cm-panels": {
      backgroundColor: "#111111",
      color: "#d4d4d4",
    },
    ".cm-panels.cm-panels-top": {
      borderBottom: "1px solid #333333",
    },
    ".cm-panels.cm-panels-bottom": {
      borderTop: "1px solid #333333",
    },
    ".cm-line": {
      "& ::selection": {
        backgroundColor: "#264f78 !important",
      },
    },
    ".cm-content .cm-line": {
      "& ::selection": {
        backgroundColor: "#264f78 !important",
      },
    },
  },
  { dark: true }
);

const languageMap = {
  c: { id: 1, ext: cpp, label: "C" },
  cpp: { id: 2, ext: cpp, label: "C++" },
  java: { id: 4, ext: java, label: "Java" },
  csharp: { id: 22, ext: csharp, label: "C#" },
  python: { id: 28, ext: python, label: "Python" },
} as const;

type Language = keyof typeof languageMap;

export function CollaborativeEditor() {
  const [output, setOutput] = useState("");
  const [outputStatus, setOutputStatus] = useState<"success" | "error" | null>(
    null
  );
  const [status, setStatus] = useState("Run");
  const [language, setLanguage] = useState<Language>("python");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [outputCollapsed, setOutputCollapsed] = useState(false);
  const [outputHeight, setOutputHeight] = useState(250);
  const apiBaseUrl = "https://judge0-extra-ce.p.rapidapi.com";

  const room = useRoom();
  const provider = getYjsProviderForRoom(room);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [yUndoManager, setYUndoManager] = useState<Y.UndoManager | null>(null);
  const [yTextInstance, setYTextInstance] = useState<Y.Text | null>(null);
  const userInfo = useSelf((me) => me.info);
  const others = useOthers();

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
      color: userInfo.colors[1],
      colorLight: userInfo.colors[0] + "80",
    });

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        languageMap[language].ext(),
        yCollab(ytext, provider.awareness, { undoManager }),
        enhancedTheme,
        syntaxHighlighting(vscodeHighlightStyle),
        EditorView.lineWrapping,
        EditorView.theme({
          ".cm-editor": { height: "100%" },
          ".cm-scroller": { overflow: "auto" },
        }),
      ],
    });

    const view = new EditorView({ state, parent: element });

    return () => view?.destroy();
  }, [element, room, userInfo, provider, language]);

  const handleCodeSubmit = async () => {
    if (!yTextInstance) return alert("Editor not ready!");
    const currentCode = yTextInstance.toString().trim();
    if (!currentCode) return alert("No code provided!");

    setStatus("Submitting...");
    setOutput("");
    setOutputCollapsed(false); // Auto-expand output when running

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
          language_id: languageMap[language].id,
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

  return (
    <div className="flex w-full h-full rounded-sm bg-[#111111] text-[#d4d4d4] overflow-hidden">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#1a1a1a] border-b border-[#333333] px-4 py-2 h-12 flex-shrink-0">
          <div className="flex items-center gap-4">
            {yUndoManager && <Toolbar yUndoManager={yUndoManager} />}
          </div>

          <div className="flex items-center gap-3">
            <Select
              onValueChange={(val: Language) => setLanguage(val)}
              defaultValue={language}
            >
                <SelectTrigger
                className="w-28 bg-[#222222] border-[#333333] text-[#d4d4d4] focus:border-[#007acc] h-7 min-h-0 py-0 px-2 rounded-sm text-xs leading-5"
                style={{ height: "30px", minHeight: "0", paddingTop: 0, paddingBottom: 0 }}
                >
                <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#222222] border-[#333333] text-[#d4d4d4] rounded-sm text-xs py-0">
                {Object.entries(languageMap).map(([key, lang]) => (
                  <SelectItem
                  key={key}
                  value={key}
                  className="focus:bg-[#094771] focus:text-white rounded-sm text-xs py-1"
                  >
                  {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              disabled={status !== "Run"}
              onClick={handleCodeSubmit}
              className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-2 h-7 rounded-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "Run" ? (
                <>
                  <Play className="w-3 h-3 mr-2" />
                  Run
                </>
              ) : (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  {status}
                </>
              )}
            </Button>
          </div>

          <Avatars />
        </div>

        {/* Editor and Output Container */}
        <div className="flex-1 flex flex-col min-h-0 p-3 gap-3 overflow-hidden">
          {/* Code Editor */}
          <div
            className="bg-[#111111] rounded-lg border border-[#333333] overflow-hidden flex-shrink-0"
            style={{
              height: outputCollapsed
                ? "calc(100vh - 140px)" // Account for navbar + header + padding
                : `calc(100vh - ${outputHeight + 176}px)`, // Account for navbar + header + output + padding
            }}
          >
            <div className="h-full" ref={ref} />
          </div>

          {/* Output Panel */}
          {!outputCollapsed && (
            <div
              className="bg-[#111111] rounded-lg border border-[#333333] overflow-hidden flex-shrink-0"
              style={{ height: `${outputHeight}px` }}
            >
              {/* Output Header */}
              <div className="flex items-center justify-between bg-[#1a1a1a] border-b border-[#333333] px-4 py-2 h-9 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#cccccc]" />
                  <span className="text-sm font-medium text-[#cccccc]">
                    Output
                  </span>
                  {outputStatus && (
                    <Badge
                      variant={
                        outputStatus === "success" ? "default" : "destructive"
                      }
                      className={`text-xs h-5 rounded-md ${
                        outputStatus === "success"
                          ? "bg-[#16825d] text-white"
                          : "bg-[#f14c4c] text-white"
                      }`}
                    >
                      {outputStatus === "success" ? "Success" : "Error"}
                    </Badge>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOutputCollapsed(true)}
                  className="h-6 w-6 p-0 text-[#cccccc] hover:bg-[#333333] rounded-sm"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>

              {/* Output Content */}
              <div
                className="flex-1 p-3 overflow-auto"
                style={{ height: `${outputHeight - 45}px` }}
              >
                <pre
                  className={`w-full h-full whitespace-pre-wrap font-mono text-sm rounded-md border p-3 overflow-auto ${
                    outputStatus === "success"
                      ? "bg-[#0a1a0a] border-[#16825d] text-[#4ec9b0]"
                      : outputStatus === "error"
                        ? "bg-[#1a0a0a] border-[#f14c4c] text-[#f14c4c]"
                        : "bg-[#1a1a1a] border-[#333333] text-[#cccccc]"
                  }`}
                >
                  {output || "Your output will appear here..."}
                </pre>
              </div>
            </div>
          )}

          {/* Collapsed Output Bar */}
          {outputCollapsed && (
            <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] h-9 flex items-center justify-between px-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#cccccc]" />
                <span className="text-sm font-medium text-[#cccccc]">
                  Output
                </span>
                {outputStatus && (
                  <Badge
                    variant={
                      outputStatus === "success" ? "default" : "destructive"
                    }
                    className={`text-xs h-5 rounded-md ${
                      outputStatus === "success"
                        ? "bg-[#16825d] text-white"
                        : "bg-[#f14c4c] text-white"
                    }`}
                  >
                    {outputStatus === "success" ? "Success" : "Error"}
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOutputCollapsed(false)}
                className="h-6 w-6 p-0 text-[#cccccc] hover:bg-[#333333] rounded-sm"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Sidebar */}
      <div
        className={`relative transition-all duration-300 flex-shrink-0 ${sidebarCollapsed ? "w-0" : "w-80"}`}
      >
        {/* Collapse/Expand Button */}
        <Button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-[#1a1a1a] hover:bg-[#333333] border border-[#333333] rounded-l-md p-0 flex items-center justify-center"
        >
          {sidebarCollapsed ? (
            <ChevronLeft className="w-3 h-3 text-[#cccccc]" />
          ) : (
            <ChevronRight className="w-3 h-3 text-[#cccccc]" />
          )}
        </Button>

        {/* Sidebar Content */}
        <div
          className={`h-full bg-[#1a1a1a] border-l border-[#333333] transition-all duration-300 ${
            sidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="p-4 space-y-4">
            {/* Chat Placeholder */}
            <div className="bg-[#111111] rounded-lg border border-[#333333] p-3">
              <h4 className="text-sm font-medium text-[#cccccc] mb-3">
                Team Chat
              </h4>
              <div className="min-h-100 flex items-center justify-center text-xs text-[#666666] text-center border border-dashed border-[#333333] rounded-md">
                Real-time chat coming soon...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
