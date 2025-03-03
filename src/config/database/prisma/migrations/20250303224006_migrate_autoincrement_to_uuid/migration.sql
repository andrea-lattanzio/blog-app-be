/*
  Warnings:

  - The primary key for the `Article` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Chapter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CodeSection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Paragraph` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_articleId_fkey";

-- DropForeignKey
ALTER TABLE "CodeSection" DROP CONSTRAINT "CodeSection_paragraphId_fkey";

-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_chapterId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP CONSTRAINT "Article_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Article_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Article_id_seq";

-- AlterTable
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "articleId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Chapter_id_seq";

-- AlterTable
ALTER TABLE "CodeSection" DROP CONSTRAINT "CodeSection_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "paragraphId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CodeSection_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CodeSection_id_seq";

-- AlterTable
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "chapterId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Paragraph_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Paragraph_id_seq";

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeSection" ADD CONSTRAINT "CodeSection_paragraphId_fkey" FOREIGN KEY ("paragraphId") REFERENCES "Paragraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
