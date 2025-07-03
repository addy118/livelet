/*
  Warnings:

  - Added the required column `createdAt` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'REVOKED');

-- CreateEnum
CREATE TYPE "RoomRole" AS ENUM ('OWNER', 'MEMBER');

-- CreateEnum
CREATE TYPE "RoomAccess" AS ENUM ('VIEW', 'EDIT');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoom" (
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "access" "RoomAccess" NOT NULL DEFAULT 'VIEW',
    "role" "RoomRole" NOT NULL DEFAULT 'MEMBER',
    "invitedBy" TEXT,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "joinedAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "GroupRoom" (
    "groupId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "access" "RoomAccess" NOT NULL DEFAULT 'VIEW',
    "role" "RoomRole" NOT NULL DEFAULT 'MEMBER'
);

-- CreateIndex
CREATE INDEX "Room_name_idx" ON "Room"("name");

-- CreateIndex
CREATE INDEX "UserRoom_userId_idx" ON "UserRoom"("userId");

-- CreateIndex
CREATE INDEX "UserRoom_roomId_idx" ON "UserRoom"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoom_userId_roomId_key" ON "UserRoom"("userId", "roomId");

-- CreateIndex
CREATE INDEX "GroupRoom_groupId_idx" ON "GroupRoom"("groupId");

-- CreateIndex
CREATE INDEX "GroupRoom_roomId_idx" ON "GroupRoom"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupRoom_groupId_roomId_key" ON "GroupRoom"("groupId", "roomId");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoom" ADD CONSTRAINT "UserRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoom" ADD CONSTRAINT "UserRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoom" ADD CONSTRAINT "UserRoom_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRoom" ADD CONSTRAINT "GroupRoom_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRoom" ADD CONSTRAINT "GroupRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
