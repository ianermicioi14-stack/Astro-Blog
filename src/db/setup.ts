import { db } from './index';

/**
 * CUSTOM DATABASE SETUP
 * Since drizzle-kit requires TCP/IP to push schemas, we use this script
 * to create the tables directly over our stable Named Pipes connection.
 */
async function setup() {
  try {
    console.log('Setting up database tables via Named Pipes...');
    
    // 1. Create Users table
    await db.execute(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
      CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(255) NOT NULL UNIQUE,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        is_admin BIT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT GETDATE()
      )
    `);

    // 2. Create Posts table
    await db.execute(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'posts')
      CREATE TABLE posts (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        slug NVARCHAR(255) NOT NULL UNIQUE,
        excerpt NVARCHAR(1000) NOT NULL,
        content NVARCHAR(MAX) NOT NULL,
        image NVARCHAR(255),
        author_id INT FOREIGN KEY REFERENCES users(id),
        created_at DATETIME NOT NULL DEFAULT GETDATE()
      )
    `);

    // 3. Create Comments table
    await db.execute(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'comments')
      CREATE TABLE comments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        post_id INT NOT NULL FOREIGN KEY REFERENCES posts(id),
        author_id INT FOREIGN KEY REFERENCES users(id),
        username NVARCHAR(255) NOT NULL,
        content NVARCHAR(MAX) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT GETDATE()
      )
    `);

    // 4. Ensure a base user exists so the 'admin' login works with Foreign Keys
    // We'll create a user with ID 1 to act as our primary Admin
    await db.execute(`
      IF NOT EXISTS (SELECT * FROM users WHERE username = 'Admin')
      BEGIN
        INSERT INTO users (username, email, password_hash, is_admin, created_at)
        VALUES ('Admin', 'admin', 'admin_placeholder', 1, GETDATE());
      END
    `);

    console.log('✅ Database setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Setup failed:', err);
    process.exit(1);
  }
}

setup();
