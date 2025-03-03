import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create an Article with Chapters, Paragraphs, and CodeSections
  const article = await prisma.article.create({
    data: {
      title: "Understanding Prisma ORM",
      description: "A guide to using Prisma ORM effectively.",
      author: "John Doe",
      chapters: {
        create: [
          {
            title: "Introduction to Prisma",
            content: {
              create: [
                {
                  text: "Prisma is a next-generation ORM...",
                  style: "normal",
                  codeSections: {
                    create: [
                      {
                        language: "typescript",
                        code: "const prisma = new PrismaClient();",
                        caption: "Initializing Prisma Client",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Setting up Prisma",
            content: {
              create: [
                {
                  text: "You need to install Prisma and generate the client...",
                  style: "bold",
                  codeSections: {
                    create: [
                      {
                        language: "shell",
                        code: "npm install @prisma/client",
                        caption: "Installing Prisma Client",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seed data created:", article);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });