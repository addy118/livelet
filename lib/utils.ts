import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { validate } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isEqual = <T>(arr1: T[], arr2: T[]): boolean => {
  return (
    arr1.length == arr2.length && arr1.every((val, idx) => val == arr2[idx])
  );
};
