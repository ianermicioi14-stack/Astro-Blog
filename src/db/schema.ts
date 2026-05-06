import { mssqlTable, nvarchar, int, datetime, bit } from 'drizzle-orm/mssql-core';

export const users = mssqlTable('users', {
  id: int('id').primaryKey().identity(),
  username: nvarchar('username', { length: 255 }).notNull().unique(),
  email: nvarchar('email', { length: 255 }).notNull().unique(),
  passwordHash: nvarchar('password_hash', { length: 255 }).notNull(),
  isAdmin: bit('is_admin').notNull().default(false),
  createdAt: datetime('created_at').notNull(),
});

export const posts = mssqlTable('posts', {
  id: int('id').primaryKey().identity(),
  title: nvarchar('title', { length: 255 }).notNull(),
  slug: nvarchar('slug', { length: 255 }).notNull().unique(),
  excerpt: nvarchar('excerpt', { length: 1000 }).notNull(),
  content: nvarchar('content', { length: 'max' }).notNull(),
  image: nvarchar('image', { length: 255 }),
  authorId: int('author_id').references(() => users.id),
  createdAt: datetime('created_at').notNull(),
});

export const comments = mssqlTable('comments', {
  id: int('id').primaryKey().identity(),
  postId: int('post_id').notNull().references(() => posts.id),
  authorId: int('author_id').references(() => users.id),
  username: nvarchar('username', { length: 255 }).notNull(),
  content: nvarchar('content', { length: 'max' }).notNull(),
  createdAt: datetime('created_at').notNull(),
});
