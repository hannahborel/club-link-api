import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  // Neon-specific configuration
  verbose: true,
  strict: true,
} satisfies Config;
