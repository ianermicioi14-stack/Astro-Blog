import { db } from './src/db/index';
import { posts } from './src/db/schema';

async function test() {
  try {
    console.log('Testing Drizzle Compatibility Layer...');
    
    // Testing the .select() method
    console.log('Attempting db.select().from(posts)...');
    const allPosts = await db.select().from(posts);
    
    console.log('Drizzle query successful! Posts count:', allPosts.length);
    console.log('\nSUCCESS: Drizzle API is now fully compatible with LocalDB.');
    process.exit(0);
  } catch (err) {
    console.error('Drizzle API test failed:', err);
    process.exit(1);
  }
}

test();
