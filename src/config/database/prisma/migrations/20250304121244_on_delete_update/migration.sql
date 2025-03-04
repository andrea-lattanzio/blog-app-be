-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_articleId_fkey";

-- DropForeignKey
ALTER TABLE "CodeSection" DROP CONSTRAINT "CodeSection_paragraphId_fkey";

-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_chapterId_fkey";

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeSection" ADD CONSTRAINT "CodeSection_paragraphId_fkey" FOREIGN KEY ("paragraphId") REFERENCES "Paragraph"("id") ON DELETE CASCADE ON UPDATE CASCADE;
