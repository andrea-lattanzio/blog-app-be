/*
  Warnings:

  - You are about to drop the column `articleID` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `NewsletterSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `User` table. All the data in the column will be lost.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_articleID_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "articleID",
ADD COLUMN     "articleId" TEXT;

-- AlterTable
ALTER TABLE "NewsletterSubscription" DROP COLUMN "is_active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastname",
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
