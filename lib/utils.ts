import { accessMap, AccessTuple, RoomAccessType } from "@/types";
import { RoomAccess } from "@prisma/client";
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
  // console.log(something);
  navigator.clipboard.writeText(something);
  // TODO: add beautiful toast message instead of alert
  alert("User ID copied to clipboard");
};

export const toLiveblocksData = (
  userId: string,
  defaultAccess: RoomAccess,
  groups: RoomAccessType[] | undefined,
  users: RoomAccessType[] | undefined
) => {
  const defaultAccesses = accessMap[defaultAccess];

  const groupsAccesses: Record<string, AccessTuple> = {};
  groups?.forEach((group) => {
    // TODO: check whether group.id exists in db
    groupsAccesses[group.id] = [...accessMap[group.access]];
  });

  const usersAccesses: Record<string, AccessTuple> = {};
  // add form body users
  users?.forEach((formUser) => {
    // TODO: check whether user.id exists in db
    usersAccesses[formUser.id] = [...accessMap[formUser.access]];
  });

  return { defaultAccesses, groupsAccesses, usersAccesses };
};
