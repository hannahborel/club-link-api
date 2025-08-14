import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST() {
  try {
    console.log('🚀 Starting minimal database migration...');

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const sql = neon(process.env.DATABASE_URL);

    // Test connection
    const testResult = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful:', testResult);

    // Enable UUID extension
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    console.log('✅ UUID extension enabled');

    // Create enums
    await sql`CREATE TYPE IF NOT EXISTS gym_status AS ENUM('pending', 'active', 'suspended')`;
    await sql`CREATE TYPE IF NOT EXISTS subscription_status AS ENUM('active', 'cancelled', 'past_due')`;
    await sql`CREATE TYPE IF NOT EXISTS subscription_type AS ENUM('gym_monthly', 'base_passport', 'unlimited_roamer')`;
    await sql`CREATE TYPE IF NOT EXISTS user_role AS ENUM('admin', 'owner', 'member')`;
    await sql`CREATE TYPE IF NOT EXISTS visit_status AS ENUM('booked', 'checked_in', 'completed', 'no_show')`;
    console.log('✅ All enums created');

    // Create tables without foreign keys first
    await sql`CREATE TABLE IF NOT EXISTS users (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), email text NOT NULL UNIQUE, role user_role NOT NULL, clerk_id text NOT NULL UNIQUE, created_at timestamptz DEFAULT now() NOT NULL, updated_at timestamptz DEFAULT now() NOT NULL)`;
    console.log('✅ users table created');

    await sql`CREATE TABLE IF NOT EXISTS gym_owners (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid NOT NULL, business_name text NOT NULL, contact_phone text, created_at timestamptz DEFAULT now() NOT NULL)`;
    console.log('✅ gym_owners table created');

    await sql`CREATE TABLE IF NOT EXISTS gyms (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), owner_id uuid NOT NULL, name text NOT NULL, address jsonb NOT NULL, coordinates jsonb NOT NULL, amenities jsonb NOT NULL, photos jsonb, opening_hours jsonb, status gym_status DEFAULT 'pending' NOT NULL, monthly_fee numeric(10, 2) NOT NULL, created_at timestamptz DEFAULT now() NOT NULL, updated_at timestamptz DEFAULT now() NOT NULL)`;
    console.log('✅ gyms table created');

    await sql`CREATE TABLE IF NOT EXISTS members (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid NOT NULL, home_gym_id uuid, preferred_name text, age integer, occupation text, location text, athlete_type jsonb, subscription_type subscription_type, subscription_status subscription_status, profile_photo text, bio text, phone text, social_accounts jsonb, preferences jsonb, created_at timestamptz DEFAULT now() NOT NULL, updated_at timestamptz DEFAULT now() NOT NULL)`;
    console.log('✅ members table created');

    await sql`CREATE TABLE IF NOT EXISTS visits (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), member_id uuid NOT NULL, gym_id uuid NOT NULL, visit_date timestamptz DEFAULT now() NOT NULL, check_in_time timestamptz, check_out_time timestamptz, status visit_status DEFAULT 'booked' NOT NULL, qr_code_used text, created_at timestamptz DEFAULT now() NOT NULL)`;
    console.log('✅ visits table created');

    await sql`CREATE TABLE IF NOT EXISTS messages (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), sender_id uuid NOT NULL, recipient_id uuid NOT NULL, gym_id uuid, content text NOT NULL, read_at timestamptz, created_at timestamptz DEFAULT now() NOT NULL)`;
    console.log('✅ messages table created');

    await sql`CREATE TABLE IF NOT EXISTS access_codes (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), code text NOT NULL UNIQUE, gym_id uuid, email text NOT NULL, role user_role NOT NULL, expires_at timestamptz NOT NULL, used_at timestamptz, created_at timestamptz DEFAULT now() NOT NULL)`;
    console.log('✅ access_codes table created');

    await sql`CREATE TABLE IF NOT EXISTS subscriptions (id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_id uuid NOT NULL, type subscription_type NOT NULL, status subscription_status NOT NULL, current_period_start timestamptz NOT NULL, current_period_end timestamptz NOT NULL, stripe_subscription_id text NOT NULL, created_at timestamptz DEFAULT now() NOT NULL, updated_at timestamptz DEFAULT now() NOT NULL)`;
    console.log('✅ subscriptions table created');

    console.log('✅ Minimal database migration completed successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Minimal database migration completed successfully',
        details: 'All tables and types created. Foreign keys can be added later if needed.',
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error('❌ Database migration failed:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', {
      message: errorMessage,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Database migration failed',
        details: errorMessage,
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
