import { sql } from '@vercel/postgres';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const url = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
  if (!url) {
    throw new Error(
      'No Postgres URL found. Set POSTGRES_URL (pooled) or POSTGRES_URL_NON_POOLING (direct) and re-run.',
    );
  }

  console.log('Running DB smoke test against:', new URL(url).host);

  // Ensure basic connectivity
  const versionRes = await sql`select version();`;
  console.log('Connected to:', versionRes.rows[0]?.version);

  // 1) Insert a user
  const email = `smoke+${Date.now()}@example.com`;
  const role = 'member';
  const clerkId = `clerk_${Math.random().toString(36).slice(2)}`;
  const insertUser = await sql`
    insert into users (email, role, clerk_id)
    values (${email}, ${role}, ${clerkId})
    returning id;
  `;
  const userId = insertUser.rows[0]?.id as string | undefined;
  assert(userId, 'Failed to insert user');
  console.log('Inserted user id:', userId);

  // 2) Insert a gym_owner referencing the user
  const businessName = 'Smoke Test Fitness';
  const insertOwner = await sql`
    insert into gym_owners (user_id, business_name)
    values (${userId}, ${businessName})
    returning id;
  `;
  const ownerId = insertOwner.rows[0]?.id as string | undefined;
  assert(ownerId, 'Failed to insert gym owner');
  console.log('Inserted gym_owner id:', ownerId);

  // 3) Insert a gym referencing the gym_owner
  const gymName = 'Smoke Test Gym';
  const insertGym = await sql`
    insert into gyms (
      owner_id, name, address, coordinates, amenities, status, monthly_fee
    ) values (
      ${ownerId}, ${gymName}, ${sql.json({ line1: '123 Test', city: 'Testville' })},
      ${sql.json({ lat: 0, lng: 0 })}, ${sql.json(['wifi'])}, 'pending', '300.00'
    ) returning id;
  `;
  const gymId = insertGym.rows[0]?.id as string | undefined;
  assert(gymId, 'Failed to insert gym');
  console.log('Inserted gym id:', gymId);

  // 4) Insert a member referencing the user and (optionally) the gym
  const insertMember = await sql`
    insert into members (user_id, home_gym_id, subscription_type, subscription_status)
    values (${userId}, ${gymId}, 'base_passport', 'active')
    returning id;
  `;
  const memberId = insertMember.rows[0]?.id as string | undefined;
  assert(memberId, 'Failed to insert member');
  console.log('Inserted member id:', memberId);

  // 5) Round-trip select to validate FKs work
  const joinRes = await sql`
    select m.id as member_id, u.email, g.name as gym_name
    from members m
    join users u on u.id = m.user_id
    join gyms g on g.id = m.home_gym_id
    where m.id = ${memberId};
  `;
  assert(joinRes.rowCount === 1, 'FK join did not return exactly one row');
  console.log('Join check OK:', joinRes.rows[0]);

  // Cleanup (best-effort)
  await sql`delete from members where id = ${memberId};`;
  await sql`delete from gyms where id = ${gymId};`;
  await sql`delete from gym_owners where id = ${ownerId};`;
  await sql`delete from users where id = ${userId};`;
  console.log('Cleanup complete');

  console.log('DB smoke test SUCCESS');
}

main().catch((err) => {
  console.error('DB smoke test FAILED');
  console.error(err);
  process.exitCode = 1;
});
