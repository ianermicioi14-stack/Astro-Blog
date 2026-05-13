import { db } from '../src/db/index';
import { users } from '../src/db/schema';
import bcrypt from 'bcryptjs';

async function testSignup() {
  try {
    console.log('Testing Signup logic...');
    const username = 'testuser_' + Date.now();
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';

    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('Hash created:', passwordHash);

    console.log('Inserting user...');
    const inserted = await db.insert(users).values({
      username,
      email,
      passwordHash,
      createdAt: new Date(),
    }).returning();

    console.log('Insert result:', JSON.stringify(inserted, null, 2));
    
    if (inserted && inserted.length > 0) {
        console.log('SUCCESS: User inserted with ID:', inserted[0].id);
    } else {
        console.log('FAILURE: No user returned from insert.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Signup test failed:', err);
    process.exit(1);
  }
}

testSignup();
