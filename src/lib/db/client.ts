import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Use standard pg driver for local development
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export const db = drizzle(pool);
