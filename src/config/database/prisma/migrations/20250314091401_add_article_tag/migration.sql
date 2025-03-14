/*
  Warnings:

  - Added the required column `tag` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ArticleTag" AS ENUM ('Angular', 'React', 'Node');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "tag" "ArticleTag" NOT NULL;
