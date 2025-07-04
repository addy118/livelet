import { db } from "@/lib/db";

class Group {
  static getByGroupId = async (groupId: string) => {
    try {
      const group = await db.group.findFirst({
        where: { id: groupId },
      });

      return group;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in Group.getByGroupId: ", error.stack);
        throw new Error(error.message);
      } else throw new Error("Error in Group.getByGroupId.");
    }
  };
}

export default Group;
