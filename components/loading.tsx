import React from "react";

interface LoadingProps {
  action?: string;
  item?: string;
  className?: string;
  size?: number;
  thickness?: number;
  bg?: string;
}

const Loading = ({
  action = "Loading",
  item = "data",
  className = "",
  size = 4,
  thickness = 2,
  bg = "gray-700",
}: LoadingProps) => {
  const sizeClass =
    {
      2: "h-2 w-2",
      4: "h-4 w-4",
      6: "h-6 w-6",
      8: "h-8 w-8",
      10: "h-10 w-10",
      12: "h-12 w-12",
    }[size] || "h-4 w-4";

  const thicknessClass =
    {
      2: "border-2",
      4: "border-4",
      8: "border-8",
    }[thickness] || "border-2";

  const bgClass = `border-${bg}`;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 text-black ${className}`}
    >
      <div
        className={`animate-spin rounded-full ${sizeClass} ${thicknessClass} ${bgClass} border-t-black`}
      />
      <p className="font-normal text-sm">
        {action} {item}
      </p>
    </div>
  );
};

export default Loading;
