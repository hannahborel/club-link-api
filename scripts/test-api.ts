import * as dotenv from 'dotenv';
import { db } from '../src/lib/db/client';
import { users } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testDatabaseConnection() {
  try {
    console.log('🔌 Testing database connection...');

    // Test basic connection
    const result = await db.select().from(users).limit(1);
    console.log('✅ Database connection successful');
    console.log(`📊 Found ${result.length} users in database`);

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

async function testCRUDOperations() {
  try {
    console.log('\n🧪 Testing CRUD operations...');

    // Test CREATE
    console.log('📝 Testing CREATE operation...');
    const newUser = await db
      .insert(users)
      .values({
        email: 'test@example.com',
        role: 'member',
        clerkId: 'test-clerk-id-' + Date.now(),
      })
      .returning();

    if (!newUser[0]) {
      throw new Error('Failed to create user');
    }

    console.log('✅ User created:', newUser[0].id);

    // Test READ
    console.log('📖 Testing READ operation...');
    const fetchedUser = await db.select().from(users).where(eq(users.id, newUser[0].id));
    if (fetchedUser[0]) {
      console.log('✅ User fetched:', fetchedUser[0].email);
    }

    // Test UPDATE
    console.log('✏️ Testing UPDATE operation...');
    const updatedUser = await db
      .update(users)
      .set({ email: 'updated@example.com' })
      .where(eq(users.id, newUser[0].id))
      .returning();

    if (updatedUser[0]) {
      console.log('✅ User updated:', updatedUser[0].email);
    }

    // Test DELETE
    console.log('🗑️ Testing DELETE operation...');
    const deletedUser = await db.delete(users).where(eq(users.id, newUser[0].id)).returning();

    if (deletedUser[0]) {
      console.log('✅ User deleted:', deletedUser[0].id);
    }

    console.log('\n🎉 All CRUD operations successful!');
    return true;
  } catch (error) {
    console.error('❌ CRUD operations failed:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting API test...\n');

  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.log('\n❌ Cannot proceed with CRUD tests without database connection');
    process.exit(1);
  }

  await testCRUDOperations();

  console.log('\n✨ API test completed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('💥 Test failed with error:', error);
  process.exit(1);
});
