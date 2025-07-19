import * as Y from "yjs";

type Props = {
  yUndoManager: Y.UndoManager;
};

export function Toolbar({ yUndoManager }: Props) {
  return (
    <div className="flex p-4 gap-1.5">
      <button
        className="flex items-center justify-center cursor-pointer rounded-md h-6 w-6 bg-white text-gray-800 border-none shadow-[rgba(0,0,0,0.12)_0_4px_8px_0,rgba(0,0,0,0.02)_0_0_0_1px] hover:text-gray-900 hover:shadow-[rgba(0,0,0,0.16)_0_5px_8px_0,rgba(0,0,0,0.04)_0_0_0_1px] focus-visible:outline-offset-2"
        onClick={() => yUndoManager.undo()}
        aria-label="undo"
      >
        <UndoIcon />
      </button>

      <button
        className="flex items-center justify-center cursor-pointer rounded-md h-6 w-6 bg-white text-gray-800 border-none shadow-[rgba(0,0,0,0.12)_0_4px_8px_0,rgba(0,0,0,0.02)_0_0_0_1px] hover:text-gray-900 hover:shadow-[rgba(0,0,0,0.16)_0_5px_8px_0,rgba(0,0,0,0.04)_0_0_0_1px] focus-visible:outline-offset-2"
        onClick={() => yUndoManager.redo()}
        aria-label="redo"
      >
        <RedoIcon />
      </button>
    </div>
  );
}

export function UndoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6h6a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H8.91"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M5.5 3.5 3 6l2.5 2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function RedoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 6H6a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h1.09"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M10.5 3.5 13 6l-2.5 2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
