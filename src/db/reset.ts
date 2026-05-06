import { db } from './index';

/**
 * DATABASE RESET SCRIPT
 * This script clears all data and resets the Identity counters (auto-increments)
 * back to 0. This allows us to ensure the Admin becomes ID 1.
 */
async function reset() {
  try {
    console.log('Resetting database and IDs...');
    
    // 1. Clear all data (respecting foreign key order)
    await db.execute('DELETE FROM comments');
    await db.execute('DELETE FROM posts');
    await db.execute('DELETE FROM users');
    
    // 2. Reset the Identity counters (auto-increments) to 0
    // The next insert will result in ID 1
    await db.execute('DBCC CHECKIDENT ("users", RESEED, 0)');
    await db.execute('DBCC CHECKIDENT ("posts", RESEED, 0)');
    await db.execute('DBCC CHECKIDENT ("comments", RESEED, 0)');
    
    console.log('✅ Database cleared and IDs reset. Your next user will be ID 1.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Reset failed:', err);
    process.exit(1);
  }
}

reset();
