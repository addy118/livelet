import { customAlphabet } from "nanoid";

export const genRoomId = (): string => {
  const nanoid3 = customAlphabet("abcdefghijklmnopqrstuvwxyz", 3);
  const id = `${nanoid3()}-${nanoid3()}-${nanoid3()}`;
  console.log(id);
  return id;
};
