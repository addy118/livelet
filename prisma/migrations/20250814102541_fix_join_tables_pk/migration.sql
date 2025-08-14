-- AlterTable
ALTER TABLE "public"."GroupRoom" ADD CONSTRAINT "GroupRoom_pkey" PRIMARY KEY ("groupId", "roomId");

-- DropIndex
DROP INDEX "public"."GroupRoom_groupId_roomId_key";

-- AlterTable
ALTER TABLE "public"."UserGroup" ADD CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("userId", "groupId");

-- DropIndex
DROP INDEX "public"."UserGroup_userId_groupId_key";

-- AlterTable
ALTER TABLE "public"."UserRoom" ADD CONSTRAINT "UserRoom_pkey" PRIMARY KEY ("userId", "roomId");

-- DropIndex
DROP INDEX "public"."UserRoom_userId_roomId_key";
