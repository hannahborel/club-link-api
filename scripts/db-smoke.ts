import * as dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables from env.development
dotenv.config({ path: 'env.development' });

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'No database URL found. Set DATABASE_URL in your env.development file and re-run.',
    );
  }

  console.log('Running DB smoke test against:', new URL(url).host);

  // Create a connection pool for the smoke test
  const pool = new Pool({ connectionString: url });

  try {
    // Ensure basic connectivity
    const versionRes = await pool.query('select version();');
    console.log('Connected to:', versionRes.rows[0]?.version);

    // 1) Insert a user
    const email = `smoke+${Date.now()}@example.com`;
    const role = 'member';
    const clerkId = `clerk_${Math.random().toString(36).slice(2)}`;
    const insertUser = await pool.query(
      'insert into users (email, role, clerk_id) values ($1, $2, $3) returning id;',
      [email, role, clerkId],
    );
    const userId = insertUser.rows[0]?.id as string | undefined;
    assert(userId, 'Failed to insert user');
    console.log('Inserted user id:', userId);

    // 2) Insert a gym_owner referencing the user
    const businessName = 'Smoke Test Fitness';
    const insertOwner = await pool.query(
      'insert into gym_owners (user_id, business_name) values ($1, $2) returning id;',
      [userId, businessName],
    );
    const ownerId = insertOwner.rows[0]?.id as string | undefined;
    assert(ownerId, 'Failed to insert gym owner');
    console.log('Inserted gym_owner id:', ownerId);

    // 3) Insert a gym referencing the gym_owner
    const gymName = 'Smoke Test Gym';
    const insertGym = await pool.query(
      'insert into gyms (owner_id, name, address, coordinates, amenities, status, monthly_fee) values ($1, $2, $3, $4, $5, $6, $7) returning id;',
      [
        ownerId,
        gymName,
        JSON.stringify({ line1: '123 Test', city: 'Testville' }),
        JSON.stringify({ lat: 0, lng: 0 }),
        JSON.stringify(['wifi']),
        'pending',
        '300.00',
      ],
    );
    const gymId = insertGym.rows[0]?.id as string | undefined;
    assert(gymId, 'Failed to insert gym');
    console.log('Inserted gym id:', gymId);

    // 4) Insert a member referencing the user and (optionally) the gym
    const insertMember = await pool.query(
      'insert into members (user_id, home_gym_id, subscription_type, subscription_status) values ($1, $2, $3, $4) returning id;',
      [userId, gymId, 'base_passport', 'active'],
    );
    const memberId = insertMember.rows[0]?.id as string | undefined;
    assert(memberId, 'Failed to insert member');
    console.log('Inserted member id:', memberId);

    // 5) Round-trip select to validate FKs work
    const joinRes = await pool.query(
      'select m.id as member_id, u.email, g.name as gym_name from members m join users u on u.id = m.user_id join gyms g on g.id = m.home_gym_id where m.id = $1;',
      [memberId],
    );
    assert(joinRes.rowCount === 1, 'FK join did not return exactly one row');
    console.log('Join check OK:', joinRes.rows[0]);

    // Cleanup (best-effort)
    await pool.query('delete from members where id = $1;', [memberId]);
    await pool.query('delete from gyms where id = $1;', [gymId]);
    await pool.query('delete from gym_owners where id = $1;', [ownerId]);
    await pool.query('delete from users where id = $1;', [userId]);
    console.log('Cleanup complete');

    console.log('DB smoke test SUCCESS');
  } finally {
    // Always close the pool
    await pool.end();
  }
}

main().catch((err) => {
  console.error('DB smoke test FAILED');
  console.error(err);
  process.exitCode = 1;
});
