import { AuthProvider, PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const author = await prisma.user.create({
    data: {
      name: 'Alice',
      lastName: 'Nguyen',
      email: 'alice@example.com',
      password: 'securepass',
      authProvider: AuthProvider.Local,
      role: UserRole.Author,
    },
  });

  const reader = await prisma.user.create({
    data: {
      name: 'Bob',
      lastName: 'Smith',
      email: 'bob@example.com',
      password: 'anotherpass',
      authProvider: AuthProvider.Local,
      role: UserRole.Reader,
    },
  });

  // Create articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'Getting Started with Angular',
        description: 'A comprehensive beginner guide to Angular.',
        tag: 'angular',
        author: { connect: { id: author.id } },
        chapters: {
          create: [
            {
              title: 'Introduction',
              paragraphs: {
                create: [
                  {
                    text: 'Angular is a platform for building web applications...',
                    codeSections: {
                      create: [
                        {
                          language: 'typescript',
                          code: 'import { Component } from \'@angular/core\';',
                          caption: 'Basic Angular import',
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
    }),
    prisma.article.create({
      data: {
        title: 'Building APIs with Node.js',
        description: 'Learn how to build RESTful APIs using Node.js and Express.',
        tag: 'node',
        author: { connect: { id: author.id } },
        chapters: {
          create: [
            {
              title: 'Setting up the Environment',
              paragraphs: {
                create: [
                  {
                    text: 'Node.js allows JavaScript to run on the server...',
                    codeSections: {
                      create: [
                        {
                          language: 'javascript',
                          code: 'const express = require(\'express\');',
                          caption: 'Basic Express setup',
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
    }),
    prisma.article.create({
      data: {
        title: 'Mastering React Components',
        description: 'Understand the fundamentals of creating React components.',
        tag: 'react',
        author: { connect: { id: author.id } },
        chapters: {
          create: [
            {
              title: 'Component Basics',
              paragraphs: {
                create: [
                  {
                    text: 'React components let you split the UI into independent pieces...',
                    codeSections: {
                      create: [
                        {
                          language: 'javascript',
                          code: 'function Welcome() { return <h1>Hello, world!</h1>; }',
                          caption: 'Simple React component',
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
    }),
  ]);

  // Likes
  await prisma.like.createMany({
    data: articles.map((article) => ({
      userId: reader.id,
      articleId: article.id,
    })),
  });

  // Comments and replies
  const comment = await prisma.comment.create({
    data: {
      text: 'Great article!',
      articleId: articles[0].id,
      userId: reader.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Thanks!',
      articleId: articles[0].id,
      userId: author.id,
      parentId: comment.id,
    },
  });

  // Newsletter subscriptions
  await prisma.newsletterSubscription.createMany({
    data: [
      { email: 'sub1@example.com' },
      { email: 'sub2@example.com' },
    ],
  });

  // Password reset logs with fixed dates
  await prisma.passwordResetLog.createMany({
    data: [
      {
        email: 'alice@example.com',
        token: 'reset-token-123',
        used: false,
        expiresAt: new Date('2025-07-10T12:00:00Z'),
      },
      {
        email: 'bob@example.com',
        token: 'reset-token-456',
        used: true,
        expiresAt: new Date('2025-06-20T12:00:00Z'),
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
