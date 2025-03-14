/*
  Warnings:

  - Added the required column `lastnamne` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastnamne" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
