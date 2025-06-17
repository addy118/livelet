import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold transition-smooth disabled:pointer-events-none disabled:opacity-50 focus:outline-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#ffffff] text-[#000000] hover:bg-[#cccccc]",
        destructive: "bg-[#ef4444] text-[#ffffff] hover:bg-[#dc2626] ",
        outline:
          "border border-[#333333] bg-[#1a1a1a] text-[#ffffff] hover:bg-[#222222] hover:border-[#444444]",
        secondary: "bg-[#222222] text-[#ffffff] hover:bg-[#333333]",
        ghost: "text-[#ffffff] hover:bg-[#222222]",
        link: "text-[#888888] underline-offset-4 hover:underline hover:text-[#ffffff]",
      },
      size: {
        default: "h-10 px-6 py-2.5",
        sm: "h-8 rounded-sm px-4 py-2 text-xs",
        lg: "h-11 rounded-sm px-8 py-3 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
