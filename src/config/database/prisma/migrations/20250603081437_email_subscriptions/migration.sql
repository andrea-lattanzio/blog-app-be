/*
  Warnings:

  - You are about to drop the `NewsletterSubscribption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "NewsletterSubscribption";

-- CreateTable
CREATE TABLE "NewsletterSubscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NewsletterSubscription_pkey" PRIMARY KEY ("id")
);
