import * as dotenv from 'dotenv';
import { db } from '../src/lib/db/client';
import {
  users,
  gymOwners,
  gyms,
  members,
  visits,
  messages,
  accessCodes,
  subscriptions,
} from '../src/lib/db/schema';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function clearDatabase() {
  try {
    console.log('🧹 Clearing database...');

    // Clear in reverse order to maintain referential integrity
    await db.delete(visits);
    console.log('✅ Cleared visits');

    await db.delete(messages);
    console.log('✅ Cleared messages');

    await db.delete(accessCodes);
    console.log('✅ Cleared access codes');

    await db.delete(subscriptions);
    console.log('✅ Cleared subscriptions');

    await db.delete(members);
    console.log('✅ Cleared members');

    await db.delete(gyms);
    console.log('✅ Cleared gyms');

    await db.delete(gymOwners);
    console.log('✅ Cleared gym owners');

    await db.delete(users);
    console.log('✅ Cleared users');

    console.log('✨ Database cleared successfully!');
  } catch (error) {
    console.error('💥 Failed to clear database:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🔄 Starting database reset...\n');

    await clearDatabase();

    console.log('\n🌱 Now run "npm run db:seed" to populate with fresh test data');
  } catch (error) {
    console.error('💥 Database reset failed:', error);
    process.exit(1);
  }
}

main();
