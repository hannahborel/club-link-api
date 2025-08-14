import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Use standard pg driver for local development
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export const db = drizzle(pool);
