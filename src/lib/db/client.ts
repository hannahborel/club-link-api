import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Only create database connection at runtime, not build time
let db: any;

if (typeof window === 'undefined' && process.env.DATABASE_URL) {
  try {
    // Server-side only, and only when DATABASE_URL is available
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql);
    console.log('✅ Database connection initialized');
  } catch (error) {
    console.error('❌ Failed to initialize database connection:', error);
    db = null;
  }
} else if (typeof window === 'undefined') {
  console.warn('⚠️ DATABASE_URL not set, database connection unavailable');
}

export { db };
