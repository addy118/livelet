import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isEqual = <T>(arr1: T[], arr2: T[]): boolean => {
  return (
    arr1.length == arr2.length && arr1.every((val, idx) => val == arr2[idx])
  );
};

export const copy = (something: string | undefined): void => {
  if (!something) return;
  console.log(something);
  navigator.clipboard.writeText(something);
  // TODO: add beautiful toast message instead of alert
  alert("User ID copied to clipboard");
};
