export {}

declare global {
  interface Liveblocks {
    UserMeta: {
      id: string;
      info: {
        name:string;
        avatar: string;
        colors: string[];
      }
    }
  }
}