import { db } from './index';
import { posts, users } from './schema';

async function seed() {
  console.log('Seeding database...');

  const passwordHash = await Bun.password.hash('admin1234');

  const insertedUsers = await db.insert(users).output().values({
    username: 'SystemAdmin',
    email: 'admin@astroblog.dev',
    passwordHash,
    createdAt: new Date(),
  });

  const adminId = insertedUsers[0].id;

  await db.insert(posts).values([
    {
      title: 'Welcome to AstroBlog — Built for Speed, Designed for Beauty',
      slug: 'welcome-to-astroblog',
      excerpt: 'Discover how AstroBlog combines Astro, Drizzle ORM, SQL Server (MSSQL), and modern UI components to deliver a blazing fast, fully SSR-powered blogging platform.',
      content: `# Welcome to AstroBlog

Hello, and welcome to your new home on the internet.

AstroBlog is not just another blogging platform. It is a carefully crafted, high-performance content publishing system built on some of the most exciting technologies available today.

---

## The Technology Stack

### Astro — The Framework
Astro is a modern web framework with a unique "Islands Architecture" that ships zero JavaScript by default. Every page you see here was rendered on the server, giving you instant load times and excellent SEO performance out of the box.

### Bun — The Runtime
Forget Node.js — AstroBlog runs on Bun, the all-in-one JavaScript runtime built from scratch for speed. Bun handles everything from running the dev server to managing dependencies, ensuring a modern and fast development experience.

### Drizzle ORM & SQL Server — The Database Layer
Drizzle is a lightweight, TypeScript-first ORM that connects to our high-performance Microsoft SQL Server database. This means every database query is fully type-safe, auto-completed in your IDE, and runs against a production-grade relational database engine.

### Full.dev UI — The Design System
The interface you are looking at is powered by components from the Full.dev UI registry, a shadcn-compatible collection of beautiful Astro-native components. Combined with Tailwind CSS and a carefully tuned dark-mode color palette, the result is a premium design that feels as good as it looks.

---

## What Can You Do Here?

- **Read** beautifully formatted blog posts on any topic.
- **Sign Up** for a free account to become an author.
- **Write and Publish** your own posts with full text and optional cover photos.
- **Browse** the archives for older content.
- **Delete** posts that you have authored.

---

## Getting Started

To become a contributor, click the **Sign Up** button in the top navigation bar. Once your account is created, you will be taken back to the homepage where you can immediately start publishing by clicking the **New Post** button.

There are no complex editors or dashboards here. Just a clean form, your words, and an optional image. Write something worth reading.

---

## A Note on Design Philosophy

This blog was deliberately designed to feel premium without being overwhelming. The dark background with radial gradients creates depth. The frosted glass card effects add texture. The subtle hover animations and smooth page transitions ensure the interface feels alive and responsive.

Good design should be invisible — it should support the content, not compete with it. We hope you agree.

---

## Happy writing.

— The AstroBlog Team`,
      authorId: adminId,
      createdAt: new Date(),
    },
    {
      title: 'Why SQL Server is the Enterprise Choice',
      slug: 'sql-server-enterprise-choice',
      excerpt: 'SQL Server provides the reliability and performance needed for modern web applications. Combined with Bun and Drizzle, it makes for a powerful stack.',
      content: `Choosing the right database is critical for any application. While SQLite is great for small projects, SQL Server (MSSQL) brings enterprise-grade features and reliability to the table.

When combined with the speed of Bun and the type-safety of Drizzle ORM, you get a development experience that is both fast and robust.

In this project, we utilize SQL Server via the msnodesqlv8 driver, allowing us to leverage native Windows authentication and Named Pipes for stable, secure local development. This setup ensures that as the blog grows, the database layer can handle the load with ease.

Drizzle ORM acts as the bridge, providing a clean, TypeScript-first API that makes writing complex queries a breeze while maintaining full type safety across the entire application.`,
      authorId: adminId,
      createdAt: new Date(Date.now() - 86400000),
    },
  ]);

  console.log('Seeding complete! SystemAdmin user created with 2 posts.');
  console.log('Admin email: admin@astroblog.dev');
  console.log('Admin password: admin1234');
}

seed().catch(console.error);
