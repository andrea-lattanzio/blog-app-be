import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper function to generate random dates within a range
function getRandomDate(start: Date, end: Date): Date {
    const diff = end.getTime() - start.getTime();
    const newDiff = diff * Math.random();
    return new Date(start.getTime() + newDiff);
}

// Helper function to generate a random number of views
function getRandomViews(): number {
    return Math.floor(Math.random() * 5000) + 100; // Between 100 and 5100 views
}

// Helper function to generate a random number of likes
function getRandomLikes(): number {
    return Math.floor(Math.random() * 1000) + 50; // Between 50 and 1050 likes
}

async function main() {
    console.log('Starting realistic data seeding...');

    // --- Create Users ---
    const hashedPassword = await bcrypt.hash('securepassword123', 10);

    const john = await prisma.user.upsert({
        where: { email: 'john.developer@devblog.com' },
        update: {},
        create: {
            name: 'John',
            lastname: 'Developer',
            username: 'john_dev',
            email: 'john.developer@devblog.com',
            password: hashedPassword,
            authProvider: 'Local',
        },
    });

    const jane = await prisma.user.upsert({
        where: { email: 'jane.coder@devblog.com' },
        update: {},
        create: {
            name: 'Jane',
            lastname: 'Coder',
            username: 'jane_coder',
            email: 'jane.coder@devblog.com',
            password: hashedPassword,
            authProvider: 'Local',
        },
    });

    const alex = await prisma.user.upsert({
        where: { email: 'alex.tech@devblog.com' },
        update: {},
        create: {
            name: 'Alex',
            lastname: 'Techie',
            username: 'alex_techie',
            email: 'alex.tech@devblog.com',
            password: hashedPassword,
            authProvider: 'Local',
        },
    });

    console.log('Users created: John, Jane, Alex');

    // --- Article Content Generator ---
    const createArticleWithContent = async (
        title: string,
        description: string,
        tag: 'angular' | 'node' | 'react',
        userId: string,
        creationDate: Date
    ) => {
        const article = await prisma.article.create({
            data: {
                title,
                description,
                tag,
                userId,
                views: getRandomViews(),
                likes: getRandomLikes(), // Added likes property
                createdAt: creationDate,
                updatedAt: creationDate, // For initial creation, updated at is the same
            },
        });

        console.log(`- Created article: "${article.title}" [${article.tag}]`);

        // Create chapters and paragraphs
        for (let i = 1; i <= 3; i++) {
            const chapterTitle = `Chapter ${i}: Deep Dive into ${i === 1
                ? 'Fundamentals'
                : i === 2
                    ? 'Advanced Concepts'
                    : 'Best Practices'
                }`;
            const chapter = await prisma.chapter.create({
                data: {
                    title: chapterTitle,
                    articleId: article.id,
                },
            });

            for (let j = 1; j <= 3; j++) {
                const paragraphText = `This paragraph explores the intricacies of ${tag} development. ${j === 1
                    ? 'We start with the core principles and essential setup.'
                    : j === 2
                        ? 'Then, we delve into more complex patterns and common challenges.'
                        : 'Finally, we discuss optimization techniques and industry best practices to write robust and scalable applications.'
                    }`;

                const paragraph = await prisma.paragraph.create({
                    data: {
                        text: paragraphText,
                        chapterId: chapter.id,
                    },
                });

                // Add code sections to the first paragraph of each chapter
                if (j === 1) {
                    let codeSnippet = '';
                    let codeLanguage = '';
                    let codeCaption = '';

                    switch (tag) {
                        case 'angular':
                            codeLanguage = 'typescript';
                            codeSnippet = `// Angular Component Example
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Hello, Angular!</h1>'
})
export class AppComponent {
  title = 'my-angular-app';
}`;
                            codeCaption = 'A basic Angular component structure.';
                            break;
                        case 'node':
                            codeLanguage = 'javascript';
                            codeSnippet = `// Node.js Express Server Example
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, Node.js with Express!');
});

app.listen(port, () => {
  console.log(\`Server listening on port \${port}\`);
});`;
                            codeCaption = 'Simple Express.js server setup.';
                            break;
                        case 'react':
                            codeLanguage = 'jsx';
                            codeSnippet = `// React Functional Component Example
import React from 'react';

function GreetUser({ name }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Welcome to your React journey.</p>
    </div>
  );
}

export default GreetUser;`;
                            codeCaption = 'A functional React component for greeting users.';
                            break;
                    }

                    await prisma.codeSection.create({
                        data: {
                            language: codeLanguage,
                            code: codeSnippet,
                            caption: codeCaption,
                            paragraphId: paragraph.id,
                        },
                    });
                }
            }
        }

        // Add realistic comments
        const comment1 = await prisma.comment.create({
            data: {
                text: `Fantastic article on ${tag}! I particularly enjoyed the section on best practices. Very insightful.`,
                articleID: article.id,
                userId: userId === john.id ? jane.id : john.id, // Comment by a different user
                createdAt: getRandomDate(creationDate, new Date()),
            },
        });

        await prisma.comment.create({
            data: {
                text: `Could you elaborate more on the performance optimization techniques for ${tag}?`,
                articleID: article.id,
                userId: userId === alex.id ? john.id : alex.id,
                createdAt: getRandomDate(creationDate, new Date()),
                parentId: comment1.id, // A reply to the first comment
            },
        });

        await prisma.comment.create({
            data: {
                text: `This cleared up a lot of my doubts. Thanks for the comprehensive guide!`,
                articleID: article.id,
                userId: userId === jane.id ? alex.id : jane.id,
                createdAt: getRandomDate(creationDate, new Date()),
            },
        });
    };

    // Define a start date for articles (e.g., 6 months ago)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // --- Create Angular Articles (Tag: 'angular') ---
    await createArticleWithContent(
        'Mastering Angular Components: A Comprehensive Guide',
        'Dive deep into Angular component architecture, lifecycle hooks, and effective data binding strategies. Learn how to build highly performant and maintainable Angular applications.',
        'angular',
        john.id,
        getRandomDate(sixMonthsAgo, new Date())
    );
    await createArticleWithContent(
        'State Management in Angular: NgRx vs. Akita Explained',
        'An in-depth comparison of popular state management solutions for Angular. Understand the pros and cons of NgRx and Akita to choose the best fit for your project.',
        'angular',
        jane.id,
        getRandomDate(sixMonthsAgo, new Date())
    );
    await createArticleWithContent(
        'Optimizing Angular Application Performance: Tips and Tricks',
        'Uncover essential techniques to boost your Angular app’s speed and responsiveness, from lazy loading modules to change detection strategies and beyond.',
        'angular',
        alex.id,
        getRandomDate(sixMonthsAgo, new Date())
    );
    // New Angular Article
    await createArticleWithContent(
        'Angular Universal: Server-Side Rendering for Better SEO and Performance',
        'Learn how to implement Angular Universal to enable server-side rendering (SSR) for your Angular applications, improving SEO and initial page load times.',
        'angular',
        john.id,
        getRandomDate(sixMonthsAgo, new Date())
    );

    // --- Create React Articles (Tag: 'react') ---
    await createArticleWithContent(
        'React Hooks Unleashed: Building Modern Functional Components',
        'Explore the power of React Hooks with practical examples. Learn how to manage state, side effects, and custom logic in your functional React components.',
        'react',
        jane.id,
        getRandomDate(sixMonthsAgo, new Date())
    );
    await createArticleWithContent(
        'Demystifying React Context API and Redux for State Management',
        'A clear guide to choosing between React Context API and Redux for global state management. Understand their use cases and implementation details.',
        'react',
        john.id,
        getRandomDate(sixMonthsAgo, new Date())
    );
    await createArticleWithContent(
        'Next.js for React Developers: A Full-Stack Approach',
        'Migrate your React projects to Next.js and leverage server-side rendering, static site generation, and API routes for enhanced performance and SEO.',
        'react',
        alex.id,
        getRandomDate(sixMonthsAgo, new Date())
    );
    // New React Article
    await createArticleWithContent(
        'Building Scalable React Applications with Micro-Frontends',
        'Discover the architecture and benefits of micro-frontends in React, and how they can help you build large-scale, independently deployable web applications.',
        'react',
        jane.id,
        getRandomDate(sixMonthsAgo, new Date())
    );

    // --- Create Node.js Articles (Tag: 'node') ---
    await createArticleWithContent(
        'Building RESTful APIs with Node.js and Express: A Step-by-Step Tutorial',
        'Learn to construct robust and scalable RESTful APIs using Node.js, Express, and MongoDB. Covers routing, middleware, and error handling.',
        'node',
        alex.id,
        getRandomDate(sixMonthsAgo, new Date())
    );
    await createArticleWithContent(
        'Asynchronous JavaScript in Node.js: Promises, Async/Await, and Callbacks',
        'Master asynchronous programming in Node.js. Understand the differences between callbacks, Promises, and async/await for cleaner, more efficient code.',
        'node',
        john.id,
        getRandomDate(sixMonthsAgo, new Date())
    );
    await createArticleWithContent(
        'Securing Your Node.js Applications: Best Practices for Authentication and Authorization',
        'Implement robust security measures in your Node.js apps. Learn about JWTs, OAuth, and secure password handling to protect your data and users.',
        'node',
        jane.id,
        getRandomDate(sixMonthsAgo, new Date())
    );
    // New Node.js Article
    await createArticleWithContent(
        'Real-time Applications with Node.js and WebSockets (Socket.IO)',
        'Dive into building real-time features like chat applications and live dashboards using Node.js with WebSockets and the Socket.IO library.',
        'node',
        alex.id,
        getRandomDate(sixMonthsAgo, new Date())
    );


    // --- Newsletter Subscribers ---
    await prisma.newsletterSubscription.upsert({
        where: { email: 'newsletter.fan1@example.com' },
        update: {},
        create: { email: 'newsletter.fan1@example.com', is_active: true },
    });
    await prisma.newsletterSubscription.upsert({
        where: { email: 'newsletter.fan2@example.com' },
        update: {},
        create: { email: 'newsletter.fan2@example.com', is_active: true },
    });
    await prisma.newsletterSubscription.upsert({
        where: { email: 'newsletter.fan3@example.com' },
        update: {},
        create: { email: 'newsletter.fan3@example.com', is_active: false }, // Example of inactive subscriber
    });
    await prisma.newsletterSubscription.upsert({
        where: { email: 'newsletter.fan4@example.com' },
        update: {},
        create: { email: 'newsletter.fan4@example.com', is_active: true },
    });


    console.log('Realistic data seeding finished successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });