import type * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full rounded-sm border border-[#333333] bg-[#1a1a1a] px-4 py-2 text-xs text-[#ffffff] placeholder:text-[#888888] transition-smooth",
        "hover:border-[#444444]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-[#ffffff]",
        className
      )}
      {...props}
    />
  );
}

export { Input };
