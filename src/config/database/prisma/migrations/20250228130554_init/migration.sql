-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "articleId" INTEGER NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paragraph" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "style" TEXT,
    "chapterId" INTEGER NOT NULL,

    CONSTRAINT "Paragraph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeSection" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "caption" TEXT,
    "paragraphId" INTEGER NOT NULL,

    CONSTRAINT "CodeSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeSection" ADD CONSTRAINT "CodeSection_paragraphId_fkey" FOREIGN KEY ("paragraphId") REFERENCES "Paragraph"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
