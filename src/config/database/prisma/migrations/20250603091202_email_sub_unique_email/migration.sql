/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `NewsletterSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscription_email_key" ON "NewsletterSubscription"("email");
